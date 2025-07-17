import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath.js';

const Login = ({ showWelcomeHandler, setShowLogOut, setShowLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔐 Login Response:", data);

      if (response.ok && data.token && data.vendorID) {
        alert('Login successful');
        setEmail('');
        setPassword('');
        localStorage.setItem('loginToken', data.token);
        setShowLogOut(true);
        setShowLogin(false);
        showWelcomeHandler();

        const vendorID = data.vendorID;

        const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorID}`);
        const vendorData = await vendorResponse.json();

        if (vendorResponse.ok) {
          const vendorFirmID = vendorData.vendorFirmID;
          const vendor = vendorData.vendor;

          let firmName = 'Unknown Firm';
          if (vendor?.firm?.length > 0) {
            firmName = vendor.firm[0].firmName;
          }

          localStorage.setItem('firmId', vendorFirmID);
          localStorage.setItem('firmName', firmName);

          console.log("✅ Firm info saved:", vendorFirmID, firmName);
          window.location.reload();
        } else {
          console.warn('❌ Failed to fetch vendor details:', vendorData.message);
        }

      } else {
        alert(data.message || 'Login failed. Invalid credentials.');
      }
    } catch (error) {
      console.error('❌ Login Error:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

return (
  <div className="loginSection">
    <form className="authForm" onSubmit={loginHandler}>
      <h3 style={{ color: '#D7263D', marginBottom: '20px' }}>Vendor Login</h3>

      <label>Email</label><br />
      <input
        type="text"
        name="email"
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br /><br />

      <label>Password</label><br />
      <input
        type="password"
        name="password"
        placeholder="Enter Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br /><br />

      <div className="btnSubmit">
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
);

};

export default Login;
