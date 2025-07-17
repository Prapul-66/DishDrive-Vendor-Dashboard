import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath.js'; 

const Register = ({ showLoginHandler }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/vendor/register`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setUsername('');
        setEmail('');
        setPassword('');
        alert('Vendor Registration successful');
        showLoginHandler(); // Redirect to login after successful registration
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again later.');
    }
  };

  return (
    <div className="registerSection">
      <form className="authForm" onSubmit={handleSubmit}>
        <h3>Vendor Register</h3>

        <label>User Name</label><br />
        <input
          type="text"
          name="username"
          placeholder="Enter Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />

        <label>Email</label><br />
        <input
          type="text"
          name="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <label>Password</label><br />
        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <div className="btnSubmit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
