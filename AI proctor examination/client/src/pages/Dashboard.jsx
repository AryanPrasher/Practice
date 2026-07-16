import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CreditCard, Play, Eye, Award, CheckCircle, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { token, API_URL, fetchNotifications } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [testSeries, setTestSeries] = useState([]);
  const [history, setHistory] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch available test series
      const resProducts = await fetch(`${API_URL}/payments/products`);
      const dataProducts = await resProducts.json();
      setTestSeries(dataProducts.products || []);

      // 2. Fetch purchases
      const resPurchases = await fetch(`${API_URL}/payments/purchases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataPurchases = await resPurchases.json();
      const purchases = dataPurchases.purchases || [];
      setPurchasedIds(purchases.map(p => p._id.toString()));

      // 3. Fetch completed history
      const resHistory = await fetch(`${API_URL}/sessions/my-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataHistory = await resHistory.json();
      setHistory(dataHistory.sessions || []);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check query params for purchase response warnings
    if (searchParams.get('purchase_success') === 'true') {
      setMessage('Stripe Purchase Confirmed! Premium test series unlocked.');
      fetchNotifications();
    } else if (searchParams.get('purchase_cancelled') === 'true') {
      setMessage('Purchase cancelled. Try again anytime.');
    }
  }, [searchParams]);

  const handlePurchase = async (seriesId) => {
    setCheckoutLoading(seriesId);
    try {
      const res = await fetch(`${API_URL}/payments/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ testSeriesId: seriesId })
      });
      const data = await res.json();
      
      if (res.ok && data.sessionUrl) {
        // Stripe Redirect
        window.location.href = data.sessionUrl;
      } else {
        // If it was instant sandbox unlock
        setMessage(data.message || 'Mock payment completed. Series unlocked!');
        loadData();
      }
    } catch (err) {
      console.error(err);
      setMessage('Payment setup failed.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleStartTest = async (seriesId) => {
    try {
      const res = await fetch(`${API_URL}/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ testSeriesId: seriesId })
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/test-taking/${seriesId}?sessionId=${data.session._id}`);
      } else {
        setMessage(data.message || 'Failed to start session');
      }
    } catch (err) {
      console.error(err);
      setMessage('Connection error starting session.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '100px 0', color: 'var(--text-secondary)' }}>
        <RefreshCw className="spin" size={32} style={{ animation: 'spin 2s linear infinite' }} />
        <span style={{ marginLeft: '12px', fontSize: '18px' }}>Loading your dashboard...</span>
      </div>
    );
  }

  // Aggregate stats
  const completedTests = history.filter(s => s.status === 'completed');
  const avgScore = completedTests.length > 0 
    ? (completedTests.reduce((acc, s) => acc + s.totalScore, 0) / completedTests.length).toFixed(1)
    : 0;
  const maxTheta = completedTests.length > 0
    ? Math.max(...completedTests.map(s => s.currentTheta)).toFixed(2)
    : '0.00';

  return (
    <div style={{ padding: '0 24px 48px 24px', maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: '#fff', fontFamily: 'var(--font-display)' }}>Testing Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Select an adaptive mock test and check your analytics report</p>
        </div>
        <button onClick={loadData} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {message && (
        <div className="badge badge-info" style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'center', marginBottom: '24px', borderRadius: 'var(--radius-sm)' }}>
          {message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
        <div className="glass-panel metric-card">
          <span className="metric-title">Highest Ability (IRT θ)</span>
          <span className="metric-value" style={{ color: 'var(--secondary)' }}>{maxTheta}</span>
        </div>
        <div className="glass-panel metric-card">
          <span className="metric-title">Completed Mock Exams</span>
          <span className="metric-value" style={{ color: 'var(--success)' }}>{completedTests.length}</span>
        </div>
        <div className="glass-panel metric-card">
          <span className="metric-title">Average Performance Score</span>
          <span className="metric-value" style={{ color: 'var(--accent)' }}>{avgScore}%</span>
        </div>
      </div>

      {/* Mock Tests Packages Grid */}
      <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <BookOpen size={22} style={{ color: 'var(--primary)' }} /> Available Test Series
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {testSeries.map((series) => {
          const isPurchased = purchasedIds.includes(series._id.toString());
          const hasAccess = !series.isPremium || isPurchased;

          return (
            <div key={series._id} className="glass-panel hover-scale" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', color: '#fff' }}>{series.title}</h3>
                  <span className={`badge ${series.isPremium ? 'badge-warning' : 'badge-success'}`}>
                    {series.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {series.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                  {series.isPremium ? `$${series.price}` : 'FREE'}
                </span>

                {hasAccess ? (
                  <button 
                    onClick={() => handleStartTest(series._id)}
                    className="btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Play size={14} /> Start Test
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePurchase(series._id)}
                    disabled={checkoutLoading === series._id}
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--primary)' }}
                  >
                    <CreditCard size={14} /> {checkoutLoading === series._id ? 'Processing...' : 'Unlock'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed History List */}
      <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Award size={22} style={{ color: 'var(--secondary)' }} /> Past Exam Submissions
      </h2>

      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>You have not completed any test sessions yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <th style={{ padding: '12px' }}>Test Package</th>
                <th style={{ padding: '12px' }}>Score</th>
                <th style={{ padding: '12px' }}>Percentile</th>
                <th style={{ padding: '12px' }}>IRT Ability (θ)</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Date Taken</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((session) => (
                <tr key={session._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '14px' }}>
                  <td style={{ padding: '12px', color: '#fff', fontWeight: '500' }}>{session.testSeries?.title || 'Unknown Test'}</td>
                  <td style={{ padding: '12px' }}>{session.totalScore}%</td>
                  <td style={{ padding: '12px' }}>{session.percentile}%</td>
                  <td style={{ padding: '12px' }}>{session.currentTheta.toFixed(3)}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${session.status === 'completed' ? 'badge-success' : session.status === 'active' ? 'badge-info' : 'badge-danger'}`}>
                      {session.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {session.status === 'active' ? (
                      <button 
                        onClick={() => navigate(`/test-taking/${session.testSeries?._id}?sessionId=${session._id}`)}
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Resume
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/report/${session._id}`)}
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} /> View Report
                      </button>
                    )}
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

export default Dashboard;
