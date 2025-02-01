import React, { useState } from 'react';
import { Footprints, Flame, Droplets, Moon, Settings2 } from 'lucide-react';
import { useStore } from '../../state/store';
import Button from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard: React.FC<{
  title: string;
  value: number;
  goal: number;
  icon: React.ReactNode;
  unit: string;
  onUpdateValue: (value: number) => void;
  onUpdateGoal: (goal: number) => void;
  index: number;
}> = ({ title, value, goal, icon, unit, onUpdateValue, onUpdateGoal, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const progress = (value / goal) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white p-6 rounded-xl shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-blue-600"
          >
            {icon}
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Settings2 className="h-4 w-4 text-gray-500" />
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm text-gray-600 mb-1">Current Value</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={value}
                onChange={(e) => onUpdateValue(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Daily Goal</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={goal}
                onChange={(e) => onUpdateGoal(Number(e.target.value))}
                min="1"
              />
            </div>
            <Button
              size="sm"
              onClick={() => setIsEditing(false)}
              className="w-full"
            >
              Save
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold"
            >
              {value.toLocaleString()} <span className="text-sm text-gray-500">{unit}</span>
            </motion.div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`rounded-full h-2 ${
                  progress >= 100 ? 'bg-green-500' : 'bg-blue-600'
                }`}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Progress: {Math.round(progress)}%
              </span>
              <span className="text-gray-500">
                Goal: {goal.toLocaleString()} {unit}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DailyStats: React.FC = () => {
  const { stats, goals, updateStats, updateGoals } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        index={0}
        title="Steps"
        value={stats.steps}
        goal={goals.steps}
        icon={<Footprints />}
        unit="steps"
        onUpdateValue={(value) => updateStats({ steps: value })}
        onUpdateGoal={(goal) => updateGoals({ steps: goal })}
      />
      <StatCard
        index={1}
        title="Calories"
        value={stats.calories}
        goal={goals.calories}
        icon={<Flame />}
        unit="kcal"
        onUpdateValue={(value) => updateStats({ calories: value })}
        onUpdateGoal={(goal) => updateGoals({ calories: goal })}
      />
      <StatCard
        index={2}
        title="Water"
        value={stats.water}
        goal={goals.water}
        icon={<Droplets />}
        unit="ml"
        onUpdateValue={(value) => updateStats({ water: value })}
        onUpdateGoal={(goal) => updateGoals({ water: goal })}
      />
      <StatCard
        index={3}
        title="Sleep"
        value={stats.sleep}
        goal={goals.sleep}
        icon={<Moon />}
        unit="hours"
        onUpdateValue={(value) => updateStats({ sleep: value })}
        onUpdateGoal={(goal) => updateGoals({ sleep: goal })}
      />
    </div>
  );
};

export default DailyStats;