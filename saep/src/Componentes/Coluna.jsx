import { Tarefa } from './Tarefa';
//uso da biblioteca de Drag and Drop
import { useDroppable } from '@dnd-kit/core';


export function Coluna({ id, titulo, tarefas = [] }) {
  //faço o uso da referencia do item no Drag and Drop e usando o dom 
  const {setNodeRef} = useDroppable({ id });

  return (
    <section className="coluna" ref={ setNodeRef }>
      <h2>{titulo}</h2>
      {tarefas.map(tarefa => {
        return <Tarefa key={tarefa.id} tarefa={tarefa} />;
      })}
    </section>
  );
}