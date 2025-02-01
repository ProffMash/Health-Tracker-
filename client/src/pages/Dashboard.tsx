import React from 'react';
import DailyStats from '../features/Stats/DailyStats';
import WorkoutTracker from '../features/Workouts/WorkoutTracker';
import { useStore } from '../state/store';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's your health overview for today</p>
      </div>
      
      <div className="space-y-8">
        <DailyStats />
        <WorkoutTracker />
      </div>
    </div>
  );
};

export default Dashboard;