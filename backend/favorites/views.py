from rest_framework import generics, permissions
from .models import FavoriteRecipe
from .serializers import FavoriteRecipeSerializer

# List and create favorite recipes
class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteRecipe.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Delete a specific favorite recipe
class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteRecipe.objects.filter(user=self.request.user)
