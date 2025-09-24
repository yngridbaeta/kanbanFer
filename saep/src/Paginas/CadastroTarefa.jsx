import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";

const schemaCadTarefa = z.object({
  descricao: z.string()
    .min(1, "Informe uma descrição")
    .max(100, "Informe no máximo 100 caracteres"),
  setor: z.string()
    .min(1, "Informe um setor")
    .max(50, "Informe no máximo 50 caracteres"),
  prioridade: z.enum(["baixa", "media", "alta"], {
    errorMap: () => ({ message: "Escolha Baixa, Média ou Alta" })
  }),
  idUsuario: z.string().min(1, "Selecione um usuário válido")
});

export function CadastroTarefa() {
  const [usuarios, setUsuarios] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaCadTarefa)
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/usuario/")
      .then((res) => {
        console.log("Usuários carregados:", res.data);
        setUsuarios(res.data);
      })
      .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  async function obterDados(data) {
    console.log("Dados do formulário recebidos:", data);

    const usuarioId = parseInt(data.idUsuario);
    console.log("idUsuario convertido para número:", usuarioId);

    if (isNaN(usuarioId)) {
      alert("Selecione um usuário válido");
      return;
    }

    const prioridade = data.prioridade.toLowerCase();

    const payload = {
      descricao: data.descricao,
      nomeSetor: data.setor,
      prioridade: prioridade,
      idUsuario: usuarioId,
      status: 'a fazer'
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/tarefa/", payload);
      alert("Tarefa cadastrada com sucesso!");
      reset();
    } catch (err) {
      console.error("Erro ao cadastrar tarefa:", err.response?.data || err);
      alert("Erro ao cadastrar tarefa");
    }
  }

  return (
    <section className="formulario">
      <h2>Cadastro de Tarefa</h2>
      <form onSubmit={handleSubmit(obterDados)}>

        <label>Descrição:</label>
        <textarea {...register("descricao")} />
        {errors.descricao && <p>{errors.descricao.message}</p>}

        <label>Setor:</label>
        <input type="text" {...register("setor")} />
        {errors.setor && <p>{errors.setor.message}</p>}

        <label>Prioridade:</label>
        <select {...register("prioridade")}>
          <option value="">Selecione</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.prioridade && <p>{errors.prioridade.message}</p>}

        <label>Usuário:</label>
        <select
          {...register("idUsuario")}
          defaultValue=""
          name="idUsuario"
          onChange={(e) => console.log("Usuário selecionado:", e.target.value)}
        >
          <option value="">Selecione um usuário</option>
          {usuarios.map((u) => (
            <option key={u.id ?? Math.random()} value={String(u.id)}>
              {u.nome}
            </option>
          ))}
        </select>
        {errors.idUsuario && <p>{errors.idUsuario.message}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </section>
  );
}
