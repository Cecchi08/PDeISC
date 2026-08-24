import { useParams, Link } from 'react-router-dom';
import { Task } from '../types.ts';

interface DetailPageProps {
  tasks: Task[];
  onToggleStatus: (id: number) => void;
}

function DetailPage({ tasks, onToggleStatus }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    return (
      <div className="page detail-page">
        <div className="not-found">
          <span className="not-found-icon">⚠</span>
          <h2>Tarea no encontrada</h2>
          <p>La tarea con ID {id} no existe.</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page detail-page">
      <Link to="/" className="back-link">← Volver a la lista</Link>

      <div className="detail-card">
        <div className="detail-header">
          <button 
            className={`btn detail-status-btn ${task.completada ? 'completed' : 'pending'}`}
            onClick={() => onToggleStatus(task.id)}
            title="Haz clic para cambiar el estado"
          >
            {task.completada ? '✓ Completa (Cambiar)' : '○ Incompleta (Cambiar)'}
          </button>
        </div>

        <h1 className="detail-title">{task.titulo}</h1>

        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label">Fecha de creación</span>
            <span className="meta-value">{task.fechaCreacion}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Estado</span>
            <span className={`meta-value ${task.completada ? 'text-complete' : 'text-pending'}`}>
              {task.completada ? 'Completada' : 'Pendiente'}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ID</span>
            <span className="meta-value">#{task.id}</span>
          </div>
        </div>

        <div className="detail-section">
          <h2 className="section-label">Descripción</h2>
          <p className="detail-description">{task.descripcion}</p>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
