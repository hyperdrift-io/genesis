'use client';

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Warn about missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using localStorage fallback.');
}

// Create the Supabase client with safe defaults if credentials are missing
export const supabase = createClient(
  // Use dummy values if missing to prevent client initialization errors
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Helper function to check if the client is properly initialized with real credentials
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Generic function to get data from a table
export async function getFromTable<T>(tableName: string, options?: any): Promise<T[]> {
  // If Supabase isn't configured properly, fall back to localStorage
  if (!isSupabaseConfigured()) {
    return getFromLocalStorage<T>(tableName);
  }

  let query = supabase.from(tableName).select('*');

  // Apply additional query options if provided
  if (options?.filters) {
    for (const [column, value] of Object.entries(options.filters)) {
      query = query.eq(column, value);
    }
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending,
    });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    throw new Error(`Failed to fetch data from ${tableName}`);
  }

  return data as T[];
}

// Generic function to get a single item by ID
export async function getById<T>(tableName: string, id: string): Promise<T> {
  // If Supabase isn't configured properly, fall back to localStorage
  if (!isSupabaseConfigured()) {
    return getByIdFromLocalStorage<T>(tableName, id);
  }

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching item from ${tableName}:`, error);
    throw new Error(`Failed to fetch item from ${tableName}`);
  }

  return data as T;
}

// Generic function to insert a new item
export async function insertItem<T>(tableName: string, item: Partial<T>): Promise<T> {
  // If Supabase isn't configured properly, fall back to localStorage
  if (!isSupabaseConfigured()) {
    return insertItemToLocalStorage<T>(tableName, item);
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error(`Error inserting item into ${tableName}:`, error);
    throw new Error(`Failed to insert item into ${tableName}`);
  }

  return data as T;
}

// Generic function to update an item
export async function updateItem<T extends { id: string }>(
  tableName: string,
  item: T
): Promise<T> {
  // If Supabase isn't configured properly, fall back to localStorage
  if (!isSupabaseConfigured()) {
    return updateItemInLocalStorage<T>(tableName, item);
  }

  const { data, error } = await supabase
    .from(tableName)
    .update(item)
    .eq('id', item.id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating item in ${tableName}:`, error);
    throw new Error(`Failed to update item in ${tableName}`);
  }

  return data as T;
}

// Generic function to delete an item
export async function deleteItem(tableName: string, id: string): Promise<void> {
  // If Supabase isn't configured properly, fall back to localStorage
  if (!isSupabaseConfigured()) {
    return deleteItemFromLocalStorage(tableName, id);
  }

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting item from ${tableName}:`, error);
    throw new Error(`Failed to delete item from ${tableName}`);
  }
}

// LocalStorage fallback implementations
function getFromLocalStorage<T>(tableName: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const stored = localStorage.getItem(tableName);
  return stored ? JSON.parse(stored) : [];
}

function getByIdFromLocalStorage<T>(tableName: string, id: string): T {
  if (typeof window === 'undefined') {
    throw new Error('Cannot access localStorage (not in browser)');
  }
  const items = getFromLocalStorage<T & { id: string }>(tableName);
  const item = items.find(item => item.id === id);
  if (!item) {
    throw new Error(`Item with ID ${id} not found in ${tableName}`);
  }
  return item;
}

function insertItemToLocalStorage<T>(tableName: string, item: Partial<T>): T {
  if (typeof window === 'undefined') {
    throw new Error('Cannot access localStorage (not in browser)');
  }
  const items = getFromLocalStorage<any>(tableName);
  const newItem = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...item
  };
  items.push(newItem);
  localStorage.setItem(tableName, JSON.stringify(items));
  return newItem as T;
}

function updateItemInLocalStorage<T extends { id: string }>(tableName: string, item: T): T {
  if (typeof window === 'undefined') {
    throw new Error('Cannot access localStorage (not in browser)');
  }
  const items = getFromLocalStorage<T>(tableName);
  const index = items.findIndex(i => i.id === item.id);
  if (index === -1) {
    throw new Error(`Item with ID ${item.id} not found in ${tableName}`);
  }
  const updatedItem = { ...items[index], ...item, updated_at: new Date().toISOString() };
  items[index] = updatedItem;
  localStorage.setItem(tableName, JSON.stringify(items));
  return updatedItem;
}

function deleteItemFromLocalStorage(tableName: string, id: string): void {
  if (typeof window === 'undefined') {
    throw new Error('Cannot access localStorage (not in browser)');
  }
  const items = getFromLocalStorage<{ id: string }>(tableName);
  const filteredItems = items.filter(item => item.id !== id);
  if (filteredItems.length === items.length) {
    throw new Error(`Item with ID ${id} not found in ${tableName}`);
  }
  localStorage.setItem(tableName, JSON.stringify(filteredItems));
}