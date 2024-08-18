import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.scss';

const Login = ({ user, setUser, isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [invalidID, setInvalidID] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);
  const [values, setValues] = useState({ id: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/login_user', values, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          setInvalidID(false);
          setInvalidPass(false);
          setUser(response.data.username);
          setIsLoggedIn(true);
          navigate(`/${response.data.username}/all_movies`);
        }
      })
      .catch(error => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 404) {
            setInvalidID(true);
            setInvalidPass(true);
          } else if (status === 401) {
            setInvalidID(false);
            setInvalidPass(true);
          } else {
            setInvalidID(true);
            setInvalidPass(true);
          }
          setIsLoggedIn(false);
        }
        alert('Login failed');
      });
  };

  return (
    <div className='contain_form'>
      <div className='formContainer'>
        <h1>Login</h1>
        <h2>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          <div className='formInfo'>
            <div className={`row ${invalidID ? 'error' : ''}`}>
              <label htmlFor="id">Email or Username</label>
              <input 
                type="text" 
                name='id' 
                placeholder='Email or Username'
                onChange={handleChange} 
                className={invalidID ? 'error' : ''} 
              />
            </div>
            <div className='message' style={{ display: invalidID ? 'block' : 'none' }}>
              ✖ Invalid username
            </div>
            <div className='gap'></div>
            <div className={`row ${invalidPass ? 'error' : ''}`}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name='password' 
                placeholder='Password'
                onChange={handleChange} 
                className={invalidPass ? 'error' : ''} 
              />
            </div>
            <div className='message' style={{ display: invalidPass ? 'block' : 'none' }}>
              ✖ Wrong password
            </div>
          </div>
          <div className='sub_btn'><button type='submit'>LOGIN</button></div>
        </form>
        <div className='goto'><p>Don't have an account?</p><Link to="/Register">Sign Up</Link></div>
      {/*  <div className='forgot'><Link to="/">Forgot your password?</Link></div> */}
      </div>
    </div>
  );
};

export default Login;
