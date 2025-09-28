import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";

// Schema com validações de conteúdo
const schemaCadTarefa = z.object({
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
    errorMap: () => ({ message: "Escolha Baixa, Média ou Alta" }),
  }),

  idUsuario: z.string()
    .min(1, "Selecione um usuário válido"),
});

export function CadastroTarefa() {
  const [usuarios, setUsuarios] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaCadTarefa),
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/usuario/")
      .then((res) => {
        setUsuarios(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
        alert("Erro ao carregar a lista de usuários.");
      });
  }, []);

  async function obterDados(data) {
    setSubmitting(true);

    const usuarioId = parseInt(data.idUsuario);

    if (isNaN(usuarioId)) {
      alert("Selecione um usuário válido");
      setSubmitting(false);
      return;
    }

    const payload = {
      descricao: data.descricao.trim(),
      nomeSetor: data.setor.trim(),
      prioridade: data.prioridade.toLowerCase(),
      idUsuario: usuarioId,
      status: "a fazer",
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/tarefa/", payload);
      alert("Tarefa cadastrada com sucesso!");
      reset();
    } catch (err) {
      console.error("Erro ao cadastrar tarefa:", err.response?.data || err);
      alert(err.response?.data?.detail || "Erro ao cadastrar tarefa");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="formulario">
      <h2>Cadastro de Tarefa</h2>
      <form onSubmit={handleSubmit(obterDados)}>

        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          placeholder="Descreva a tarefa com no mínimo 10 caracteres"
          maxLength={100}
          className={errors.descricao ? "error" : ""}
          {...register("descricao")}
        />
        {errors.descricao && <p>{errors.descricao.message}</p>}

        <label htmlFor="setor">Setor:</label>
        <input
          id="setor"
          type="text"
          placeholder="Ex: Recursos Humanos"
          maxLength={50}
          className={errors.setor ? "error" : ""}
          {...register("setor")}
        />
        {errors.setor && <p>{errors.setor.message}</p>}

        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          className={errors.prioridade ? "error" : ""}
          {...register("prioridade")}
        >
          <option value="">Selecione</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.prioridade && <p>{errors.prioridade.message}</p>}

        <label htmlFor="idUsuario">Usuário:</label>
        <select
          id="idUsuario"
          defaultValue=""
          className={errors.idUsuario ? "error" : ""}
          {...register("idUsuario")}
        >
          <option value="">Selecione um usuário</option>
          {usuarios.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.nome}
            </option>
          ))}
        </select>
        {errors.idUsuario && <p>{errors.idUsuario.message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
    </section>
  );
}
