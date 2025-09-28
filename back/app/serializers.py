from rest_framework import serializers
from .models import Tarefa, Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id','nome', 'email']

class TarefaSerializer(serializers.ModelSerializer):
    # campo para exibir os dados do usuário no GET
    usuario = UsuarioSerializer(source='idUsuario', read_only=True)
    
    # campo para aceitar o ID do usuário no POST/PUT
    idUsuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = Tarefa
        fields = ['id', 'descricao', 'nomeSetor', 'prioridade', 'status', 'idUsuario', 'usuario']
        