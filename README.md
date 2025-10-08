# Kanban - Sistema de Gerenciamento de Tarefas

Este projeto é uma aplicação web para gerenciamento de tarefas baseada na metodologia Kanban, composta por frontend em React e backend em Django.

## Funcionalidades

- Cadastro de tarefas com informações como título, descrição, prioridade e status.
- Cadastro de usuários para associar às tarefas.
- Visualização e gerenciamento das tarefas em colunas que representam diferentes estados (ex: A Fazer, Em Progresso, Concluído).
- Interface simples e intuitiva para facilitar o acompanhamento do progresso das tarefas.

## Tecnologias Utilizadas

### Frontend
- React.js
- Axios
- Vitest e React Testing Library (testes)

### Backend
- Django
- Django REST Framework (API REST)

## Estrutura do Projeto

- Frontend com páginas para cadastro de tarefas e usuários, além da visualização do Kanban.
- Backend com API para gerenciamento dos dados de usuários e tarefas.

## Como Rodar

### Backend (Django)

1. Crie e ative um ambiente virtual (recomendado):

```bash
python -m venv venv
venv\Scripts\activate  #Windows
pip install -r requirements.txt
#Por fim, rode o backend
python manage.py runserver
```
### Frontend (React)
```bash
npm install
#Para rodar
npm run dev
```

