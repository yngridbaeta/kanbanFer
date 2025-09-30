import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// 🧪 Validação com Zod
const schemaEditarTarefa = z.object({
  descricao: z.string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(100, "A descrição deve ter no máximo 100 caracteres")
    .refine((val) => /\p{L}/u.test(val), {
      message: "A descrição deve conter letras",
    }),

  setor: z.string()
    .min(3, "O nome do setor deve ter pelo menos 3 caracteres")
    .max(50, "O nome do setor deve ter no máximo 50 caracteres")
    .refine((val) => /\p{L}/u.test(val), {
      message: "O nome do setor deve conter letras",
    }),

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

        reset({
          descricao: res.data.descricao,
          setor: res.data.nomeSetor,
          prioridade: res.data.prioridade.toLowerCase(),
          status: res.data.status.toLowerCase(),
        });
      })
      .catch((err) => console.error("Erro ao buscar tarefa:", err));
  }, [id, reset]);

  // 💾 Salvar alterações
  async function salvarEdicao(data) {
    const payload = {
      descricao: data.descricao.trim(),
      nomeSetor: data.setor.trim(),
      prioridade: data.prioridade,
      status: data.status,
    };

    try {
      await axios.patch(`http://127.0.0.1:8000/api/tarefa/${id}/`, payload);
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
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          maxLength={100}
          {...register("descricao")}
        />
        {errors.descricao && (
          <p style={{ color: "red" }}>{errors.descricao.message}</p>
        )}

        {/* Setor */}
        <label htmlFor="setor">Setor:</label>
        <input
          id="setor"
          type="text"
          maxLength={50}
          {...register("setor")}
        />
        {errors.setor && (
          <p style={{ color: "red" }}>{errors.setor.message}</p>
        )}

        {/* Prioridade */}
        <label htmlFor="prioridade">Prioridade:</label>
        <select id="prioridade" {...register("prioridade")}>
          <option value="">Selecione</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.prioridade && (
          <p style={{ color: "red" }}>{errors.prioridade.message}</p>
        )}

        {/* Status */}
        <label htmlFor="status">Status:</label>
        <select id="status" {...register("status")}>
          <option value="">Selecione</option>
          <option value="a fazer">A fazer</option>
          <option value="fazendo">Fazendo</option>
          <option value="pronto">Pronto</option>
        </select>
        {errors.status && (
          <p style={{ color: "red" }}>{errors.status.message}</p>
        )}

        <button type="submit">Salvar</button>
      </form>
    </section>
  );
}
