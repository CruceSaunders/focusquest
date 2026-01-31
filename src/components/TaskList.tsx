'use client';

import { useState } from 'react';
import { Task } from '@/lib/gameState';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string, estimatedPomodoros: number) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onIncrementPomodoro: (id: string) => void;
  onClearCompleted?: () => void;
}

export default function TaskList({
  tasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onIncrementPomodoro,
  onClearCompleted,
}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

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
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">✅ Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-purple-400 hover:text-white transition-colors text-lg"
        >
          {showForm ? '✕' : '+ Add'}
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 bg-white/10 rounded-xl p-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What are you working on?"
            className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40"
            autoFocus
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Est. 🍅:</span>
              <select
                value={newTaskPomodoros}
                onChange={(e) => setNewTaskPomodoros(Number(e.target.value))}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-semibold hover:scale-105 transition-transform"
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
            className="flex items-center gap-3 bg-white/10 rounded-xl p-4 group hover:bg-white/15 transition"
          >
            <button
              onClick={() => onCompleteTask(task.id)}
              className="w-6 h-6 rounded-full border-2 border-purple-500 hover:bg-purple-500 transition-colors flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-white truncate">{task.text}</div>
              <div className="text-white/40 text-sm">
                {'🍅'.repeat(task.completedPomodoros)}
                {'⚪'.repeat(Math.max(0, task.estimatedPomodoros - task.completedPomodoros))}
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onIncrementPomodoro(task.id)}
                className="text-green-400 hover:scale-110 transition-transform"
                title="Add pomodoro"
              >
                +🍅
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-red-400 hover:scale-110 transition-transform"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-white/40 hover:text-white/60 text-sm transition"
            >
              <span className={`transition-transform ${showCompleted ? 'rotate-90' : ''}`}>▶</span>
              Completed ({completedTasks.length})
            </button>
            {onClearCompleted && (
              <button
                onClick={onClearCompleted}
                className="text-red-400/60 hover:text-red-400 text-sm transition"
              >
                Clear all
              </button>
            )}
          </div>
          
          {showCompleted && (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white text-sm">
                    ✓
                  </div>
                  <div className="flex-1 text-white/40 line-through truncate">
                    {task.text}
                  </div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
