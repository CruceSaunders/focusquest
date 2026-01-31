'use client';

import { useState } from 'react';
import { Task } from '@/lib/gameState';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string, estimatedPomodoros: number) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onIncrementPomodoro: (id: string) => void;
}

export default function TaskList({
  tasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onIncrementPomodoro,
}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), newTaskPomodoros);
      setNewTaskText('');
      setNewTaskPomodoros(1);
      setShowForm(false);
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="card p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">✅ Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[var(--primary)] hover:text-white transition-colors"
        >
          {showForm ? '✕' : '+ Add'}
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 bg-[var(--accent)] rounded-xl p-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What are you working on?"
            className="w-full bg-[var(--background)] text-white rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            autoFocus
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Est. 🍅:</span>
              <select
                value={newTaskPomodoros}
                onChange={(e) => setNewTaskPomodoros(Number(e.target.value))}
                className="bg-[var(--background)] text-white rounded-lg px-3 py-1 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg text-white text-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Active Tasks */}
      <div className="space-y-2 mb-4">
        {activeTasks.length === 0 && !showForm && (
          <div className="text-center text-white/40 py-8">
            No tasks yet. Add one to get started! 🚀
          </div>
        )}
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 bg-[var(--accent)] rounded-xl p-4 group"
          >
            <button
              onClick={() => onCompleteTask(task.id)}
              className="w-6 h-6 rounded-full border-2 border-[var(--primary)] hover:bg-[var(--primary)] transition-colors flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-white truncate">{task.text}</div>
              <div className="text-white/40 text-sm">
                {'🍅'.repeat(task.completedPomodoros)}
                {'⚪'.repeat(task.estimatedPomodoros - task.completedPomodoros)}
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onIncrementPomodoro(task.id)}
                className="text-[var(--xp-green)] hover:scale-110 transition-transform"
                title="Add pomodoro"
              >
                +🍅
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-[var(--primary)] hover:scale-110 transition-transform"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="text-white/40 text-sm mb-2">Completed ({completedTasks.length})</div>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 bg-[var(--accent)]/50 rounded-xl p-3"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--xp-green)] flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div className="flex-1 text-white/40 line-through truncate">
                  {task.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
