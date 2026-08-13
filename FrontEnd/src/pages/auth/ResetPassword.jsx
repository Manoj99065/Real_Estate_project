import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { resetPasswordStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import API_URL from '../../config';

const ResetPassword = () => {
  const navigate = useNavigate();
  // 👇 Token comes from the URL path: /reset-password/:token
  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
      setIsLoading(false);
      return;
    }

    try {
      // 👇 POST request with token in URL, password in body
      const response = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, {
        password,
      });

      if (response.data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Guard: if token is missing (shouldn't happen if route is correct)
  if (!token) {
    return (
      <div className={s.container}>
        <Navbar />
        <div className={s.centerWrapper}>
          <div className={s.formCard}>
            <h2 className={s.title}>Invalid or Expired Link</h2>
            <p className={s.subtitle}>
              The password reset link is invalid or has expired.
            </p>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/forgot-password" className={s.link}>
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <Navbar />
      <div className={s.centerWrapper}>
        <div className={s.formCard}>
          <h2 className={s.title}>Reset Password</h2>
          <p className={s.subtitle}>Create a new password for your account</p>

          {error && <div className={s.errorMessage}>{error}</div>}
          {success && <div className={s.successMessage}>{success}</div>}

          <form onSubmit={handleSubmit} className={s.form}>
            <div>
              <label className={s.label}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={s.input}
                  style={{ paddingRight: '40px' }}
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className={s.label}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={s.input}
                  style={{ paddingRight: '40px' }}
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={s.submitButton}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className={s.footerText}>
            Back to{' '}
            <Link to="/login" className={s.link}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;