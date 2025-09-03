import React, { useState, useEffect } from 'react';
import { loadRiddles, createRiddleOnServer, updateRiddleOnServer, deleteRiddleOnServer } from '../api/riddleService';
import type { Riddle } from '../types';

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
      setError('שגיאה בטעינת החידות.');
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
    if (window.confirm('האם אתה בטוח שברצונך למחוק חידה זו?')) {
      await deleteRiddleOnServer(id);
      fetchRiddles();
    }
  };

  if (loading) return <div className="container">טוען חידות...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container admin-page">
      <h2>ניהול חידות</h2>

      <div className="form-container">
        <h3>{isEditing ? 'ערוך חידה' : 'צור חידה חדשה'}</h3>
        <form onSubmit={handleFormSubmit}>
          <input name="name" value={form.name || ''} onChange={handleInputChange} placeholder="שם החידה" required />
          <textarea name="taskDescription" value={form.taskDescription || ''} onChange={handleInputChange} placeholder="תיאור המשימה" required />
          <input name="correctAnswer" value={form.correctAnswer || ''} onChange={handleInputChange} placeholder="תשובה נכונה" required />
          <input name="hint" value={form.hint || ''} onChange={handleInputChange} placeholder="רמז (אופציונלי)" />
          <select name="type" value={form.type || ''} onChange={handleInputChange} required>
            <option value="">בחר סוג</option>
            <option value="basic">רגיל</option>
            <option value="multiple">רב-ברירה</option>
          </select>
          <select name="difficulty" value={form.difficulty || ''} onChange={handleInputChange} required>
            <option value="">בחר רמה</option>
            <option value="easy">קל</option>
            <option value="medium">בינוני</option>
            <option value="hard">קשה</option>
          </select>
          <button type="submit" className="primary-btn">{isEditing ? 'שמור שינויים' : 'צור חידה'}</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({}); }}>בטל</button>}
        </form>
      </div>

      <div className="riddle-table-container">
        <h3>רשימת חידות</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>שם</th>
              <th>תיאור</th>
              <th>רמה</th>
              <th>פעולות</th>
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
                  <button onClick={() => handleEdit(riddle)}>ערוך</button>
                  <button onClick={() => handleDelete(riddle.id)}>מחק</button>
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