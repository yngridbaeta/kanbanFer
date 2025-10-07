import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { CadastroTarefa } from "../Paginas/CadastroTarefa";
import "@testing-library/jest-dom";

vi.mock("axios");

// 🧩 Configuração antes de cada teste
beforeEach(() => {
  vi.clearAllMocks();

  // Mock padrão do GET de usuários
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, nome: "João" },
      { id: 2, nome: "Maria" },
    ],
  });

  // Mock global do alert
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

describe("CadastroTarefa", () => {
  const preencherCamposValidos = () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "Tarefa de teste" },
    });
    fireEvent.change(screen.getByLabelText(/Setor/i), {
      target: { value: "TI" },
    });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), {
      target: { value: "alta" },
    });
    fireEvent.change(screen.getByLabelText(/Usuário/i), {
      target: { value: "1" },
    });
  };

  it("1. Deve renderizar o título e campos principais", async () => {
    render(<CadastroTarefa />);
    expect(await screen.findByText("Cadastro de Tarefa")).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Setor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prioridade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
  });

  it("2. Deve preencher os campos e enviar corretamente", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 1 } });

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/tarefas/"),
        expect.objectContaining({
          descricao: "Tarefa de teste",
          setor: "TI",
          prioridade: "alta",
          usuario: "1",
        })
      );
      expect(window.alert).toHaveBeenCalledWith("Tarefa cadastrada com sucesso!");
    });
  });

  it("3. Deve exibir erro se descrição estiver vazia", async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Preencha todos os campos obrigatórios!");
    });
  });

  it("4. Deve carregar lista de usuários no select", async () => {
    render(<CadastroTarefa />);
    expect(await screen.findByText("João")).toBeInTheDocument();
    expect(await screen.findByText("Maria")).toBeInTheDocument();
  });

  it("5. Deve mostrar mensagem de sucesso ao cadastrar", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 2 } });

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Tarefa cadastrada com sucesso!");
    });
  });

  it("6. Deve limpar campos após cadastro", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 3 } });

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Descrição/i).value).toBe("");
      expect(screen.getByLabelText(/Setor/i).value).toBe("");
      expect(screen.getByLabelText(/Prioridade/i).value).toBe("");
      expect(screen.getByLabelText(/Usuário/i).value).toBe("");
    });
  });

  it("7. Deve exibir erro se API de usuários falhar", async () => {
    vi.clearAllMocks();
    axios.get.mockRejectedValueOnce(new Error("Falha ao carregar usuários"));
    render(<CadastroTarefa />);
    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar usuários/i)).toBeInTheDocument();
    });
  });

  it("8. Não deve enviar se campos obrigatórios estiverem vazios", async () => {
    render(<CadastroTarefa />);
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Preencha todos os campos obrigatórios!");
    });
  });

  it("9. Deve enviar requisição POST corretamente", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 10 } });

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  it("10. Deve lidar com erro genérico do backend", async () => {
    axios.post.mockRejectedValueOnce({});

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao cadastrar tarefa.");
    });
  });

  it("11. Deve lidar com erro 400 específico", async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 400, data: { detail: "Dados inválidos" } },
    });

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Dados inválidos");
    });
  });

  it("12. Deve lidar com erro 500 no servidor", async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500 } });
    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao cadastrar tarefa.");
    });
  });

  it("13. Deve exibir erro se não houver resposta do servidor", async () => {
    axios.post.mockRejectedValueOnce({ request: {} });
    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Sem resposta do servidor.");
    });
  });

  it("14. Deve exibir erro se lançamento da requisição falhar", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro de rede"));
    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao cadastrar tarefa.");
    });
  });

  it("15. Deve impedir cadastro com prioridade inválida", async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "Tarefa inválida" },
    });
    fireEvent.change(screen.getByLabelText(/Setor/i), {
      target: { value: "RH" },
    });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/Usuário/i), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Preencha todos os campos obrigatórios!");
    });
  });

  it("16. Deve manter estado dos campos após erro de backend", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "Erro no backend" } },
    });

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByLabelText(/Descrição/i).value).toBe("Tarefa de teste");
    });
  });

  it("17. Deve lidar com erro inesperado do axios", async () => {
    axios.post.mockRejectedValueOnce(undefined);
    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao cadastrar tarefa.");
    });
  });

  it("18. Deve impedir envio se usuário não estiver selecionado", async () => {
    render(<CadastroTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "Sem usuário" },
    });
    fireEvent.change(screen.getByLabelText(/Setor/i), {
      target: { value: "TI" },
    });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), {
      target: { value: "alta" },
    });
    fireEvent.change(screen.getByLabelText(/Usuário/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Preencha todos os campos obrigatórios!");
    });
  });

  // 🧩 TESTE 19 CORRIGIDO
  it("19. Deve exibir mensagem de erro do backend em alert", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "Erro do backend" } },
    });

    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Erro do backend");
    });
  });

  it("20. Deve lidar com erro sem detail no backend", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: {} },
    });
    render(<CadastroTarefa />);
    preencherCamposValidos();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao cadastrar tarefa.");
    });
  });
});
