import { Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard.tsx';
import { Task } from '../types.ts';

interface HomePageProps {
  tasks: Task[];
}

function HomePage({ tasks }: HomePageProps) {
  const completedCount = tasks.filter(t => t.completada).length;

  return (
    <div className="page home-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mis Tareas</h1>
          <p className="page-subtitle">
            {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} · {completedCount} completada{completedCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/crear" className="btn btn-primary">
          <span>+</span> Nueva Tarea
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No hay tareas aún. ¡Crea tu primera tarea!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
