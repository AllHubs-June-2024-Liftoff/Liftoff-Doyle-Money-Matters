import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Register() {
  const [username, setUsername]= useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const navigate = useNavigate();
  const {authService} = api;

  // State for error messages
  const [errors, setErrors] = useState({});


  // Password Regex pattern
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]).{8,16}$/;
  const validatePassword = (password) =>{
    return password.length >=8;
  }
  //email format validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      // Validate all form fields
    const validateForm = () =>{
      const newErrors = {};

      if (!username || username.length < 3 || username.length > 30) {
        newErrors.username = 'Username must be between 3 and 30 characters.';
      }
      if (!password.match(passwordRegex) || !validatePassword(password)) {
        newErrors.password = 'Password must be between 8-16 characters, include at least one letter, one number, and one special character.';
      }
      if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
      if (!email.match(emailPattern)) {
        newErrors.email = 'Please enter a valid email address.';
      }

      setErrors(newErrors);
      if(Object.keys(newErrors).length > 0){
        setValidationMessage('Some fields are not following the needs. Please check the form')
      }else {
        setValidationMessage('');
      }
      return Object.keys(newErrors).length === 0;
    
  };


    // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    if (validateForm()) {

      try {
        const userData = {
          username,
          email,
          password,
          confirmPassword
        };

        const response = await authService.register(userData);
        console.log('Registration successful:', response);

        setValidationMessage('Registration successful!');

        // Clear form after successful signup
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        if (error.error === 'email_registered') {
          setErrors(prev => ({
            ...prev,
            email: 'This email is already registered'
          }));
        } else if (error.error === 'username_taken') {
          setErrors(prev => ({
            ...prev,
            username: 'This username is already taken'
          }));
        } else {
          setValidationMessage(error.message || 'Registration failed. Please try again.');
        }
        }
    }
  };
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className= "bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSignup}>
            <h1 className='text-2xl font-semibold text-center mb-6'>Register </h1>
            {validationMessage && <div className='text-red-500 text-center mb-4'>{validationMessage}</div>}
            <div className='block text-gray-700'>
                <label> Username: <input type="text" placeholder='Username'value={username} onChange={(e) => setUsername(e.target.value)} 
                className='mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required/></label>
                {errors.username && <span className='text-red-500 text-sm'>{errors.username}</span>}
            </div>
            <div className='mb-4'>
            <label className='block text-gray-700'> Password: <input type="password" placeholder='Password'value={password} onChange={(e) => setPassword(e.target.value)}
            className='mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required/></label>
                {errors.password && <span  className='text-red-500 text-sm'>{errors.password}</span>}
            </div>
            <div className='mb-4'>
            <label className='block text-gray-700'> Confirm password: <input type="password" placeholder='Confirm Password'value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
            className='mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'required/></label>
                {errors.confirmPassword && <span  className='text-red-500 text-sm'>{errors.confirmPassword}</span>}
            </div>
            <div className='mb-4'>
            <label className='block text-gray-700'> email: <input type="email" placeholder='email'value={email} onChange={(e) => setEmail(e.target.value)} 
            className='mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'required/></label>
                {errors.email && <span  className='text-red-500 text-sm'>{errors.email}</span>}
            </div>
            
            <button type='submit' className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>Register </button>

            <div className='mt-4 text-center'>
                <p>Already have an account?<Link to= "/login" className='text-blue-600 hover:text-blue-700'>Login</Link></p>
            </div>

       </form>   
      </div>
    </div>
  )
}

export default Register
