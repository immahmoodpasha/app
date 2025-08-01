import { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient/axiosObject';

function Login() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState({
    email: '',
    password: ''
  })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (!emailValue.trim()){
      error.email='Email is required.'
    }
    else if (!emailRegex.test(emailValue)){
      error.email='Please enter a valid email address.'
    }

    if (!passwordValue.trim()){
      error.password='Password is required.'
    }
    else if (passwordValue.trim().length < 3){
      error.password='Password must be more than 3 characters'
    }
  }

  const navigate=useNavigate();
  const handleSubmit= async (e)=>{
    e.preventDefault();
    setLoginLoading(true);
    
    try{
      const response = await apiClient.post("api/Auth/Login",
      JSON.stringify(
        {
        'email': emailValue,
        'password': passwordValue
        }
      ));
      console.log(response);
    }catch(error){
      console.log(error);
    }
    setLoginLoading(false);
  }

  
  
  return (
    <div id='loginPage'>
      <div id='login_cont'>
        <div id='welcome_back'>Welcome Back</div>
        <div id='input_form'>
          <div id='email'>
            <label>Email</label>
            <input name="email" type="email" placeholder='Enter your email' value={emailValue} onChange={(e)=>setEmailValue(e.target.value)}/>
          </div>
          <div id='password'>
            <label>Password</label>
            <input name="password" type="password" placeholder='Enter your password' value={passwordValue} onChange={(e)=>setPasswordValue(e.target.value)}/>
          </div>
        </div>
        {loginLoading? <button id='submit_btn_loading' disabled>Logging in ...</button> : <button id='submit_btn' onClick={handleSubmit}>Login</button>}
        
        <div id='forgot_pwd'><a>Forgot Password?</a></div>
      </div>
    </div>
    
  );
}

export default Login;
