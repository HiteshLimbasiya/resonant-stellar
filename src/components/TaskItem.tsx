import React from 'react';
import { Check, Trash2, Edit2, Clock } from 'lucide-react';
import type { Task } from '../types/Task';
import './TaskItem.css';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
    const formatDate = (dateString: string | number) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                    />
                    <span className="checkmark">
                        {task.completed && <Check size={14} strokeWidth={3} />}
                    </span>
                </label>

                <div className="task-details">
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && <p className="task-desc">{task.description}</p>}
                    <div className="task-meta">
                        <Clock size={12} />
                        <span>{formatDate(task.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="task-actions">
                <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(task)}
                    aria-label="Edit task"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(task.id)}
                    aria-label="Delete task"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
