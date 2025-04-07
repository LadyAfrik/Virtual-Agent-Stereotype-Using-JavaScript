# Import necessary libraries
import pandas as pd  # For handling data manipulation and analysis
import numpy as np  # For numerical operations, especially with arrays
from scipy.stats import mannwhitneyu, friedmanchisquare  # Statistical tests for non-parametric data
from openai import RateLimitError  # For handling OpenAI API rate limit errors

def fetch_ranking_data():
    """
    Fetches and enriches ranking data by including gender information for each user.
    Returns a list of enriched ranking data with user gender included.
    """
    from dashboard.models import Users, AttributeRanking  # Import models to access user and ranking data

    # Prefetch all Users and AttributeRanking data from the database
    users = Users.objects.all()  # Fetch all Users from the database
    rankings = AttributeRanking.objects.all()  # Fetch all Attribute Rankings from the database

    # Create a mapping of user_email -> gender for faster lookups
    user_email_to_gender = {user.email: user.gender for user in users}

    # Enrich ranking data with gender information
    enriched_data = []
    for ranking in rankings.values('user_email', 'agent_name', 'attribute', 'ranking'):
        gender = user_email_to_gender.get(ranking['user_email'], None)  # Map user_email to gender
        ranking['gender'] = gender  # Add the gender to each ranking entry
        enriched_data.append(ranking)  # Add the enriched ranking data to the list

    return enriched_data  # Return the enriched data

def perform_stat_test():
    """
    Perform the Kruskal-Wallis H-test to compare rankings across gender groups.
    Returns a dictionary with test statistic and p-value.
    """
    from scipy.stats import kruskal  # Import Kruskal-Wallis test from scipy.stats

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

    # Check if there are at least two groups with data for the Kruskal-Wallis test
    if len(groups) < 2:
        return {
            "test_statistic": None,
            "p_value": None,
            "error": "Need at least two groups with data for Kruskal-Wallis test."
        }

    # Run the Kruskal-Wallis H-test
    test_stat, p_value = kruskal(*groups)

    # Return the test results, rounded to 3 decimal places
    return {
        "test_statistic": round(test_stat, 3),
        "p_value": round(p_value, 3)
    }

def perform_friedman_test(ranking_data):
    """
    Perform the Friedman test for within-subjects ranking data.
    Assumes ranking_data is a list of rankings for each condition/agent across all participants.
    Returns a dictionary with test statistic and p-value.
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
                'Male Agent': [],  # List for male agent rankings
                'Female Agent': [],  # List for female agent rankings
                'Androgynous Agent': []  # List for androgynous agent rankings
            }

        # Append the ranking for the corresponding agent
        participant_rankings[user_email][agent_name].append(ranking)

    # Check if all participants have ranked all agents across all attributes
    for user_email, agents in participant_rankings.items():
        if any(len(rankings) != 12 for rankings in agents.values()):  # Ensure each participant has 12 rankings
            return {
                "test_statistic": None,
                "p_value": None,
                "error": f"Participant {user_email} does not have 12 rankings for each agent."
            }

    # Structure the rankings as lists for the Friedman test
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

    # Return the test results, rounded to 3 decimal places
    return {
        "test_statistic": round(test_stat, 3),
        "p_value": round(p_value, 3)
    }

def interpret_findings(test_results):
    """
    Use OpenAI's latest Chat API to interpret statistical test results.
    Uses OpenAI to interpret Kruskal-Wallis or Friedman test findings.
    """
    from django.conf import settings  # To access Django settings for API keys
    from openai import OpenAI  # OpenAI's API client

    # Initialize OpenAI client with API key from Django settings
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    # Construct the messages to send to the OpenAI model
    messages = [
        {"role": "system", "content": "You are an expert statistical analyst."},
        {
            "role": "user",
            "content": f"""
            The Kruskal-Wallis H-test was used to compare rankings across different gender groups. The results are:
            - Test Statistic: {test_results['test_statistic']}
            - P-value: {test_results['p_value']}
            Interpret these findings in the context of ranking data for male, female, and others participants.
            Explain whether the difference is statistically significant and its implications.
            """
        }
    ]

    try:
        # Send the request to OpenAI API and get the response
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Using the GPT-3.5 model
            messages=messages,  # Send the constructed messages
            max_tokens=150,  # Limit the response to 150 tokens
            temperature=0.7  # Set the creativity level of the response
        )
        # Return the interpreted response from the model
        return response.choices[0].message.content.strip()
    except RateLimitError as e:
        # Handle OpenAI API rate limit errors gracefully
        return "OpenAI API rate limit exceeded. Please try again later or check your API usage."
