from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=60)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.nome

class Tarefa(models.Model):
    tipos_prioridade = [
        ('baixa', 'Baixa'), 
        ('media', 'Média'),
        ('alta', 'Alta'),
    ]

    tipos_status = [
        ('a fazer', 'A fazer'), 
        ('fazendo', 'Fazendo'), 
        ('pronto', 'Pronto'),
    ]

    idUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    descricao = models.CharField(max_length=200)
    nomeSetor = models.CharField(max_length=30)
    prioridade = models.CharField(max_length=10, choices=tipos_prioridade)
    status = models.CharField(max_length=10, choices=tipos_status, default='a fazer')
    data = models.DateField(auto_now_add=True) 

    def __str__(self):
        return f"Tarefa #{self.id} - {self.descricao[:20]}"
