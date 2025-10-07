import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import axios from 'axios';
import '@testing-library/jest-dom';
import { CadastroUsuario } from '../Paginas/CadastroUsuario';

vi.mock('axios');

beforeAll(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('CadastroUsuario', () => {
  // 1. Nome muito curto
  it('1. Deve exibir erro se o nome for muito curto', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ana@teste.com' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
  });

  // 2. Cadastro com dados válidos
  it('2. Deve cadastrar usuário com dados válidos', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João da Silva' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@dominio.com' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/usuario/',
        { nome: 'João da Silva', email: 'joao@dominio.com' }
      );
    });
  });

  // 3. Nome muito longo
  it('3. Deve exibir erro se o nome for muito longo', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: 'A'.repeat(60) }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'teste@teste.com' }
    });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome deve ter no máximo 50 caracteres/i)).toBeInTheDocument();
  });

  // 4. Nome com letras repetidas em excesso
  it('4. Deve exibir erro se o nome contiver letras repetidas em excesso', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: 'Aaaaaanaaa' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'repetido@teste.com' }
    });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome não pode conter letras repetidas em excesso/i)).toBeInTheDocument();
  });

  // 5. Nome sem letras (ex: números)
  it('5. Deve exibir erro se o nome não tiver letras', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: '123456' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'semletras@teste.com' }
    });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome deve conter letras/i)).toBeInTheDocument();
  });

  // 6. E-mail vazio
  it('6. Deve exibir erro se o e-mail estiver vazio', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: 'Carlos Silva' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: '' }
    });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/Informe o e-mail/i)).toBeInTheDocument();
  });

  // 7. Deve limpar formulário após sucesso
  it('7. Deve resetar o formulário após cadastro bem-sucedido', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<CadastroUsuario />);
    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(nomeInput, { target: { value: 'Maria Lima' } });
    fireEvent.change(emailInput, { target: { value: 'maria@teste.com' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(nomeInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });
});
