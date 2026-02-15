
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../types/Task';

export function useSupabaseTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                // Map created_at from DB to createdAt in frontend model
                const mappedTasks = data.map((item: any) => ({
                    ...item,
                    createdAt: item.created_at
                })) as Task[];
                setTasks(mappedTasks);
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    async function addTask(title: string, description: string) {
        try {
            const newTaskPayload = {
                title,
                description,
                completed: false,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('tasks')
                .insert([newTaskPayload])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                const newTask: Task = {
                    ...data,
                    createdAt: data.created_at
                };
                setTasks([newTask, ...tasks]);
            }
        } catch (err) {
            console.error('Error adding task:', err);
            setError(err instanceof Error ? err.message : 'Failed to add task');
        }
    }

    async function updateTask(id: string, updates: Partial<Task>) {
        try {
            // Remove createdAt from updates if present, or map it if needed
            // For now, assuming we don't update createdAt
            const { createdAt, ...validUpdates } = updates;

            const { error } = await supabase
                .from('tasks')
                .update(validUpdates)
                .eq('id', id);

            if (error) throw error;
            setTasks(tasks.map(t => (t.id === id ? { ...t, ...updates } : t)));
        } catch (err) {
            console.error('Error updating task:', err);
            setError(err instanceof Error ? err.message : 'Failed to update task');
        }
    }

    async function deleteTask(id: string) {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting task:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete task');
        }
    }

    const toggleTask = (id: string, completed: boolean) => {
        updateTask(id, { completed });
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        fetchTasks,
    };
}
