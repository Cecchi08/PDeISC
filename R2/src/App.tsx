import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/context.ts';
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import DetailPage from './pages/DetailPage.tsx';
import CreatePage from './pages/CreatePage.tsx';
import initialTasks from './data/tasks.json';
import { Task } from './types.ts';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskflow-tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialTasks;
      }
    }
    return initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Agrega una nueva tarea a la lista
  const addTask = (newTask: Omit<Task, 'id' | 'fechaCreacion'>) => {
    const task: Task = {
      ...newTask,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [...prev, task]);
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completada: !task.completada } : task
    ));
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage tasks={tasks} />} />
              <Route path="/tarea/:id" element={<DetailPage tasks={tasks} onToggleStatus={toggleTaskStatus} />} />
              <Route path="/crear" element={<CreatePage onAddTask={addTask} />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
