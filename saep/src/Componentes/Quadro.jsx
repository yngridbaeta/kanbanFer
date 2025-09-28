import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Coluna } from './Coluna';
//area que permite o uso do Drag and drop
import { DndContext } from '@dnd-kit/core';

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {

        const apiUrl = 'http://127.0.0.1:8000/api/tarefa/';

        axios.get(apiUrl)
            .then(response => {
                setTarefas(response.data);
            })
            .catch(error => {
                console.error("Houve um erro ao buscar os dados da API:", error);
            });
    }, []);

    function handleDragEnd(event){
    const {active, over } = event;

    if(over && active){
        const tarefaId = active.id;
        const novaColuna = over.id;

        setTarefas(prev =>
            prev.map(tarefa =>
                tarefa.id === tarefaId ? { ...tarefa, status: novaColuna } : tarefa
            )
        );

        axios.patch(`http://127.0.0.1:8000/api/tarefa/${tarefaId}/`, {
            status: novaColuna
        }).catch(err => console.error("Erro ao atualizar tarefa", err));
    }
}

    const tarefasAFazer = tarefas.filter(tarefa => tarefa.status === 'a fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'fazendo');
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === 'pronto');

    return (
       
        <DndContext onDragEnd={handleDragEnd}>
            <main className="conteiner">
                <section className="atividades">
                    <Coluna id = 'a fazer' titulo="A fazer" tarefas={tarefasAFazer} />
                    <Coluna id = 'fazendo' titulo="Fazendo" tarefas={tarefasFazendo} />
                    <Coluna id = 'pronto' titulo="Pronto" tarefas={tarefasPronto} />
                </section>
            </main>
        </DndContext>
        
    );
}