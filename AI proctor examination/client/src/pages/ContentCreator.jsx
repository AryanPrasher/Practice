import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash, BookOpen, Upload, FileText, CheckCircle, RefreshCw } from 'lucide-react';

const ContentCreator = () => {
  const { token, API_URL } = useAuth();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Question Form
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [difficulty, setDifficulty] = useState(0.0);
  const [discrimination, setDiscrimination] = useState(1.0);
  const [guessing, setGuessing] = useState(0.25);
  const [category, setCategory] = useState('general');

  // Test Series Form
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seriesDesc, setSeriesDesc] = useState('');
  const [seriesPrice, setSeriesPrice] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Bulk Import Form
  const [bulkJson, setBulkJson] = useState('');

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/questions/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleOptionChange = (idx, value) => {
    const nextOpts = [...options];
    nextOpts[idx] = value;
    setOptions(nextOpts);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/questions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text,
          options: options.filter(o => o.trim() !== ''),
          correctOptionIndex: Number(correctIndex),
          difficulty: Number(difficulty),
          discrimination: Number(discrimination),
          guessing: Number(guessing),
          category
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Question created successfully!');
        setText('');
        setOptions(['', '', '', '']);
        loadQuestions();
      } else {
        setMessage(data.message || 'Creation failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Question submit connection error');
    }
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const parsed = JSON.parse(bulkJson);
      const res = await fetch(`${API_URL}/questions/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ questions: parsed })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Bulk import successful!');
        setBulkJson('');
        loadQuestions();
      } else {
        setMessage(data.message || 'Bulk import failed');
      }
    } catch (err) {
      setMessage('Invalid JSON format. Check syntax.');
    }
  };

  const handleCreateTestSeries = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/test-series/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: seriesTitle,
          description: seriesDesc,
          price: Number(seriesPrice),
          isPremium,
          questions: selectedQuestions
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Test Series "${data.testSeries.title}" created successfully!`);
        setSeriesTitle('');
        setSeriesDesc('');
        setSeriesPrice(0);
        setIsPremium(false);
        setSelectedQuestions([]);
      } else {
        setMessage(data.message || 'Failed to create Test Series');
      }
    } catch (err) {
      console.error(err);
      setMessage('Test Series connection error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Archive this question?')) return;
    try {
      const res = await fetch(`${API_URL}/questions/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage('Question archived.');
        loadQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSelectQuestion = (id) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qid => qid !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  return (
    <div style={{ padding: '0 24px 48px 24px', maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: '#fff', fontFamily: 'var(--font-display)' }}>Content Creator Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add adaptive items, import question pools, and group them into Test Series packages</p>
        </div>
      </div>

      {message && (
        <div className="badge badge-info" style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'center', marginBottom: '24px', borderRadius: 'var(--radius-sm)' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
        {/* Question Creator Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} style={{ color: 'var(--primary)' }} /> Create Individual Question
          </h3>

          <form onSubmit={handleCreateQuestion}>
            <div className="form-group">
              <label className="form-label">Question Text</label>
              <textarea
                className="form-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Solve for x: 3x + 5 = 20"
                style={{ resize: 'vertical', minHeight: '80px' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Option A</label>
                <input type="text" className="form-input" value={options[0]} onChange={(e) => handleOptionChange(0, e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Option B</label>
                <input type="text" className="form-input" value={options[1]} onChange={(e) => handleOptionChange(1, e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Option C</label>
                <input type="text" className="form-input" value={options[2]} onChange={(e) => handleOptionChange(2, e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Option D</label>
                <input type="text" className="form-input" value={options[3]} onChange={(e) => handleOptionChange(3, e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Correct Option Index</label>
                <select className="form-input" value={correctIndex} onChange={(e) => setCorrectIndex(e.target.value)} style={{ background: 'var(--bg-surface)' }}>
                  <option value={0}>Option A (Index 0)</option>
                  <option value={1}>Option B (Index 1)</option>
                  <option value={2}>Option C (Index 2)</option>
                  <option value={3}>Option D (Index 3)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category / Subject Tag</label>
                <input type="text" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. math" required />
              </div>
            </div>

            {/* IRT Param Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '8px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Difficulty (b)</label>
                <input type="number" step="0.1" className="form-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Discrimination (a)</label>
                <input type="number" step="0.1" className="form-input" value={discrimination} onChange={(e) => setDiscrimination(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Guessing (c)</label>
                <input type="number" step="0.05" className="form-input" value={guessing} onChange={(e) => setGuessing(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Publish Question
            </button>
          </form>
        </div>

        {/* Test Series Bundler Form & Bulk imports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Test series bundle form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: 'var(--secondary)' }} /> Bundle Test Series
            </h3>
            
            <form onSubmit={handleCreateTestSeries}>
              <div className="form-group">
                <label className="form-label">Series Package Title</label>
                <input type="text" className="form-input" value={seriesTitle} onChange={(e) => setSeriesTitle(e.target.value)} placeholder="e.g. GMAT Advanced Adaptive Mock" required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={seriesDesc} onChange={(e) => setSeriesDesc(e.target.value)} placeholder="Description of topics covered" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Pricing Rules</label>
                  <input type="number" className="form-input" value={seriesPrice} onChange={(e) => setSeriesPrice(e.target.value)} min={0} disabled={!isPremium} />
                </div>
                <div className="form-group" style={{ justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
                    Premium Series Package
                  </label>
                </div>
              </div>

              <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '10px', marginBottom: '16px' }}>
                <span className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Select questions ({selectedQuestions.length} selected)</span>
                {questions.map((q) => (
                  <label key={q._id} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedQuestions.includes(q._id)} onChange={() => handleToggleSelectQuestion(q._id)} />
                    <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>[{q.category}] {q.text}</span>
                  </label>
                ))}
              </div>

              <button type="submit" className="btn-secondary" style={{ width: '100%', borderColor: 'var(--secondary)' }}>
                Publish Test Series
              </button>
            </form>
          </div>

          {/* Bulk Import card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} style={{ color: 'var(--accent)' }} /> Bulk JSON Import
            </h3>
            
            <form onSubmit={handleBulkImport}>
              <div className="form-group">
                <textarea
                  className="form-input"
                  value={bulkJson}
                  onChange={(e) => setBulkJson(e.target.value)}
                  placeholder='Copy copy-paste JSON list, e.g. [{"text":"Is x > y?","options":["Yes","No"],"correctOptionIndex":0,"category":"math"}]'
                  style={{ minHeight: '80px', fontFamily: 'monospace', fontSize: '12px' }}
                  required
                />
              </div>
              <button type="submit" className="btn-secondary" style={{ width: '100%' }}>
                Execute Bulk Import
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Questions list table */}
      <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={22} style={{ color: 'var(--primary)' }} /> Question Item Pool ({questions.length})
      </h2>

      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <RefreshCw className="spin" size={24} style={{ animation: 'spin 2s linear infinite' }} />
          </div>
        ) : questions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No questions created in pool.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Question Text</th>
                <th style={{ padding: '12px' }}>Difficulty (b)</th>
                <th style={{ padding: '12px' }}>Discrimination (a)</th>
                <th style={{ padding: '12px' }}>Guessing (c)</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '14px' }}>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-info">{q.category}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#fff', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.text}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--secondary)', fontWeight: 'bold' }}>{q.difficulty}</td>
                  <td style={{ padding: '12px' }}>{q.discrimination}</td>
                  <td style={{ padding: '12px' }}>{q.guessing}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="btn-danger" 
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <Trash size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ContentCreator;
