import React from 'react';
import { Layers } from 'lucide-react';
import type { Task } from '../types/Task';
import { TaskItem } from './TaskItem';
import './TaskList.css';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onEdit }) => {
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <Layers size={48} />
                </div>
                <h3>No tasks yet</h3>
                <p>Get started by tracking your first task</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};
