import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.scss';

const Register = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const navigate = useNavigate();
  const [invalidID, setInvalidID] = useState('');
  const [invalidEmail, setInvalidEmail] = useState('');
  const [invalidPass, setInvalidPass] = useState('');
  const [invalidPass2, setInvalidPass2] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const special_characters = [
    "~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", 
    "=", "{", "}", "[", "]", "|", "\\", ";", ":", "\"", "<", ">", ",", ".", "/",
    "?"
  ];
  
  // check if string contains special characters
  function containsSpecialCharacter(password) {
    return special_characters.some(character => password.includes(character));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, password2 } = values;

    // username has to be more than 5 letters
    // password has to be longer than 10, include special characters, numbers

    // username
    if (username === '') {
      setInvalidID("Username cannot be blank.");
    } else if (username.length < 5) {
      setInvalidID("Username has to be longer than 5 letters.");
    } else {
      setInvalidID('');
    } 
    
    // email
    if (email === '') {
      setInvalidEmail("Email cannot be blank.");
    } else {
      setInvalidEmail("");
    }
    
    // password
    if (password === '') {
      setInvalidPass("Password cannot be blank.");
    } else if (password.length < 10) {
      setInvalidPass("Password needs to be longer than 10 letters.");
    } else if (containsSpecialCharacter(password)) {
        if (password === password2) {
          setInvalidPass('');  
          axios.post('http://localhost:5000/api/auth/add_user', values)
            .then(response => {
              // register
              if (response.status === 201) {
                console.log(response.data);
                alert('Account created! Login to continue.')
                navigate('/login');
              }
            })
            .catch(error => {
              if (error.response) {
                const { status, data } = error.response;

                if (status === 409) {
                  if (data.error === 'Username already exists') {
                    setInvalidID("Username already exists");
                  }
                  else if (data.error === 'Email already exists') {
                    setInvalidEmail("Email already exists");
                  }
                }
                else if (status === 500 ){
                  console.log("Invalid:",  data.error);
                }
                alert("error");
              }
            });
        } else {
          setInvalidPass2('Passwords do not match');
        }
    } else {
        setInvalidPass("Need special characters");
    }
    if (password !== password2) {
      setInvalidPass2('Passwords do not match');  
    } if (password2 === '') {
      setInvalidPass2("Password cannot be blank.");
    } else {
      setInvalidPass2('');
    }
  };

  return (
    <div className='contain_form'>
      <div className='formContainer'>
        <h1>Register</h1>
        <h2>Keep track of your watch list</h2>
        <form onSubmit={handleSubmit}>
          <div className='formInfo'>
            <div className={`row ${invalidID !== '' ? 'error' : ''}`}>              
              <label htmlFor="username">Username</label>
              <input type="text" name='username' onChange={handleChange} className={invalidID !== '' ? 'error' : ''} />
            </div>
            <div className='message'>{invalidID}</div>
            <div className={`row ${invalidEmail !== '' ? 'error' : ''}`}>              
              <label htmlFor="email">Email</label>
              <input type="email" name='email' onChange={handleChange} className={invalidEmail !== '' ? 'error' : ''} />
            </div>
            <div className='message'>{invalidEmail}</div>
            <div className={`row ${invalidPass !== '' ? 'error' : ''}`}>              
              <label htmlFor="password">Password</label>
              <input type="password" name='password' onChange={handleChange} className={invalidPass !== '' ? 'error' : ''} />
            </div>
            <div className='message'>{invalidPass}</div>
            <div className={`row ${invalidPass2 !== '' ? 'error' : ''}`}>              
              <label htmlFor="password2">Verify Your Password</label>
              <input type="password" name='password2' onChange={handleChange} className={invalidPass2 !== '' ? 'error' : ''} />
            </div>
            <div className='message'>{invalidPass2}</div>
            <div className='gap'></div>
            <div className='sub_btn'><button type='submit'>SIGN UP</button></div>
          </div>
        </form>

        <div className='backto'>
          <p>Already have an account?</p>
          <Link to="/Login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
