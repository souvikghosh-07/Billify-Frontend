import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("email", formData.email);
      params.append("password", formData.password);

      const response = await axios.post(
        "https://billify-backtend.onrender.com/signin",
        params
      );

      if (response.data) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
        alert("Login Successful");
        navigate("/dashboard");
      } else {
        alert("Invalid Email or Password");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          .signin-page{
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            background:#020617;
            position:relative;
            overflow:hidden;
            font-family:Inter,sans-serif;
          }

          .glow{
            position:absolute;
            border-radius:50%;
            filter:blur(120px);
          }

          .glow1{
            width:400px;
            height:400px;
            background:#3b82f6;
            top:-120px;
            left:-120px;
            opacity:.25;
          }

          .glow2{
            width:400px;
            height:400px;
            background:#8b5cf6;
            bottom:-120px;
            right:-120px;
            opacity:.25;
          }

          .signin-card{
            width:420px;
            padding:40px;
            border-radius:24px;
            background:rgba(255,255,255,0.05);
            backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,0.1);
            box-shadow:0 20px 50px rgba(0,0,0,0.3);
            z-index:2;
          }

          .logo{
            text-align:center;
            margin-bottom:10px;
            color:white;
            font-size:2rem;
            font-weight:800;
          }

          .logo span{
            color:#60a5fa;
          }

          .signin-card h2{
            text-align:center;
            color:white;
            margin-bottom:10px;
            font-size:1.8rem;
          }

          .subtitle{
            text-align:center;
            color:#94a3b8;
            margin-bottom:30px;
          }

          .form-group{
            margin-bottom:18px;
          }

          .form-group input{
            width:100%;
            padding:15px;
            border-radius:12px;
            border:1px solid rgba(255,255,255,0.1);
            background:rgba(255,255,255,0.05);
            color:white;
            font-size:1rem;
            outline:none;
            transition:.3s;
          }

          .form-group input:focus{
            border-color:#60a5fa;
            box-shadow:0 0 15px rgba(96,165,250,.3);
          }

          .form-group input::placeholder{
            color:#94a3b8;
          }

          .login-btn{
            width:100%;
            padding:15px;
            border:none;
            border-radius:12px;
            cursor:pointer;
            color:white;
            font-size:1rem;
            font-weight:600;
            background:linear-gradient(
              135deg,
              #3b82f6,
              #8b5cf6
            );
            transition:.3s;
          }

          .login-btn:hover:not(:disabled){
            transform:translateY(-2px);
          }

          .login-btn:disabled{
            opacity: 0.7;
            cursor: not-allowed;
          }

          .signup-text{
            text-align:center;
            margin-top:20px;
            color:#cbd5e1;
          }

          .signup-text a{
            color:#60a5fa;
            text-decoration:none;
            font-weight:600;
          }

          .signup-text a:hover{
            text-decoration:underline;
          }

          @media(max-width:500px){
            .signin-card{
              width:90%;
              padding:30px 20px;
            }

            .logo{
              font-size:1.8rem;
            }

            .signin-card h2{
              font-size:1.5rem;
            }
          }
        `}
      </style>

      <div className="signin-page">
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>

        <div className="signin-card">
          <div className="logo">
            Bill<span>ify</span>
          </div>

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Sign in to access your billing dashboard
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Sign In"}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignIn;