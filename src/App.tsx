import { useState } from 'react';

import { Plus } from 'lucide-react';
import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Button } from './components/Button';
import { useSupabaseTasks } from './hooks/useSupabaseTasks';
import type { Task } from './types/Task';
import './styles/global.css';

function App() {
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTask } = useSupabaseTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = async (title: string, description: string) => {
    await addTask(title, description);
  };

  const handleEditTask = async (title: string, description: string) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, { title, description });
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await toggleTask(id, !task.completed);
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <Layout
      headerAction={
        <Button onClick={openAddModal} variant="primary" size="sm">
          <Plus size={18} />
          <span>New Task</span>
        </Button>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          <p>Error: {error}</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onEdit={openEditModal}
        />
      )}

      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        initialData={editingTask}
      />
    </Layout>
  );
}

export default App;
