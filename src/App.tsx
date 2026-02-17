import { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Button } from './components/Button';
import { useSupabaseTasks } from './hooks/useSupabaseTasks';
import type { Task } from './types/Task';
import './styles/global.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTask } = useSupabaseTasks(session?.user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = async (title: string, description: string) => {
    if (!session) return;
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (sessionLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout
      headerAction={
        <div className="flex gap-3">
          <Button onClick={openAddModal} variant="primary" size="sm">
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
          </Button>
          <Button onClick={handleSignOut} variant="ghost" size="icon" title="Sign Out">
            <LogOut size={18} />
          </Button>
        </div>
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
