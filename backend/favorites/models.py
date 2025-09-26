from django.db import models
from django.contrib.auth.models import User

class FavoriteRecipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_favorites')
    recipe_id = models.CharField(max_length=100)
    recipe_name = models.CharField(max_length=255)
    recipe_thumb = models.URLField()
    recipe_data = models.JSONField()

    def __str__(self):
        return f"{self.user.username} - {self.recipe_name}"  