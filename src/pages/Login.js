import { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient/axiosObject';

function Login() {
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const navigate=useNavigate();
    const handleSubmit= async (e)=>{
      e.preventDefault();
      const response = await apiClient.post("api/Auth/Login",
        JSON.stringify(
          {
          'username': usernameValue,
          'password': passwordValue
          }
        )
        
      )
      console.log(response);
    }
  
  
  return (
    <div id='loginPage'>
      <div id='login_cont'>
        <div id='welcome_back'>Welcome Back</div>
        <div id='input_form'>
          <div id='username'>
            <label>Email</label>
            <input name="email" type="email" placeholder='Enter your email' value={usernameValue} onChange={(e)=>setUsernameValue(e.target.value)}/>
          </div>
          <div id='password'>
            <label>Password</label>
            <input name="password" type="password" placeholder='Enter your password' value={passwordValue} onChange={(e)=>setPasswordValue(e.target.value)}/>
          </div>
        </div>
        <button id='submit_btn' onClick={handleSubmit}>Submit</button>
        <div id='forgot_pwd'><a>Forgot Password?</a></div>
      </div>
    </div>
    
  );
}

export default Login;
