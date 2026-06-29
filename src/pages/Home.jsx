import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [loadingTarget, setLoadingTarget] = useState(null);

  const handleNavigation = (path) => {
    setLoadingTarget(path);
    navigate(path);
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

          .home-container{
            min-height:100vh;
            background:#020617;
            position:relative;
            overflow:hidden;
            color:white;
            font-family:Inter, sans-serif;
          }

          .bg-glow{
            position:absolute;
            border-radius:50%;
            filter:blur(120px);
          }

          .glow-1{
            width:450px;
            height:450px;
            background:#3b82f6;
            top:-150px;
            left:-150px;
            opacity:.25;
          }

          .glow-2{
            width:400px;
            height:400px;
            background:#8b5cf6;
            bottom:-150px;
            right:-150px;
            opacity:.25;
          }

          .navbar{
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:25px 8%;
            position:relative;
            z-index:10;
          }

          .logo{
            font-size:2rem;
            font-weight:800;
            letter-spacing:1px;
          }

          .logo span{
            color:#60a5fa;
          }

          .nav-actions{
            display:flex;
            gap:15px;
          }

          .nav-btn{
            padding:12px 22px;
            border-radius:12px;
            cursor:pointer;
            font-weight:600;
            transition:.3s ease;
          }

          .login{
            background:rgba(255,255,255,.05);
            border:1px solid rgba(255,255,255,.1);
            color:white;
          }

          .signup{
            border:none;
            color:white;
            background:linear-gradient(
              135deg,
              #3b82f6,
              #8b5cf6
            );
          }

          .nav-btn:hover:not(:disabled),
          .hero-btn:hover:not(:disabled){
            transform:translateY(-3px);
          }

          .nav-btn:disabled, 
          .hero-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .hero-section{
            min-height:85vh;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            text-align:center;
            padding:20px;
            position:relative;
            z-index:10;
          }

          .hero-badge{
            padding:10px 18px;
            border-radius:999px;
            background:rgba(255,255,255,.05);
            border:1px solid rgba(255,255,255,.1);
            margin-bottom:25px;
            backdrop-filter:blur(10px);
          }

          .hero-section h1{
            font-size:4.5rem;
            max-width:900px;
            line-height:1.1;
            margin-bottom:25px;
          }

          .gradient-text{
            background:linear-gradient(
              90deg,
              #60a5fa,
              #a855f7
            );
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
          }

          .hero-section p{
            max-width:750px;
            color:#cbd5e1;
            font-size:1.1rem;
            line-height:1.8;
            margin-bottom:40px;
          }

          .hero-buttons{
            display:flex;
            gap:20px;
            flex-wrap:wrap;
            justify-content:center;
          }

          .hero-btn{
            padding:15px 32px;
            border:none;
            border-radius:14px;
            font-size:1rem;
            font-weight:600;
            cursor:pointer;
            transition:.3s ease;
          }

          .primary{
            background:linear-gradient(
              135deg,
              #3b82f6,
              #8b5cf6
            );
            color:white;
          }

          .secondary{
            background:rgba(255,255,255,.05);
            color:white;
            border:1px solid rgba(255,255,255,.1);
          }

          .stats{
            display:flex;
            gap:25px;
            flex-wrap:wrap;
            justify-content:center;
            margin-top:70px;
          }

          .stat-card{
            min-width:180px;
            padding:25px;
            border-radius:20px;
            background:rgba(255,255,255,.05);
            backdrop-filter:blur(15px);
            border:1px solid rgba(255,255,255,.1);
          }

          .stat-card h3{
            font-size:2rem;
            color:#60a5fa;
            margin-bottom:10px;
          }

          .stat-card p{
            margin:0;
            color:#cbd5e1;
          }

          @media(max-width:768px){

            .navbar{
              padding:20px;
            }

            .hero-section h1{
              font-size:2.8rem;
            }

            .hero-section p{
              font-size:1rem;
            }

            .stats{
              margin-top:50px;
            }

            .stat-card{
              width:100%;
              max-width:280px;
            }
          }
        `}
      </style>

      <div className="home-container">
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>

        <nav className="navbar">
          <h2 className="logo">
            Bill<span>ify</span>
          </h2>

          <div className="nav-actions">
            <button
              className="nav-btn login"
              onClick={() => handleNavigation("/signin")}
              disabled={loadingTarget !== null}
            >
              {loadingTarget === "/signin" ? "Processing..." : "Sign In"}
            </button>

            <button
              className="nav-btn signup"
              onClick={() => handleNavigation("/signup")}
              disabled={loadingTarget !== null}
            >
              {loadingTarget === "/signup" ? "Processing..." : "Sign Up"}
            </button>
          </div>
        </nav>

        <section className="hero-section">
          <div className="hero-badge">
            ⚡ Smart Billing Platform
          </div>

          <h1>
            Manage Bills{" "}
            <span className="gradient-text">
              Smarter & Faster
            </span>
          </h1>

          <p>
            Billify helps companies create, track and manage bills
            efficiently. Generate invoices, maintain records and
            streamline your billing process with a powerful and
            modern dashboard.
          </p>

          <div className="hero-buttons">
            <button
              className="hero-btn primary"
              onClick={() => handleNavigation("/signup")}
              disabled={loadingTarget !== null}
            >
              {loadingTarget === "/signup" ? "Processing..." : "Get Started →"}
            </button>

            <button
              className="hero-btn secondary"
              onClick={() => handleNavigation("/signin")}
              disabled={loadingTarget !== null}
            >
              {loadingTarget === "/signin" ? "Processing..." : "Sign In"}
            </button>
          </div>

          <div className="stats">
            <div className="stat-card">
              <h3>10K+</h3>
              <p>Bills Generated</p>
            </div>

            <div className="stat-card">
              <h3>500+</h3>
              <p>Companies</p>
            </div>

            <div className="stat-card">
              <h3>99.9%</h3>
              <p>Accuracy</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;