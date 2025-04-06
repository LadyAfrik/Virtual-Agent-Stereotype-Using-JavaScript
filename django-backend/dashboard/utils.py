import pandas as pd
import numpy as np
from scipy.stats import mannwhitneyu,friedmanchisquare
from openai import RateLimitError

def fetch_ranking_data():
    from dashboard.models import Users, AttributeRanking

    # Prefetch all Users and AttributeRanking data
    users = Users.objects.all()  # Get all Users
    rankings = AttributeRanking.objects.all()  # Get all Attribute Rankings

    # Create a mapping of user_email -> gender for faster lookups
    user_email_to_gender = {user.email: user.gender for user in users}

    # Enrich ranking data with gender information
    enriched_data = []
    for ranking in rankings.values('user_email', 'agent_name', 'attribute', 'ranking'):
        gender = user_email_to_gender.get(ranking['user_email'], None)  # Map user_email to gender
        ranking['gender'] = gender
        enriched_data.append(ranking)

    return enriched_data

def perform_stat_test():
    from scipy.stats import kruskal

    # Fetch the enriched ranking data
    ranking_data = fetch_ranking_data()

    # Separate rankings by gender
    male_rankings = [item['ranking'] for item in ranking_data if item['gender'] == 'Male']
    female_rankings = [item['ranking'] for item in ranking_data if item['gender'] == 'Female']
    other_rankings = [item['ranking'] for item in ranking_data if item['gender'] == 'Others']

    # Only include non-empty groups in the test
    groups = []
    if male_rankings:
        groups.append(male_rankings)
    if female_rankings:
        groups.append(female_rankings)
    if other_rankings:
        groups.append(other_rankings)

    if len(groups) < 2:
        return {
            "test_statistic": None,
            "p_value": None,
            "error": "Need at least two groups with data for Kruskal-Wallis test."
        }

    # Run the Kruskal-Wallis H-test
    test_stat, p_value = kruskal(*groups)

    return {
        "test_statistic": round(test_stat, 3),
        "p_value": round(p_value, 3)
    }


def perform_friedman_test(ranking_data):
    """
    Perform the Friedman test for within-subjects ranking data.
    Assumes ranking_data is a list of rankings for each condition/agent across all participants.
    """
    # Separate rankings by participant and agent
    participant_rankings = {}

    for item in ranking_data:
        user_email = item['user_email']
        agent_name = item['agent_name']
        ranking = item['ranking']

        # Initialize the participant entry if not already present
        if user_email not in participant_rankings:
            participant_rankings[user_email] = {
                'Male Agent': [],
                'Female Agent': [],
                'Androgynous Agent': []
            }

        # Append the ranking for the corresponding agent
        participant_rankings[user_email][agent_name].append(ranking)

    # Check if all participants have ranked all agents across all attributes
    for user_email, agents in participant_rankings.items():
        if any(len(rankings) != 12 for rankings in agents.values()):
            return {
                "test_statistic": None,
                "p_value": None,
                "error": f"Participant {user_email} does not have 12 rankings for each agent."
            }

    # Now, structure the rankings as lists for the Friedman test
    male_rankings = []
    female_rankings = []
    androgynous_rankings = []

    for user_email, agents in participant_rankings.items():
        male_rankings.append(agents['Male Agent'])
        female_rankings.append(agents['Female Agent'])
        androgynous_rankings.append(agents['Androgynous Agent'])

    # Run the Friedman test
    test_stat, p_value = friedmanchisquare(male_rankings, female_rankings, androgynous_rankings)

    # Ensure test_stat and p_value are scalar values before rounding
    if isinstance(test_stat, (list, np.ndarray)):
        test_stat = test_stat[0]
    if isinstance(p_value, (list, np.ndarray)):
        p_value = p_value[0]

    return {
        "test_statistic": round(test_stat, 3),
        "p_value": round(p_value, 3)
    }





def interpret_findings(test_results):
    """
    Use OpenAI's latest Chat API to interpret statistical test results.
    """
    from django.conf import settings
    from openai import OpenAI

    # Initialize OpenAI client
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    # Construct the messages
    messages = [
        {"role": "system", "content": "You are an expert statistical analyst."},
        {
            "role": "user",
            "content": f"""
            The Kruskal-Wallis H-test was used to compare rankings across different gender groups. The results are:
            - Test Statistic: {test_results['test_statistic']}
            - P-value: {test_results['p_value']}
            Interpret these findings in the context of ranking data for male, female and others participants.
            Explain whether the difference is statistically significant and its implications.
            """
        }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except RateLimitError as e:
        return "OpenAI API rate limit exceeded. Please try again later or check your API usage."
