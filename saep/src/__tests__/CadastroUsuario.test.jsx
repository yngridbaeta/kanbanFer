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

  // 2. Nome muito longo
  it('2. Deve exibir erro se o nome for muito longo', async () => {
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

  // 3. Nome com letras repetidas em excesso
  it('3. Deve exibir erro se o nome contiver letras repetidas em excesso', async () => {
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

  // 4. Nome sem letras (ex: números)
  it('4. Deve exibir erro se o nome não tiver letras', async () => {
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

  // 5. Email vazio
  it('5. Deve exibir erro se o e-mail estiver vazio', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: 'Carlos Silva' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/Informe o e-mail/i)).toBeInTheDocument();
  });

  // 6. Nome vazio
  it('6. Deve exibir erro se o nome estiver vazio', async () => {
  render(<CadastroUsuario />);
  fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'email@teste.com' } });
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByText(/O nome deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
});


  // 7. Ambos campos vazios
  it('7. Deve exibir erros se nome e e-mail estiverem vazios', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
    expect(await screen.findByText(/Informe o e-mail/i)).toBeInTheDocument();
  });

  // 8. Inserção de valores válidos
  it('8. Deve cadastrar usuário com dados válidos', async () => {
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

  // 9. Resetar formulário após sucesso
  it('9. Deve resetar o formulário após cadastro bem-sucedido', async () => {
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

  // // 10. Inserção de espaços nos campos 
  it('10. Deve exibir erro ao inserir apenas espaços nos campos', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '     ' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '     ' } });
    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByText(/O nome deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
    expect(await screen.findByText(/Informe o e-mail/i)).toBeInTheDocument();
  });

  // 11. Email inválido
  it('11. Deve exibir erro se o e-mail for inválido', async () => {
    render(<CadastroUsuario />);
    
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Usuário Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'emailinvalido' } });
    
    fireEvent.click(screen.getByRole('button'));
    
    screen.debug();
    
    await waitFor(() => {
      expect(screen.getByText(/Formato de e-mail inválido/i)).toBeInTheDocument();
    });
  });

  // 12. Números no nome
  it('12. Deve exibir erro se o nome contiver números misturados', async () => {
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João123' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@teste.com' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome não pode conter números/i)).toBeInTheDocument();
  });

  // 13. Nome com acentos válidos
  it('13. Deve aceitar nomes com acentos', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'José da Silva' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jose@teste.com' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/usuario/',
        { nome: 'José da Silva', email: 'jose@teste.com' }
      );
    });
  });

  // 14. Nome com quantidade mínima de caracteres 
  it('14. Deve aceitar nome com exatamente 5 caracteres', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Lucas' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'lucas@teste.com' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  // 15. Nome com quantidade máxima de caracteres 
  it('15. Deve aceitar nome com exatamente 50 caracteres', async () => {
    const nome50 = 'A'.repeat(50);
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<CadastroUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: nome50 } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'maxcaracteres@teste.com' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
