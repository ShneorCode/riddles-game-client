import React, { useState, useEffect } from 'react';
import { loadRiddles, createRiddleOnServer, updateRiddleOnServer, deleteRiddleOnServer } from '../api/riddleService';
import type { Riddle } from '../types/types';

const AdminRiddles: React.FC = () => {
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Riddle>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRiddles();
  }, []);

  const fetchRiddles = async () => {
    setLoading(true);
    const data = await loadRiddles();
    if (data) {
      setRiddles(data);
    } else {
      setError('Error loading riddles');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && form.id) {
      await updateRiddleOnServer(form.id, form);
    } else {
      await createRiddleOnServer(form as Omit<Riddle, 'id'>);
    }
    setForm({});
    setIsEditing(false);
    fetchRiddles();
  };

  const handleEdit = (riddle: Riddle) => {
    setForm(riddle);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this riddle?')) {
      await deleteRiddleOnServer(id);
      fetchRiddles();
    }
  };

  if (loading) return <div className="container">Loading riddles...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container admin-page">
      <h2>Riddles Management</h2>

      <div className="form-container">
        <h3>{isEditing ? 'Edit Riddle' : 'Create New Riddle'}</h3>
        <form onSubmit={handleFormSubmit}>
          <input name="name" value={form.name || ''} onChange={handleInputChange} placeholder="Riddle Name" required />
          <textarea name="taskDescription" value={form.taskDescription || ''} onChange={handleInputChange} placeholder="Task Description" required />
          <input name="correctAnswer" value={form.correctAnswer || ''} onChange={handleInputChange} placeholder="Correct Answer" required />
          <input name="hint" value={form.hint || ''} onChange={handleInputChange} placeholder="Hint (Optional)" />
          <select name="type" value={form.type || ''} onChange={handleInputChange} required>
            <option value="">Select Type</option>
            <option value="basic">Basic</option>
            <option value="multiple">Multiple Choice</option>
          </select>
          <select name="difficulty" value={form.difficulty || ''} onChange={handleInputChange} required>
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button type="submit" className="primary-btn">{isEditing ? 'Save Changes' : 'Create Riddle'}</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({}); }}>Cancel</button>}
        </form>
      </div>

      <div className="riddle-table-container">
        <h3>Riddles List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riddles.map(riddle => (
              <tr key={riddle.id}>
                <td>{riddle.id}</td>
                <td>{riddle.name}</td>
                <td>{riddle.taskDescription}</td>
                <td>{riddle.difficulty}</td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(riddle)}>Edit</button>
                  <button onClick={() => handleDelete(riddle.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRiddles;
