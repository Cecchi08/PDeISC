import { Link } from 'react-router-dom';
import { Task } from '../types.ts';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  // Descripción corta: primeros 80 caracteres
  const shortDesc = task.descripcion.length > 80
    ? task.descripcion.substring(0, 80) + '…'
    : task.descripcion;

  return (
    <Link to={`/tarea/${task.id}`} className="task-card">
      <div className="task-card-header">
        <span className={`task-status ${task.completada ? 'completed' : 'pending'}`}>
          {task.completada ? '✓' : '○'}
        </span>
        <span className="task-date">{task.fechaCreacion}</span>
      </div>
      <h3 className="task-title">{task.titulo}</h3>
      <p className="task-desc">{shortDesc}</p>
      <div className="task-card-footer">
        <span className={`task-badge ${task.completada ? 'badge-complete' : 'badge-pending'}`}>
          {task.completada ? 'Completa' : 'Incompleta'}
        </span>
        <span className="task-arrow">→</span>
      </div>
    </Link>
  );
}

export default TaskCard;
