from django.urls import path
from .views import (
    TarefaListCreateView, TarefaRetrieveUpdateDestroyView,
    UsuarioListCreateView, UsuarioRetrieveUpdateDestroyView
)

urlpatterns = [
    # Tarefas
    path('tarefa/', TarefaListCreateView.as_view(), name='tarefas-list-create'),
    path('tarefa/<int:id>/', TarefaRetrieveUpdateDestroyView.as_view(), name='tarefas-detail'),

    # Usuários
    path('usuario/', UsuarioListCreateView.as_view(), name='usuarios-list-create'),
    path('usuario/<int:id>/', UsuarioRetrieveUpdateDestroyView.as_view(), name='usuarios-detail'),
]
