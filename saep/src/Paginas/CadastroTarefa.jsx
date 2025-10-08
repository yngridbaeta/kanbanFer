import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";

const schemaCadTarefa = z.object({
  descricao: z.string()
    .trim()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(100, "A descrição deve ter no máximo 100 caracteres")
    .refine((val) => /^[\p{L}\d\s.,;:!?()-]+$/u.test(val), {
      message: "A descrição deve conter letras, números e pontuação válida",
    }),

  setor: z.string()
    .trim()
    .min(3, "O nome do setor deve ter pelo menos 3 caracteres")
    .max(50, "O nome do setor deve ter no máximo 50 caracteres")
    .refine((val) => /^[\p{L}\s]+$/u.test(val), {
      message: "O nome do setor deve conter apenas letras e espaços",
    }),

  prioridade: z.enum(["baixa", "media", "alta"], {
    errorMap: () => ({ message: "Escolha Baixa, Média ou Alta" }),
  }),

  usuario: z.string()
    .min(1, "Selecione um usuário válido"),
});

export function CadastroTarefa() {
  const [usuarios, setUsuarios] = useState([]);
  const [erroUsuarios, setErroUsuarios] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaCadTarefa),
    defaultValues: { prioridade: "baixa" },
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/usuario/")
      .then((res) => {
        setUsuarios(res.data);
        setErroUsuarios(false);
      })
      .catch(() => {
        setErroUsuarios(true);
        alert("Erro ao carregar usuários");
      });
  }, []);

async function obterDados(data) {
  setSubmitting(true);

  const payload = {
    descricao: data.descricao.trim(),
    setor: data.setor.trim(),
    prioridade: data.prioridade.toLowerCase(),
    usuario: parseInt(data.usuario, 10),
    status: "a fazer",
  };

  try {
    await axios.post("http://127.0.0.1:8000/api/tarefas/", payload);
    alert("Tarefa cadastrada com sucesso!");
    reset({
      descricao: '',
      setor: '',
      prioridade: 'baixa',
      usuario: '',
    });
  } catch (err) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      "Erro ao cadastrar tarefa.";
    alert(msg);
  } finally {
    setSubmitting(false);
  }
}

  return (
    <section className="formulario">
      <h2>Cadastro de Tarefa</h2>

      {erroUsuarios && <p>Erro ao carregar usuários</p>}

      <form onSubmit={handleSubmit(obterDados)}>
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          placeholder="Descreva a tarefa com no mínimo 10 caracteres"
          maxLength={100}
          {...register("descricao")}
          className={errors.descricao ? "error" : ""}
        />
        {errors.descricao && (
          <p className="error-message">{errors.descricao.message}</p>
        )}

        <label htmlFor="setor">Setor:</label>
        <input
          id="setor"
          type="text"
          placeholder="Ex: Recursos Humanos"
          maxLength={50}
          {...register("setor")}
          className={errors.setor ? "error" : ""}
        />
        {errors.setor && (
          <p className="error-message">{errors.setor.message}</p>
        )}

        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          {...register("prioridade")}
          className={errors.prioridade ? "error" : ""}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.prioridade && (
          <p className="error-message">{errors.prioridade.message}</p>
        )}

        <label htmlFor="usuario">Usuário:</label>
        <select
          id="usuario"
          {...register("usuario")}
          className={errors.usuario ? "error" : ""}
        >
          <option value="">Selecione um usuário</option>
          {usuarios.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.nome}
            </option>
          ))}
        </select>
        {errors.usuario && (
          <p className="error-message">{errors.usuario.message}</p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Cadastrar"}
        </button>
      </form>

      <style jsx>{`
        .error {
          border-color: red;
        }
        .error-message {
          color: red;
          font-size: 0.9rem;
          margin-top: 4px;
          margin-bottom: 8px;
        }
        button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
