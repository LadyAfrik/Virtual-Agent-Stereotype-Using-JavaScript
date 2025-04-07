from django.db import models  # Importing the 'models' module from Django, which is used to define the structure of database tables in Django's ORM (Object-Relational Mapping) system.

# Define a model for the Users table
class Users(models.Model):
    # 'id' is the primary key of the table, auto-incremented by default.
    id = models.AutoField(primary_key=True)

    # 'email' stores the user's email address (up to 255 characters).
    email = models.CharField(max_length=255)

    # 'gender' stores the gender of the user (up to 50 characters).
    gender = models.CharField(max_length=50)

    # 'age' stores the age of the user as an integer.
    age = models.IntegerField()

    # 'level_of_study' stores the user's level of study (up to 100 characters).
    level_of_study = models.CharField(max_length=100)

    # 'affiliation' stores the user's affiliation (up to 100 characters).
    affiliation = models.CharField(max_length=100)

    # 'password' stores the user's password (up to 255 characters).
    password = models.CharField(max_length=255)

    # 'watched_the_videos' is a boolean indicating if the user has watched the videos.
    watched_the_videos = models.BooleanField(default=False)

    # 'last_watched_video' stores the name of the last video watched by the user.
    last_watched_video = models.CharField(max_length=255, null=True)

    class Meta:
        # The 'Meta' class specifies the name of the table this model maps to.
        # Here, it's mapping to the existing 'users' table in the database.
        db_table = 'users'

# Define a model for the AttributeRanking table
class AttributeRanking(models.Model):
    # 'id' is the primary key of the table, auto-incremented by default.
    id = models.AutoField(primary_key=True)

    # 'user_email' stores the email of the user who provided the ranking.
    user_email = models.CharField(max_length=255)

    # 'agent_name' stores the name of the agent being ranked.
    agent_name = models.CharField(max_length=100)

    # 'attribute' stores the specific attribute that was ranked (e.g., "intelligence").
    attribute = models.CharField(max_length=100)

    # 'category' stores the category of the attribute (e.g., "physical" or "emotional").
    category = models.CharField(max_length=100)

    # 'ranking' stores the user's ranking of the agent for the given attribute.
    ranking = models.IntegerField()

    # 'created_at' stores the date and time when the ranking was created.
    created_at = models.DateTimeField()

    class Meta:
        # The 'Meta' class specifies the name of the table this model maps to.
        # Here, it's mapping to the existing 'attribute_rankings' table in the database.
        db_table = 'attribute_rankings'

# Define a model for the GenderSelection table
class GenderSelection(models.Model):
    # 'id' is the primary key of the table, auto-incremented by default.
    id = models.AutoField(primary_key=True)

    # 'agent_name' stores the name of the agent for which the gender was selected.
    agent_name = models.CharField(max_length=100)

    # 'selected_gender' stores the selected gender (e.g., "Male", "Female", "Other").
    selected_gender = models.CharField(max_length=50)

    # 'user_email' stores the email of the user who made the gender selection.
    user_email = models.CharField(max_length=255)

    # 'created_at' stores the date and time when the gender selection was made.
    created_at = models.DateTimeField()

    class Meta:
        # The 'Meta' class specifies the name of the table this model maps to.
        # Here, it's mapping to the existing 'gender_selections' table in the database.
        db_table = 'gender_selections'
