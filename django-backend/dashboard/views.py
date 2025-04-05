from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from .models import AttributeRanking, Users, GenderSelection
from django.db.models import Count, Avg, StdDev, Min, Max
from .serializers import (
    AttributeRankingSerializer,
    UserSerializer,
    GenderSelectionSerializer,
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
    total_users = Users.objects.count()
    watched_all = Users.objects.filter(watched_the_videos=1).count()
    percentage_watched_all = round((watched_all / total_users) * 100, 0) if total_users > 0 else 0
    remaining_percentage = 100 - percentage_watched_all  # Calculate the remaining percentage of users who haven't watched all videos

    # Gender Distribution Metrics
    total_males = Users.objects.filter(gender='Male').count()
    total_females = Users.objects.filter(gender='Female').count()
    percentage_males = round((total_males / total_users) * 100, 0) if total_users > 0 else 0
    percentage_females = round((total_females / total_users) * 100, 0) if total_users > 0 else 0

    # Age Distribution Metrics
    mean_age = Users.objects.aggregate(Avg('age'))['age__avg']
    std_dev_age = Users.objects.aggregate(StdDev('age'))['age__stddev']
    min_age = Users.objects.aggregate(Min('age'))['age__min']
    max_age = Users.objects.aggregate(Max('age'))['age__max']

    # Last Watched Video Distribution
    last_watched_distribution = Users.objects.values('last_watched_video').annotate(count=Count('last_watched_video'))
    last_watched_labels = [f"Video {entry['last_watched_video']}" for entry in last_watched_distribution]
    last_watched_counts = [entry['count'] for entry in last_watched_distribution]

    # Watched vs Not Watched Metrics
    watched_vs_not = {
        'watched': watched_all,
        'not_watched': total_users - watched_all
    }

    # Gender Prediction Results
    gender_counts = GenderSelection.objects.values('agent_name', 'selected_gender').annotate(count=Count('selected_gender'))
    stacked_bar_data = {}  # Prepare data for stacked bar chart showing gender predictions for each agent
    for entry in gender_counts:
        agent = entry['agent_name']
        gender = entry['selected_gender']
        count = entry['count']
        if agent not in stacked_bar_data:
            stacked_bar_data[agent] = {'Male': 0, 'Female': 0, 'Androgynous': 0}
        stacked_bar_data[agent][gender] += count

    # Fetch distinct attributes for the dropdown in the template
    distinct_attributes = AttributeRanking.objects.values('attribute').distinct()

    # Prepare attribute rankings data for the box plot (categorizing rankings by agent and attribute)
    attributes = AttributeRanking.objects.values('agent_name', 'attribute', 'ranking')
    boxplot_data = {}
    for entry in attributes:
        attribute = entry['attribute']
        agent = entry['agent_name']
        ranking = entry['ranking']
        if attribute not in boxplot_data:
            boxplot_data[attribute] = {}
        if agent not in boxplot_data[attribute]:
            boxplot_data[attribute][agent] = []
        boxplot_data[attribute][agent].append(ranking)

    # Combine all metrics into the context
    context = {
        # User Engagement Metrics
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
        # Gender Prediction Results
        'stacked_bar_data': stacked_bar_data,
        # Attribute Rankings Data
        'boxplot_data': boxplot_data,  # Data for the box plot
        'attributes': [attr['attribute'] for attr in distinct_attributes],  # Distinct attribute names for dropdown
    }

    return render(request, 'dashboard/dashboard.html', context)

# --- API Views ---

class AttributeRankingAPIView(APIView):
    """
    API to retrieve all attribute rankings or filter by agent_name and/or category.
    Supports optional query parameters:
    - agent_name (filter by agent)
    - category (filter by category)
    """
    def get(self, request):
        agent_name = request.query_params.get('agent_name', None)
        category = request.query_params.get('category', None)

        # Filter attribute rankings based on provided query parameters
        if agent_name and category:
            rankings = AttributeRanking.objects.filter(agent_name=agent_name, category=category)
        elif agent_name:
            rankings = AttributeRanking.objects.filter(agent_name=agent_name)
        elif category:
            rankings = AttributeRanking.objects.filter(category=category)
        else:
            rankings = AttributeRanking.objects.all()

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
        gender = request.query_params.get('gender', None)
        level_of_study = request.query_params.get('level_of_study', None)

        # Filter users based on the query parameters
        if gender and level_of_study:
            users = Users.objects.filter(gender=gender, level_of_study=level_of_study)
        elif gender:
            users = Users.objects.filter(gender=gender)
        elif level_of_study:
            users = Users.objects.filter(level_of_study=level_of_study)
        else:
            users = Users.objects.all()

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
        agent_name = request.query_params.get('agent_name', None)
        selected_gender = request.query_params.get('selected_gender', None)

        # Filter gender selections based on query parameters
        if agent_name and selected_gender:
            gender_selections = GenderSelection.objects.filter(agent_name=agent_name, selected_gender=selected_gender)
        elif agent_name:
            gender_selections = GenderSelection.objects.filter(agent_name=agent_name)
        elif selected_gender:
            gender_selections = GenderSelection.objects.filter(selected_gender=selected_gender)
        else:
            gender_selections = GenderSelection.objects.all()

        # Serialize and return the gender selections data
        serializer = GenderSelectionSerializer(gender_selections, many=True)
        return Response(serializer.data)
