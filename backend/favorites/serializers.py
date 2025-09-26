from rest_framework import serializers
from .models import FavoriteRecipe

class FavoriteRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteRecipe
        fields = '__all__'
        read_only_fields = ['user'] 