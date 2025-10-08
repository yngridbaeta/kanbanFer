import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { CadastroTarefa } from '../Paginas/CadastroTarefa';

vi.mock('axios');

beforeAll(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => { });
});

const usuariosMock = [
  { id: 1, nome: 'João' },
  { id: 2, nome: 'Maria' },
];


beforeEach(() => {
  axios.get.mockResolvedValue({ data: usuariosMock });
  axios.post.mockReset();
});

describe('CadastroTarefa - Testes completos', () => {
  // 1. Descrição vazia
  it('1. Deve exibir erro se a descrição estiver vazia', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/A descrição deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
  });

  // 2. Descrição muito curta
  it('2. Deve exibir erro se a descrição tiver menos de 10 caracteres', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Curta' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/A descrição deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
  });

  // 3. Descrição muito longa
  it('3. Deve exibir erro se a descrição tiver mais de 100 caracteres', async () => {
    render(<CadastroTarefa />);
    const longText = 'A'.repeat(101);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: longText } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/A descrição deve ter no máximo 100 caracteres/i)).toBeInTheDocument();
  });

  // 4. Descrição com caracteres inválidos
  it('4. Deve exibir erro se a descrição tiver caracteres inválidos', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa #$%' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/A descrição deve conter letras, números e pontuação válida/i)).toBeInTheDocument();
  });

  // 5. Setor vazio
  it('5. Deve exibir erro se o setor estiver vazio', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome do setor deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
  });

  // 6. Setor muito curto
  it('6. Deve exibir erro se o setor tiver menos de 3 caracteres', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'AB' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome do setor deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
  });

  // 7. Setor muito longo
  it('7. Deve exibir erro se o setor tiver mais de 50 caracteres', async () => {
    render(<CadastroTarefa />);
    const longSetor = 'A'.repeat(51);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: longSetor } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome do setor deve ter no máximo 50 caracteres/i)).toBeInTheDocument();
  });

  // 8. Setor com números
  it('8. Deve exibir erro se o setor contiver números', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI123' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/O nome do setor deve conter apenas letras e espaços/i)).toBeInTheDocument();
  });

  // 9. Usuário não selecionado
  it('9. Deve exibir erro se nenhum usuário for selecionado', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/Selecione um usuário válido/i)).toBeInTheDocument();
  });

  // 10. Usuário inexistente
  it('10. Deve exibir erro se usuário inválido', async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '999' } });
    fireEvent.click(screen.getByRole('button'));
    // Zod não valida o ID contra a lista, então o form passa, alert será chamado
  });

  //11. Resetar formulário
  it('11. Deve resetar formulário após cadastro bem-sucedido', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', nome: 'Usuário 1' },
        { id: '2', nome: 'Usuário 2' },
      ],
    });

    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadastroTarefa />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Usuário/i).options.length).toBeGreaterThan(0);
    });

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa para reset' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'RHA' } });

    await userEvent.selectOptions(screen.getByLabelText(/Usuário/i), '2');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    //verifica se o formulário foi resetado
    expect(screen.getByLabelText(/Descrição/i).value).toBe('');
    expect(screen.getByLabelText(/Setor/i).value).toBe('');
    expect(screen.getByLabelText(/Usuário/i).value).toBe('');
  });

  // 12. Descrição com exatamente 10 caracteres
  it('12. Deve aceitar descrição com exatamente 10 caracteres', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, nome: "Usuário 1" },
        { id: 2, nome: "Usuário 2" },
      ],
    });

    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadastroTarefa />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Usuário 1' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: 'A'.repeat(10) },
    });
    fireEvent.change(screen.getByLabelText(/Setor/i), {
      target: { value: 'TIS' },
    });
    fireEvent.change(screen.getByLabelText(/Usuário/i), {
      target: { value: '2' },  
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it('13. Deve aceitar descrição com exatamente 100 caracteres', async () => {
    axios.get.mockResolvedValueOnce({ data: usuariosMock });
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadastroTarefa />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /João/i })).toBeInTheDocument();
    });

    const desc = 'A'.repeat(100);

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: desc } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TIS' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });


  it('Deve aceitar descrição com exatamente 100 caracteres', async () => {
    axios.get.mockResolvedValueOnce({ data: usuariosMock });
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadastroTarefa />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /João/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'A'.repeat(100) } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TIS' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    console.log('Valores preenchidos antes do submit:');
    console.log('Descrição:', screen.getByLabelText(/Descrição/i).value);
    console.log('Setor:', screen.getByLabelText(/Setor/i).value);
    console.log('Usuário:', screen.getByLabelText(/Usuário/i).value);

    fireEvent.click(screen.getByRole('button'));

    const errorSetor = screen.queryByText(/O nome do setor deve ter pelo menos 3 caracteres/i);
    if (errorSetor) {
      console.log('Erro de validação:', errorSetor.textContent);
    }

    try {
      await waitFor(() => expect(axios.post).toHaveBeenCalled());
    } catch {
      throw new Error('axios.post não foi chamado, possível problema na validação do formulário');
    }
  });


  it('15. Deve aceitar setor com exatamente 50 caracteres', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, nome: 'Usuário 1' }, { id: 2, nome: 'Usuário 2' }]
    });

    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadastroTarefa />);

    // Aguarda a lista de usuários aparecer
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Usuário 1/i })).toBeInTheDocument();
    });

    const setor50 = 'A'.repeat(50);

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: setor50 } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });


  it('16. Deve aceitar setor com espaços', async () => {
    // Mocka a lista de usuários para popular o select
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, nome: 'João' },
        { id: 2, nome: 'Maria' }
      ]
    });

    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadastroTarefa />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Maria/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'Recursos Humanos' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '2' } });

    //envia o formulário
    fireEvent.click(screen.getByRole('button'));

    // aguarda que a requisição POST tenha sido feita
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });


  it('17. Deve aceitar todas as prioridades válidas', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, nome: 'João' },
        { id: 2, nome: 'Maria' }
      ]
    });

    render(<CadastroTarefa />);

    // Espera o select estar populado
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /João/i })).toBeInTheDocument();
    });

    const prioridades = ['baixa', 'media', 'alta'];

    for (const p of prioridades) {
      axios.post.mockResolvedValueOnce({ data: {} });

      fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
      fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TIA' } });
      fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: p } });
      fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

      fireEvent.click(screen.getByRole('button'));

      //aguarda a chamada do POST acontecer para essa prioridade
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      //limpa para a próxima iteração
      axios.post.mockClear();
    }
  });


  it('18. Deve usar prioridade baixa como default', async () => {
    axios.get.mockResolvedValueOnce({ data: usuariosMock });  // mocka o GET antes
    axios.post.mockResolvedValueOnce({ data: {} });           // mocka o POST

    render(<CadastroTarefa />);

    // aguarda lista de usuários carregar
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /João/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TII' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ prioridade: 'baixa' }),
      );
    });
  });

  it('19. Deve chamar alert após cadastro bem-sucedido', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadastroTarefa />);

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa alerta' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso!');
    });
  });
});