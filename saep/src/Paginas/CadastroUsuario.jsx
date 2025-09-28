import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';

const schemaCadUsuario = z.object({
  nome: z.string()
    .min(5, "O nome deve ter pelo menos 5 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres")
    .refine(val => /\p{L}/u.test(val), {
      message: "O nome deve conter letras",
    })
    .refine(val => !/(.)\1{3,}/.test(val), {
      message: "O nome não pode conter letras repetidas em excesso",
    }),

  email: z.string()
    .min(1, "Informe o e-mail")
    .max(50, "O e-mail deve ter no máximo 50 caracteres")
    .email("Formato de e-mail inválido"),
});

export function CadastroUsuario() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaCadUsuario)
  });

  async function obterDados(data) {
    setSubmitting(true);
    try {
      console.log('Dados recebidos:', data);
      await axios.post("http://127.0.0.1:8000/api/usuario/", data);
      alert("Usuário cadastrado com sucesso!");
      reset();
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err.response?.data || err);
      alert(err.response?.data?.detail || "Erro ao cadastrar usuário");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="formulario">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit(obterDados)}>

        <label htmlFor="nome">Nome:</label>
        <input
          id="nome"
          type="text"
          placeholder="Nome e sobrenome"
          maxLength={50}
          className={errors.nome ? "error" : ""}
          {...register("nome")}
        />
        {errors.nome && <p>{errors.nome.message}</p>}

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="email@dominio.com"
          maxLength={50}
          className={errors.email ? "error" : ""}
          {...register("email")}
        />
        {errors.email && <p>{errors.email.message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
    </section>
  );
}
