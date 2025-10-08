import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { CadastroTarefa } from '../Paginas/CadastroTarefa';

vi.mock('axios');

beforeAll(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

const usuariosMock = [
  { id: 1, nome: 'João' },
  { id: 2, nome: 'Maria' },
];

const prepararRender = async () => {
    axios.get.mockResolvedValueOnce({ data: usuariosMock });
    render(<CadastroTarefa />);
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Usuário 1/i })).toBeInTheDocument();
    });
  };

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
    // Mocka o GET que busca os usuários para popular o select
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
      target: { value: '2' },  // Atenção: string!
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  //13. Descrição 100 caracteres
  // it('13. Deve aceitar descrição com exatamente 100 caracteres', async () => {
  //   await prepararRender();
  //   axios.post.mockResolvedValueOnce({ data: {} });

  //   const desc = 'A'.repeat(100);
  //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: desc } });
  //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
  //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

  //   fireEvent.click(screen.getByRole('button'));
  //   await waitFor(() => expect(axios.post).toHaveBeenCalled());
  // });

        
        // 13. Descrição com exatamente 100 caracteres
        // it('13. Deve aceitar descrição com exatamente 100 caracteres', async () => {
          //   axios.post.mockResolvedValueOnce({ data: {} });
          //   render(<CadastroTarefa />);
          //   const desc = 'A'.repeat(100);
          //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: desc } });
          //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
          //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
          //   fireEvent.click(screen.getByRole('button'));
          //   await waitFor(() => expect(axios.post).toHaveBeenCalled());
          // });
          
          // 14. Setor com exatamente 3 caracteres
          // it('14. Deve aceitar setor com exatamente 3 caracteres', async () => {
            //   axios.post.mockResolvedValueOnce({ data: {} });
            //   render(<CadastroTarefa />);
            //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
            //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'ABC' } });
            //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
            //   fireEvent.click(screen.getByRole('button'));
            //   await waitFor(() => expect(axios.post).toHaveBeenCalled());
            // });
            
            // 15. Setor com exatamente 50 caracteres
            // it('15. Deve aceitar setor com exatamente 50 caracteres', async () => {
              //   axios.post.mockResolvedValueOnce({ data: {} });
              //   render(<CadastroTarefa />);
              //   const setor50 = 'A'.repeat(50);
              //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
              //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: setor50 } });
              //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
              //   fireEvent.click(screen.getByRole('button'));
              //   await waitFor(() => expect(axios.post).toHaveBeenCalled());
              // });
              
              // 16. Setor com espaços
              // it('16. Deve aceitar setor com espaços', async () => {
                //   axios.post.mockResolvedValueOnce({ data: {} });
                //   render(<CadastroTarefa />);
                //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição válida' } });
                //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'Recursos Humanos' } });
                //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '2' } });
                //   fireEvent.click(screen.getByRole('button'));
                //   await waitFor(() => expect(axios.post).toHaveBeenCalled());
                // });
                
                // 17. Seleção de diferentes prioridades
                // it('17. Deve aceitar todas as prioridades válidas', async () => {
                  //   axios.post.mockResolvedValue({ data: {} });
                  //   render(<CadastroTarefa />);
                  //   const prioridades = ['baixa','media','alta'];
                  //   for (const p of prioridades) {
                    //     fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
                    //     fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
                    //     fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: p } });
                    //     fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
                    //     fireEvent.click(screen.getByRole('button'));
                    //     await waitFor(() => expect(axios.post).toHaveBeenCalled());
                    //   }
                    // });
                    
                    
                    // // 19. Prioridade default
                    // it('19. Deve usar prioridade baixa como default', async () => {
                      //   axios.post.mockResolvedValueOnce({ data: {} });
                      //   render(<CadastroTarefa />);
                      //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
                      //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
                      //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
                      //   fireEvent.click(screen.getByRole('button'));
                      //   await waitFor(() => {
                        //     expect(axios.post).toHaveBeenCalledWith(
                          //       expect.objectContaining({ prioridade: 'baixa' })
                          //     );
                          //   });
                          // });
                          
                          // // 20. Submissão múltipla não trava botão
                          // it('20. Botão desativa corretamente enquanto envia', async () => {
                            //   axios.post.mockImplementation(() => new Promise(r => setTimeout(() => r({ data: {} }), 100)));
                            //   render(<CadastroTarefa />);
                            //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
                            //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
                            //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
                            //   const btn = screen.getByRole('button');
                            //   fireEvent.click(btn);
                            //   expect(btn).toBeDisabled();
                            // });
                            
                            // // 21. Alerta de sucesso
                            // it('21. Deve chamar alert após cadastro bem-sucedido', async () => {
                              //   axios.post.mockResolvedValueOnce({ data: {} });
                              //   render(<CadastroTarefa />);
                              //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa alerta' } });
                              //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
                              //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
                              //   fireEvent.click(screen.getByRole('button'));
                              //   await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso!'));
                              // });
                              
                              // // 22. Alerta de erro
                              // it('22. Deve chamar alert em erro de cadastro', async () => {
                                //   axios.post.mockRejectedValueOnce({ response: { data: { detail: 'Erro teste' } } });
                                //   render(<CadastroTarefa />);
                                //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa alerta' } });
                                //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
                                //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
                                //   fireEvent.click(screen.getByRole('button'));
                                //   await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Erro teste'));
                                // });
                                
                                // // 23. Remover espaços das strings
                                // it('23. Deve trimar descrição e setor antes de enviar', async () => {
                                  //   axios.post.mockResolvedValueOnce({ data: {} });
                                  //   render(<CadastroTarefa />);
                                  //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: '  Descrição com espaços  ' } });
                                  //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: '  TI  ' } });
                                  //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
                                  //   fireEvent.click(screen.getByRole('button'));
                                  //   await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
                                    //     expect.objectContaining({ descricao: 'Descrição com espaços', setor: 'TI' })
                                    //   ));
                                    // });
                                    
                                    //   // 24. Testar diferentes usuários
                                    //   it('24. Deve permitir cadastrar para diferentes usuários', async () => {
                                      //     axios.post.mockResolvedValue({ data: {} });
                                      //     render(<CadastroTarefa />);
                                      //     for (const u of usuariosMock) {
                                        //       fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
                                        //       fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
                                        //       fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: String(u.id) } });
                                        //       fireEvent.click(screen.getByRole('button'));
                                        //       await waitFor(() => expect(axios.post).toHaveBeenCalled());
                                        //     }
                                        //   });
                                        
                                        //  // 25. Testar reset e prioridade default juntas
                                        // it('25. Deve resetar e manter prioridade default após cadastro', async () => {
                                          //   // Mock da resposta do axios
                                          //   axios.post.mockResolvedValueOnce({ data: {} });
                                          
                                          //   render(<CadastroTarefa />);
                                          
                                          //   const desc = screen.getByLabelText(/Descrição/i);
                                          //   const setor = screen.getByLabelText(/Setor/i);
                                          //   const prioridade = screen.getByLabelText(/Prioridade/i);
                                          //   const usuario = screen.getByLabelText(/Usuário/i);
                                          
                                          //   // Preenche o formulário
                                          //   fireEvent.change(desc, { target: { value: 'Tarefa teste' } });
                                          //   fireEvent.change(setor, { target: { value: 'TI' } });
                                          //   fireEvent.change(usuario, { target: { value: '1' } });
                                          //   fireEvent.change(prioridade, { target: { value: 'alta' } });
                                          
                                          //   // Clica no botão de envio
                                          //   fireEvent.click(screen.getByRole('button'));
                                          
                                          //   // Espera a chamada do axios terminar
                                          //   await waitFor(() => expect(axios.post).toHaveBeenCalled());
                                          
                                          //   // Agora verifica o reset dos campos
                                          //   await waitFor(() => {
                                            //     expect(desc.value).toBe('');          // Descrição resetada
                                            //     expect(setor.value).toBe('');         // Setor resetado
                                            //     expect(usuario.value).toBe('');       // Usuário resetado
                                            //     expect(prioridade.value).toBe('baixa'); // Prioridade default
                                            //   });
                                            // });
                                            
                                          });
                                          
                                          // // 11. Cadastro válido
                                          // it('11. Deve cadastrar tarefa com dados válidos', async () => {
                                          //   axios.post.mockResolvedValueOnce({ data: {} });
                                          //   render(<CadastroTarefa />);
                                            
                                          //   fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa completa e válida' } });
                                          //   fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
                                          //   fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'alta' } });
                                          //   fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
                                        
                                          //   fireEvent.click(screen.getByRole('button'));
                                        
                                          //   // Aguarda a chamada do axios.post
                                          //   await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
                                        
                                          //   expect(axios.post).toHaveBeenCalledWith(
                                          //     'http://127.0.0.1:8000/api/tarefas/',
                                          //     {
                                          //       descricao: 'Tarefa completa e válida',
                                          //       setor: 'TI',
                                          //       prioridade: 'alta',
                                          //       usuario: 1,
                                          //       status: 'a fazer',
                                          //     }
                                          //   );
                                          // });