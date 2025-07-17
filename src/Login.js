import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  
  return (
    <div id='loginPage'>
      <div id='login_cont'>
        <div id='welcome_back'>Welcome Back</div>
        <div id='input_form'>
          <div id='username'>
            <label>Email</label>
            <input name="email" type="email" placeholder='Enter your email'/>
          </div>
          <div id='password'>
            <label>Password</label>
            <input name="password" type="password" placeholder='Enter your password'/>
          </div>
        </div>
        <button id='submit_btn' onClick={handleSubmit}>Submit</button>
        <div id='forgot_pwd'><a>Forgot Password?</a></div>
      </div>
    </div>
    
  );
}

export default Login;
