import { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient/axiosObject';
import { useJWT } from '../jwtContextProvider';

function Login() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState({
    email: '',
    password: ''
  })
  const [serverError, setServerError] = useState('');
  const {login} = useJWT();
  
  const navigate=useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    console.log(error);
    const newError={};

    if (!emailValue.trim()){
      newError.email='Email is required.'
    }
    else if (!emailRegex.test(emailValue)){
      newError.email='Please enter a valid email address.'
    }

    if (!passwordValue.trim()){
      newError.password='Password is required.'
    }
    else if (passwordValue.trim().length < 3){
      newError.password='Password must be more than 3 characters'
    }

    setError(newError);
    console.log(error);
    return Object.keys(newError).length === 0;
  }

  const handleSubmit= async (e)=>{
    e.preventDefault();
    const validatedResponse = validate();
    if (!validatedResponse){
      console.log('Validation failed.');
      return
    }
    console.log('Validation successful! Submitting Data.');
    setLoginLoading(true);
    
    try{
      const response = await apiClient.post("api/Auth/Login",
      JSON.stringify(
        {
        'username': emailValue,
        'password': passwordValue
        }
      ));
      
      console.log(response);

      if (response.status === 200) {
        const jwt = response.data.data.jwtToken;
        console.log(jwt);
        login(jwt);
        navigate('/inventory');
      }
    }catch(error){
      console.log(error);
      setServerError(error.message);
    }
    setLoginLoading(false);
  }

  
  
  return (
    <div id='loginPage'>
      <div id='login_cont'>
        <div id='welcome_back'>Welcome Back</div>
        <div id='input_form'>
          <div id='email'>
            <label>Email Address</label>
            <input className={`${error.email? 'error' : ''}`} name="email" type="email" placeholder='Enter your email' value={emailValue} onChange={(e)=>setEmailValue(e.target.value)}/>
            <div className={`error_email ${error.email? 'active' : ''}`}>{error.email? error.email : 'No Error'}</div>
          </div>
          <div id='password'>
            <label>Password</label>
            <input className={`${error.password? 'error' : ''}`} name="password" type="password" placeholder='Enter your password' value={passwordValue} onChange={(e)=>setPasswordValue(e.target.value)}/>
            <div className={`error_password ${error.password? 'active' : ''}`}>{error.password? error.password : 'No Error'}</div>          
          </div>
        </div>
        <button className={`submit_btn ${loginLoading? 'loading' : ''}`} onClick={handleSubmit} disabled={loginLoading}>{loginLoading? 'Logging in...' : 'Login'}</button>
        
        <div id='forgot_pwd'><a>Forgot Password?</a></div>
      </div>
      <div className={`serverError ${serverError? 'active' : ''}`}>
        {serverError}
      </div>
    </div>
    
  );
}

export default Login;
