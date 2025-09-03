import { getAuthHeaders } from './authService';
import type { Riddle } from '../types/types';
import type { Player } from '../types/types';

const BASE_URL = 'http://localhost:3007/api/riddles';
const PLAYERS_URL = 'http://localhost:3007/api/players';

export async function loadRiddles(): Promise<Riddle[] | null> {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error loading riddles:', errorData.message);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Network or server error while loading riddles:', error);
    return null;
  }
}

export async function createRiddleOnServer(riddle: Omit<Riddle, 'id'>): Promise<Riddle | null> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(riddle),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Error creating riddle:', data.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error creating riddle:', error);
    return null;
  }
}

export async function updateRiddleOnServer(id: string, riddle: Partial<Riddle>): Promise<Riddle | null> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(riddle),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Error updating riddle:', data.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error updating riddle:', error);
    return null;
  }
}

export async function deleteRiddleOnServer(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error deleting riddle:', errorData.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting riddle:', error);
    return false;
  }
}

export async function loadPlayers(): Promise<Player[] | null> {
  try {
    const response = await fetch(PLAYERS_URL);
    return response.json();
  } catch (error) {
    console.error('Error loading players:', error);
    return null;
  }
}

export async function updatePlayerTime(name: string, difficulty: 'easy' | 'medium' | 'hard', newTime: number): Promise<Player | null> {
  try {
    const response = await fetch(PLAYERS_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, difficulty, newTime }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Error updating player time:', data.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error updating player time:', error);
    return null;
  }
}