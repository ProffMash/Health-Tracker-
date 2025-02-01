import React, { useState } from 'react';
import { useStore } from '../../state/store';
import Button from '../../components/Button';
import { Dumbbell, Plus, X, Clock, Activity, MessageSquare, Calendar, Pencil, Trash2, Check } from 'lucide-react';

interface WorkoutFormData {
  type: string;
  duration: string;
  intensity: string;
  notes: string;
}

const IntensityBadge: React.FC<{ intensity: string }> = ({ intensity }) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[intensity as keyof typeof colors]}`}>
      {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
    </span>
  );
};

const WorkoutForm: React.FC<{
  initialData: WorkoutFormData;
  onSubmit: (data: WorkoutFormData) => void;
  onCancel: () => void;
  submitLabel: string;
}> = ({ initialData, onSubmit, onCancel, submitLabel }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="border-b border-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workout Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Running, Yoga, Weights"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
              >
                <option value="low">Low Intensity</option>
                <option value="medium">Medium Intensity</option>
                <option value="high">High Intensity</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes about your workout"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

const WorkoutTracker: React.FC = () => {
  const { addWorkout, updateWorkout, deleteWorkout, workouts } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const emptyWorkout: WorkoutFormData = {
    type: '',
    duration: '',
    intensity: 'medium',
    notes: ''
  };

  const handleAddWorkout = (data: WorkoutFormData) => {
    addWorkout({
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    });
    setShowForm(false);
  };

  const handleUpdateWorkout = (id: string, data: WorkoutFormData) => {
    updateWorkout(id, data);
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkout(id);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Dumbbell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Workout Tracker</h2>
              <p className="text-sm text-gray-500">Record and monitor your fitness activities</p>
            </div>
          </div>
          <Button
            variant={showForm ? "secondary" : "primary"}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2"
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add Workout</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Add Workout Form */}
      {showForm && (
        <WorkoutForm
          initialData={emptyWorkout}
          onSubmit={handleAddWorkout}
          onCancel={() => setShowForm(false)}
          submitLabel="Save Workout"
        />
      )}

      {/* Workouts List */}
      <div className="divide-y divide-gray-100">
        {workouts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No workouts recorded yet</p>
            <p className="mt-1">Start tracking your fitness journey by adding your first workout!</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div key={workout.id}>
              {editingWorkout === workout.id ? (
                <WorkoutForm
                  initialData={workout}
                  onSubmit={(data) => handleUpdateWorkout(workout.id, data)}
                  onCancel={() => setEditingWorkout(null)}
                  submitLabel="Update Workout"
                />
              ) : (
                <div className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{workout.type}</h3>
                        <IntensityBadge intensity={workout.intensity} />
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{workout.duration} minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(workout.date)}</span>
                        </div>
                      </div>
                      {workout.notes && (
                        <p className="text-sm text-gray-600 mt-2">{workout.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingWorkout(workout.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-150"
                        title="Edit workout"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {showDeleteConfirm === workout.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteWorkout(workout.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150"
                            title="Confirm delete"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-150"
                            title="Cancel delete"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(workout.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-150"
                          title="Delete workout"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutTracker;