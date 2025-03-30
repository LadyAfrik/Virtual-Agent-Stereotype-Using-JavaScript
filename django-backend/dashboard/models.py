from django.db import models

class Users(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=255)
    gender = models.CharField(max_length=50)
    age = models.IntegerField()
    level_of_study = models.CharField(max_length=100)
    affiliation = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    watched_the_videos = models.BooleanField(default=False)
    last_watched_video = models.CharField(max_length=255, null=True)

    class Meta:
        db_table = 'users'  # Map to the existing 'users' table

class AttributeRanking(models.Model):
    id = models.AutoField(primary_key=True)
    user_email = models.CharField(max_length=255)
    agent_name = models.CharField(max_length=100)
    attribute = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    ranking = models.IntegerField()
    created_at = models.DateTimeField()

    class Meta:
        db_table = 'attribute_rankings'  # Map to the existing 'attribute_rankings' table

class GenderSelection(models.Model):
    id = models.AutoField(primary_key=True)
    agent_name = models.CharField(max_length=100)
    selected_gender = models.CharField(max_length=50)
    user_email = models.CharField(max_length=255)
    created_at = models.DateTimeField()

    class Meta:
        db_table = 'gender_selections'  # Map to the existing 'gender_selections' table
