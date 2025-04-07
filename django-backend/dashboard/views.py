# Import necessary libraries and modules
from django.shortcuts import render  # Import render function to render HTML templates
from rest_framework.views import APIView  # Import APIView to handle API requests
from rest_framework.response import Response  # Import Response to return HTTP responses from APIs
from django.http import HttpResponse  # Import HttpResponse to return simple HTTP responses
import csv  # Import csv to handle CSV file generation
from .models import AttributeRanking, Users, GenderSelection  # Import models for database tables
from .utils import fetch_ranking_data, perform_stat_test, interpret_findings, perform_friedman_test  # Import utility functions for statistical analysis
from django.db.models import Count, Avg, StdDev, Min, Max  # Import model aggregation functions for statistical calculations
from .serializers import (
    AttributeRankingSerializer,  # Import serializer for AttributeRanking model
    UserSerializer,  # Import serializer for Users model
    GenderSelectionSerializer,  # Import serializer for GenderSelection model
)

# --- Function-Based Views ---
def home(request):
    """
    Simple view to test if Django is working.
    Returns a basic response to confirm server is up.
    """
    return HttpResponse("Hello, Django is working perfectly!")

def dashboard_page(request):
    """
    Renders the dashboard template with various user engagement metrics and gender predictions.
    Includes:
    - User engagement metrics (e.g., total users, watched videos, demographics).
    - Gender prediction results (e.g., gender selection for virtual agents).
    - Attribute rankings data for visual representation (e.g., box plot data).
    """
    # User Engagement Metrics
    total_users = Users.objects.count()  # Count the total number of users
    watched_all = Users.objects.filter(watched_the_videos=1).count()  # Count users who have watched all videos
    percentage_watched_all = round((watched_all / total_users) * 100, 0) if total_users > 0 else 0  # Calculate percentage of users who watched all videos
    remaining_percentage = 100 - percentage_watched_all  # Calculate the remaining percentage of users who haven't watched all videos

    # Gender Distribution Metrics
    total_males = Users.objects.filter(gender='Male').count()  # Count the total number of male users
    total_females = Users.objects.filter(gender='Female').count()  # Count the total number of female users
    percentage_males = round((total_males / total_users) * 100, 0) if total_users > 0 else 0  # Calculate percentage of male users
    percentage_females = round((total_females / total_users) * 100, 0) if total_users > 0 else 0  # Calculate percentage of female users

    # Age Distribution Metrics
    mean_age = Users.objects.aggregate(Avg('age'))['age__avg']  # Calculate the average age of users
    std_dev_age = Users.objects.aggregate(StdDev('age'))['age__stddev']  # Calculate the standard deviation of age
    min_age = Users.objects.aggregate(Min('age'))['age__min']  # Find the minimum age of users
    max_age = Users.objects.aggregate(Max('age'))['age__max']  # Find the maximum age of users

    # Last Watched Video Distribution
    last_watched_distribution = Users.objects.values('last_watched_video').annotate(count=Count('last_watched_video'))  # Count users for each last watched video
    last_watched_labels = [f"Video {entry['last_watched_video']}" for entry in last_watched_distribution]  # Generate labels for each video
    last_watched_counts = [entry['count'] for entry in last_watched_distribution]  # Get the count of users for each video

    # Watched vs Not Watched Metrics
    watched_vs_not = {
        'watched': watched_all,  # Store the count of users who watched all videos
        'not_watched': total_users - watched_all  # Store the count of users who didn't watch all videos
    }

    # Gender Prediction Results
    gender_counts = GenderSelection.objects.values('agent_name', 'selected_gender').annotate(count=Count('selected_gender'))  # Count gender selections for each agent
    stacked_bar_data = {}  # Prepare data for stacked bar chart showing gender predictions for each agent
    for entry in gender_counts:
        agent = entry['agent_name']
        gender = entry['selected_gender']
        count = entry['count']
        if agent not in stacked_bar_data:
            stacked_bar_data[agent] = {'Male': 0, 'Female': 0, 'Androgynous': 0}  # Initialize the data for each agent if it doesn't exist
        stacked_bar_data[agent][gender] += count  # Add count to the gender category for each agent

    # Fetch distinct attributes for the dropdown in the template
    distinct_attributes = AttributeRanking.objects.values('attribute').distinct()  # Get distinct attributes from the AttributeRanking model

    # Prepare attribute rankings data for the box plot (categorizing rankings by agent and attribute)
    attributes = AttributeRanking.objects.values('agent_name', 'attribute', 'ranking')  # Get agent names, attributes, and rankings
    boxplot_data = {}  # Prepare data for the box plot visualization
    for entry in attributes:
        attribute = entry['attribute']
        agent = entry['agent_name']
        ranking = entry['ranking']
        if attribute not in boxplot_data:
            boxplot_data[attribute] = {}
        if agent not in boxplot_data[attribute]:
            boxplot_data[attribute][agent] = []
        boxplot_data[attribute][agent].append(ranking)  # Append the ranking to the respective agent and attribute

    # Combine all metrics into the context for the template
    context = {
        'total_users': total_users,
        'percentage_watched_all': percentage_watched_all,
        'remaining_percentage': remaining_percentage,
        'percentage_males': percentage_males,
        'percentage_females': percentage_females,
        'mean_age': round(mean_age, 2) if mean_age else None,
        'std_dev_age': round(std_dev_age, 2) if std_dev_age else None,
        'min_age': min_age,
        'max_age': max_age,
        'last_watched_labels': last_watched_labels,
        'last_watched_counts': last_watched_counts,
        'watched_vs_not': watched_vs_not,
        'stacked_bar_data': stacked_bar_data,
        'boxplot_data': boxplot_data,  # Pass the box plot data to the template
        'attributes': [attr['attribute'] for attr in distinct_attributes],  # Pass distinct attributes for dropdown
    }

    return render(request, 'dashboard/dashboard.html', context)

def ranking_analysis_view(request):
    """
    This view handles ranking analysis by performing statistical tests on ranking data.
    - Fetches ranking data.
    - Performs Kruskal-Wallis and Friedman tests.
    - Interprets the results and passes them to the template.
    """
    # Fetch ranking data
    ranking_data = fetch_ranking_data()

    # Perform the Kruskal-Wallis test (already done in perform_stat_test)
    test_results_kw = perform_stat_test()

    # Perform the Friedman test
    test_results_friedman = perform_friedman_test(ranking_data)

    # Generate interpretation using LLM for both tests
    interpretation_kw = interpret_findings(test_results_kw)
    interpretation_friedman = interpret_findings(test_results_friedman)

    # Traditional interpretations based on p-value thresholds
    traditional_interpretation_kw = "The Kruskal-Wallis test results show a statistical significance if the p-value is below 0.05. If the p-value is higher, the differences between groups are not statistically significant."
    traditional_interpretation_friedman = "The Friedman test indicates a significant difference between agents if the p-value is less than 0.05. Otherwise, no significant difference is detected."

    # Pass the data and test results to the template
    context = {
        'ranking_data': ranking_data[:10],  # Show the first 10 rows of ranking data
        'test_results_kw': test_results_kw,
        'test_results_friedman': test_results_friedman,
        'interpretation_kw': interpretation_kw,
        'interpretation_friedman': interpretation_friedman,
        'traditional_interpretation_kw': traditional_interpretation_kw,
        'traditional_interpretation_friedman': traditional_interpretation_friedman,
    }
    return render(request, 'dashboard/statistical_analysis.html', context)

def download_users(request):
    """
    This view generates and serves a CSV file of all users' data for download.
    """
    response = HttpResponse(content_type='text/csv')  # Set the content type to CSV
    response['Content-Disposition'] = 'attachment; filename="users.csv"'  # Set the file name for the download

    writer = csv.writer(response)  # Create a CSV writer
    writer.writerow([  # Write header row
        'email', 'gender', 'age', 'level_of_study',
        'affiliation', 'password', 'watched_the_videos', 'last_watched_video'
    ])

    # Write each user's data as a row in the CSV
    for user in Users.objects.all():
        writer.writerow([
            user.email, user.gender, user.age, user.level_of_study,
            user.affiliation, user.password, user.watched_the_videos, user.last_watched_video
        ])

    return response  # Return the response to trigger the file download

def download_attribute_rankings(request):
    """
    This view generates and serves a CSV file of all attribute rankings data for download.
    """
    response = HttpResponse(content_type='text/csv')  # Set the content type to CSV
    response['Content-Disposition'] = 'attachment; filename="attribute_rankings.csv"'  # Set the file name for the download

    writer = csv.writer(response)  # Create a CSV writer
    writer.writerow([  # Write header row
        'user_email', 'agent_name', 'attribute', 'category', 'ranking', 'created_at'
    ])

    # Write each attribute ranking's data as a row in the CSV
    for r in AttributeRanking.objects.all():
        writer.writerow([
            r.user_email, r.agent_name, r.attribute, r.category, r.ranking, r.created_at
        ])

    return response  # Return the response to trigger the file download

def download_gender_selections(request):
    """
    This view generates and serves a CSV file of all gender selection data for download.
    """
    response = HttpResponse(content_type='text/csv')  # Set the content type to CSV
    response['Content-Disposition'] = 'attachment; filename="gender_selections.csv"'  # Set the file name for the download

    writer = csv.writer(response)  # Create a CSV writer
    writer.writerow([  # Write header row
        'user_email', 'agent_name', 'selected_gender', 'created_at'
    ])

    # Write each gender selection's data as a row in the CSV
    for g in GenderSelection.objects.all():
        writer.writerow([
            g.user_email, g.agent_name, g.selected_gender, g.created_at
        ])

    return response  # Return the response to trigger the file download

# --- API Views ---
class AttributeRankingAPIView(APIView):
    """
    API to retrieve all attribute rankings or filter by agent_name and/or category.
    Supports optional query parameters:
    - agent_name (filter by agent)
    - category (filter by category)
    """
    def get(self, request):
        agent_name = request.query_params.get('agent_name', None)  # Get agent_name query parameter
        category = request.query_params.get('category', None)  # Get category query parameter

        # Filter attribute rankings based on provided query parameters
        if agent_name and category:
            rankings = AttributeRanking.objects.filter(agent_name=agent_name, category=category)
        elif agent_name:
            rankings = AttributeRanking.objects.filter(agent_name=agent_name)
        elif category:
            rankings = AttributeRanking.objects.filter(category=category)
        else:
            rankings = AttributeRanking.objects.all()  # Fetch all rankings if no filter is applied

        # Serialize the data and return it in the response
        serializer = AttributeRankingSerializer(rankings, many=True)
        return Response(serializer.data)

class UsersAPIView(APIView):
    """
    API to retrieve all users or filter by gender and/or level_of_study.
    Supports optional query parameters:
    - gender (filter by gender)
    - level_of_study (filter by level of study)
    """
    def get(self, request):
        gender = request.query_params.get('gender', None)  # Get gender query parameter
        level_of_study = request.query_params.get('level_of_study', None)  # Get level_of_study query parameter

        # Filter users based on the query parameters
        if gender and level_of_study:
            users = Users.objects.filter(gender=gender, level_of_study=level_of_study)
        elif gender:
            users = Users.objects.filter(gender=gender)
        elif level_of_study:
            users = Users.objects.filter(level_of_study=level_of_study)
        else:
            users = Users.objects.all()  # Fetch all users if no filter is applied

        # Serialize the user data and return the response
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class GenderSelectionAPIView(APIView):
    """
    API to retrieve all gender selections or filter by agent_name and/or selected_gender.
    Supports optional query parameters:
    - agent_name (filter by agent)
    - selected_gender (filter by selected gender)
    """
    def get(self, request):
        agent_name = request.query_params.get('agent_name', None)  # Get agent_name query parameter
        selected_gender = request.query_params.get('selected_gender', None)  # Get selected_gender query parameter

        # Filter gender selections based on query parameters
        if agent_name and selected_gender:
            gender_selections = GenderSelection.objects.filter(agent_name=agent_name, selected_gender=selected_gender)
        elif agent_name:
            gender_selections = GenderSelection.objects.filter(agent_name=agent_name)
        elif selected_gender:
            gender_selections = GenderSelection.objects.filter(selected_gender=selected_gender)
        else:
            gender_selections = GenderSelection.objects.all()  # Fetch all gender selections if no filter is applied

        # Serialize and return the gender selections data
        serializer = GenderSelectionSerializer(gender_selections, many=True)
        return Response(serializer.data)
