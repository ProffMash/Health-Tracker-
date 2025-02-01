import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  height?: string;
  weight?: string;
  age?: string;
  gender?: string;
}

interface HealthStats {
  steps: number;
  calories: number;
  water: number;
  sleep: number;
}

interface Workout {
  id: string;
  type: string;
  duration: string;
  intensity: string;
  notes: string;
  date: string;
}

interface Store {
  user: User | null;
  stats: HealthStats;
  goals: HealthStats;
  workouts: Workout[];
  setUser: (user: User | null) => void;
  updateStats: (stats: Partial<HealthStats>) => void;
  updateGoals: (goals: Partial<HealthStats>) => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Dummy data
const dummyUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  height: '175',
  weight: '70',
  age: '30',
  gender: 'male'
};

const initialStats: HealthStats = {
  steps: 0,
  calories: 0,
  water: 0,
  sleep: 0
};

export const useStore = create<Store>((set) => ({
  user: null,
  stats: initialStats,
  goals: {
    steps: 10000,
    calories: 2000,
    water: 2000,
    sleep: 8
  },
  workouts: [],
  setUser: (user) => set({ user }),
  updateStats: (newStats) => 
    set((state) => ({ stats: { ...state.stats, ...newStats } })),
  updateGoals: (newGoals) =>
    set((state) => ({ goals: { ...state.goals, ...newGoals } })),
  updateProfile: async (profile) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : null
    }));
  },
  addWorkout: (workout) =>
    set((state) => ({
      workouts: [workout, ...state.workouts]
    })),
  updateWorkout: (id, updatedWorkout) =>
    set((state) => ({
      workouts: state.workouts.map(workout =>
        workout.id === id ? { ...workout, ...updatedWorkout } : workout
      )
    })),
  deleteWorkout: (id) =>
    set((state) => ({
      workouts: state.workouts.filter(workout => workout.id !== id)
    })),
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ user: dummyUser });
  },
  register: async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { ...dummyUser, name, email };
    set({ user: newUser });
  },
  logout: () => set({ user: null, stats: initialStats, workouts: [] })
}));