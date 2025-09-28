import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// 🧪 Validação com Zod
const schemaEditarTarefa = z.object({
  prioridade: z.enum(["baixa", "media", "alta"], {
    errorMap: () => ({ message: "Escolha baixa, média ou alta" }),
  }),
  status: z.enum(["a fazer", "fazendo", "pronto"], {
    errorMap: () => ({ message: "Escolha um status válido" }),
  }),
});

export function EditarTarefa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarefa, setTarefa] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaEditarTarefa),
  });

  // 🔁 Carrega a tarefa
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/tarefa/${id}/`)
      .then((res) => {
        console.log("🔄 Tarefa carregada:", res.data);
        setTarefa(res.data);

        // Define valores iniciais do formulário
        reset({
          prioridade: res.data.prioridade.toLowerCase(),
          status: res.data.status.toLowerCase(),
        });
      })
      .catch((err) => console.error("Erro ao buscar tarefa:", err));
  }, [id, reset]);

  // 💾 Salvar alterações
  async function salvarEdicao(data) {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/tarefa/${id}/`, data);
      alert("Tarefa atualizada com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err.response?.data || err);
      alert("Erro ao atualizar tarefa");
    }
  }

  if (!tarefa) return <p>Carregando...</p>;

  return (
    <section className="formulario">
      <h2>Edição de Tarefa</h2>
      <form onSubmit={handleSubmit(salvarEdicao)}>
        {/* Descrição */}
        <label>Descrição:</label>
        <textarea value={tarefa.descricao || ""} readOnly />

        {/* Setor */}
        <label>Setor:</label>
        <input type="text" value={tarefa.nomeSetor || ""} readOnly />

        {/* Data */}
        <label>Data de Cadastro:</label>
        <input type="text" value={tarefa.data || ""} readOnly />

        {/* Prioridade */}
        <label>Prioridade:</label>
        <select {...register("prioridade")}>
          <option value="">Selecione</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.prioridade && (
          <p style={{ color: "red" }}>{errors.prioridade.message}</p>
        )}

        {/* Status */}
        <label>Status:</label>
        <select {...register("status")}>
          <option value="">Selecione</option>
          <option value="a fazer">A fazer</option>
          <option value="fazendo">Fazendo</option>
          <option value="pronto">Pronto</option>
        </select>
        {errors.status && (
          <p style={{ color: "red" }}>{errors.status.message}</p>
        )}

        {/* Botão */}
        <button type="submit">Salvar</button>
      </form>
    </section>
  );
}
