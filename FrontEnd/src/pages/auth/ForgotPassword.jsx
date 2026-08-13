

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import { resetPasswordStyles as s } from '../../assets/dummyStyles';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // 👇 This calls your backend API
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message || 'If this email exists, a reset link has been sent.');
      setEmail(''); // Clear input after sending
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={s.container}>
      <Navbar />
      <div className={s.centerWrapper}>
        <div className={s.formCard}>
          <h2 className={s.title}>Forgot Password</h2>
          <p className={s.subtitle}>Enter your email to receive a reset link.</p>

          {error && <div className={s.errorMessage}>{error}</div>}
          {message && <div className={s.successMessage}>{message}</div>}

          <form onSubmit={handleSubmit} className={s.form}>
            <div>
              <label className={s.label}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={s.input}
              />
            </div>
            <button type="submit" disabled={isLoading} className={s.submitButton}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className={s.footerText}>
            Remembered your password? <Link to="/login" className={s.link}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;