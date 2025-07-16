import './Login.css';
function Login() {
  return (
    <div className="main">
        <div> 
        <form>
            <h2>Welcome back!!</h2>
            <label>Email</label>
            <input name="email" type="email" />
            <label>Password</label>
            <input name="password" type="password"/>
            <button >submit</button>
            <span>forgot password?</span>
        </form>
        </div>
    </div>
  );
}

export default Login;
