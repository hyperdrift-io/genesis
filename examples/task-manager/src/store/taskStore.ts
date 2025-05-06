"use client";

import { create } from 'zustand';
import { Task } from '@/types/task';

import * as taskService from '@/services/taskService';

/**
 * Store for managing task state
 */
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks'
      });
    }
  },

  fetchTaskById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskService.getTaskById(id);
      set({ selectedTask: task, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch task with id ${id}`
      });
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskService.createTask(data);
      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create task'
      });
    }
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(id, data);
      set(state => ({
        tasks: state.tasks.map(item =>
          item.id === updatedTask.id ? updatedTask : item
        ),
        selectedTask: state.selectedTask?.id === updatedTask.id
          ? updatedTask
          : state.selectedTask,
        isLoading: false
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to update task`
      });
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        isLoading: false
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to delete task`
      });
    }
  }
}));
