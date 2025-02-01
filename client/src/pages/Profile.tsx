import React, { useState } from 'react';
import { useStore } from '../state/store';
import { Navigate } from 'react-router-dom';
import Button from '../components/Button';
import { User, Settings, Camera, Mail, Ruler, Weight, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileField: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  options?: string[];
  index: number;
}> = ({ label, value, icon, onChange, type = 'text', disabled = false, options, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="col-span-1"
  >
    <motion.label
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </motion.label>
    <div className="relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.1 }}
        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        {icon}
      </motion.div>
      {options ? (
        <motion.select
          whileFocus={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </motion.select>
      ) : (
        <motion.input
          whileFocus={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type={type}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      )}
    </div>
  </motion.div>
);

const Profile: React.FC = () => {
  const { user, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    height: user?.height || '',
    weight: user?.weight || '',
    age: user?.age || '',
    gender: user?.gender || '',
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const avatarVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 200, damping: 15 }
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4"
      >
        <motion.div
          layoutId="profile-card"
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <motion.div
            {...headerVariants}
            className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600"
          >
            <motion.div
              {...avatarVariants}
              className="absolute -bottom-12 left-8"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 bg-white rounded-full p-1"
                >
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 p-1.5 bg-gray-900 rounded-full text-white hover:bg-gray-800"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 right-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setEditing(!editing)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Profile Content */}
          <motion.div
            {...formVariants}
            className="pt-16 px-8 pb-8"
          >
            <AnimatePresence mode="wait">
              <motion.form
                key={editing ? 'editing' : 'viewing'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    index={0}
                    label="Full Name"
                    value={formData.name}
                    icon={<User className="h-5 w-5 text-gray-400" />}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    disabled={!editing}
                  />
                  <ProfileField
                    index={1}
                    label="Email"
                    value={formData.email}
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    type="email"
                    disabled={true}
                  />
                  <ProfileField
                    index={2}
                    label="Height"
                    value={formData.height}
                    icon={<Ruler className="h-5 w-5 text-gray-400" />}
                    onChange={(value) => setFormData({ ...formData, height: value })}
                    type="number"
                    disabled={!editing}
                  />
                  <ProfileField
                    index={3}
                    label="Weight"
                    value={formData.weight}
                    icon={<Weight className="h-5 w-5 text-gray-400" />}
                    onChange={(value) => setFormData({ ...formData, weight: value })}
                    type="number"
                    disabled={!editing}
                  />
                  <ProfileField
                    index={4}
                    label="Age"
                    value={formData.age}
                    icon={<Calendar className="h-5 w-5 text-gray-400" />}
                    onChange={(value) => setFormData({ ...formData, age: value })}
                    type="number"
                    disabled={!editing}
                  />
                  <ProfileField
                    index={5}
                    label="Gender"
                    value={formData.gender}
                    icon={<Users className="h-5 w-5 text-gray-400" />}
                    onChange={(value) => setFormData({ ...formData, gender: value })}
                    disabled={!editing}
                    options={['Male', 'Female', 'Other']}
                  />
                </div>

                {editing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex justify-end"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="flex items-center space-x-2"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.form>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;