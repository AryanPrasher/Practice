import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Trophy, CreditCard } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '1100px', margin: '0 auto' }} className="animate-fade-in">
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 0 40px 0' }}>
        <h1 style={{
          fontSize: '48px',
          fontFamily: 'var(--font-display)',
          fontWeight: '800',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #fff 30%, var(--text-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2'
        }}>
          AI-Proctored Adaptive Testing
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '18px',
          maxWidth: '650px',
          margin: '0 auto 32px auto',
          lineHeight: '1.6'
        }}>
          Experience Item Response Theory (2PL/3PL) difficulty scaling under continuous, webcam-based proctoring analytics.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Candidate Sign In
          </Link>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="dashboard-grid" style={{ marginTop: '40px' }}>
        <div className="glass-panel" style={{ padding: '28px' }}>
          <Brain size={32} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Adaptive IRT Engine</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Dynamically estimates candidate ability levels ($\theta$) using Expected A Posteriori (EAP) updates, optimizing question difficulty on the fly.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <Shield size={32} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>AI-Assisted Proctoring</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Client-side face tracking detects absences or multiple people, combined with focus event logs for focus monitoring.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <Trophy size={32} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Comparative Leaderboards</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Review peer ranking distributions and load neighboring candidate scores to understand your percentile standings.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <CreditCard size={32} style={{ color: 'var(--warning)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Stripe Unlocks</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Browse and unlock premium mocks securely using Stripe integrations with automatic transaction processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
