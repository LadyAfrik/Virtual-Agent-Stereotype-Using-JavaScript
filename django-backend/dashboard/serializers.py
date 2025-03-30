from rest_framework import serializers
from .models import AttributeRanking, GenderSelection, Users

class AttributeRankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeRanking
        fields = '__all__'

class GenderSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenderSelection
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
