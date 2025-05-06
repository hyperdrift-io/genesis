"use client";

import { create } from 'zustand';
import { User } from '@/types/user';

import * as userService from '@/services/userService';

/**
 * Store for managing user state
 */
interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (data: Partial<User>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      });
    }
  },

  fetchUserById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.getUserById(id);
      set({ selectedUser: user, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch user with id ${id}`
      });
    }
  },

  createUser: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userService.createUser(data);
      set(state => ({
        users: [...state.users, newUser],
        isLoading: false
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  },

  updateUser: async (id: string, data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(id, data);
      set(state => ({
        users: state.users.map(item =>
          item.id === updatedUser.id ? updatedUser : item
        ),
        selectedUser: state.selectedUser?.id === updatedUser.id
          ? updatedUser
          : state.selectedUser,
        isLoading: false
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to update user`
      });
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteUser(id);
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to delete user`
      });
    }
  }
}));
