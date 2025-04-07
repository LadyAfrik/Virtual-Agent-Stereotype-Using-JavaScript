from rest_framework import serializers  # Importing the 'serializers' module from the Django REST Framework (DRF) to define how model data will be serialized to and from JSON.

# Importing the models that represent 'AttributeRanking', 'GenderSelection', and 'Users' from the current app's 'models.py' file.
from .models import AttributeRanking, GenderSelection, Users


# Serializer for the 'AttributeRanking' model
class AttributeRankingSerializer(serializers.ModelSerializer):
    class Meta:
        # Specifies the model this serializer is associated with ('AttributeRanking').
        model = AttributeRanking
        # Specifies that all fields from the model should be included in the serialized output.
        fields = '__all__'  # This means all fields in the 'AttributeRanking' model.

# Serializer for the 'GenderSelection' model
class GenderSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        # Specifies the model this serializer is associated with ('GenderSelection').
        model = GenderSelection
        # Specifies that all fields from the model should be included in the serialized output.
        fields = '__all__'  # This means all fields in the 'GenderSelection' model.

# Serializer for the 'Users' model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # Specifies the model this serializer is associated with ('Users').
        model = Users
        # Specifies that all fields from the model should be included in the serialized output.
        fields = '__all__'  # This means all fields in the 'Users' model.
