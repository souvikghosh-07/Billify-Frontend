import { useState, useEffect } from "react";
import axios from "axios";
import TravelBillForm from "./TravelBillForm";
import ExpenseBillForm from "./ExpenseBillForm";
import DownloadBill from "./DownloadBill";
import Settings from "./Settings";
import TravelBills from "./TravelBills";
import ExpenseBills from "./ExpenseBills";

function Dashboard() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?.userId;
  
  const [page, setPage] = useState("dashboard");
  const [showBills, setShowBills] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [editExpenseData, setEditExpenseData] = useState(null);
  const [editTravelData, setEditTravelData] = useState(null);

  const [stats, setStats] = useState({
    travelCount: 0,
    expenseCount: 0,
    travelAmount: 0,
    expenseAmount: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (page === "dashboard" && userId) {
      fetchDashboardStats();
    }
  }, [page, userId]);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("userId", userId);

      const config = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      };

      const [tCount, eCount, tAmount, eAmount] = await Promise.all([
        axios.post("https://billify-backtend.onrender.com/totaltavelbillcount", params, config),
        axios.post("https://billify-backtend.onrender.com/totalexpensebillcount", params, config),
        axios.post("https://billify-backtend.onrender.com/totaltavelbillamount", params, config),
        axios.post("https://billify-backtend.onrender.com/totalexpensebillamount", params, config),
      ]);

      setStats({
        travelCount: tCount.data || 0,
        expenseCount: eCount.data || 0,
        travelAmount: tAmount.data || 0,
        expenseAmount: eAmount.data || 0,
      });
    } catch (error) {
      console.log("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExpense = (bill) => {
    setEditExpenseData(bill);
    setPage("expense");
    setIsMenuOpen(false);
  };

  const handleEditTravel = (bill) => {
    setEditTravelData(bill);
    setPage("travel");
    setIsMenuOpen(false);
  };

  const handleNavigation = (targetPage) => {
    setPage(targetPage);
    if (targetPage === "expense") setEditExpenseData(null);
    if (targetPage === "travel") setEditTravelData(null);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      window.location.href = "/"; 
    }
  };

  // Helper to get today's date formatted
  const todayDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <>
      <style>
        {`
          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          .dashboard{
            min-height:100vh;
            display:flex;
            background:#020617;
            color:white;
            font-family:Inter,sans-serif;
            position: relative;
          }

          .mobile-header {
            display: none;
            width: 100%;
            background: #0f172a;
            padding: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 40;
          }

          .hamburger-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
          }

          .sidebar{
            width:280px;
            background:#0f172a;
            padding:30px;
            border-right:1px solid rgba(255,255,255,0.08);
            transition: all 0.3s ease-in-out;
            z-index: 50;
          }

          .logo{
            font-size:2rem;
            font-weight:800;
            margin-bottom:40px;
          }

          .logo span{
            color:#60a5fa;
          }

          .menu{
            display:flex;
            flex-direction:column;
            gap:15px;
          }

          .menu button{
            padding:15px;
            border:none;
            border-radius:12px;
            background:#1e293b;
            color:white;
            cursor:pointer;
            font-size:15px;
            text-align:left;
            transition:.3s;
          }

          .menu button:hover{
            background:#334155;
            transform:translateX(5px);
          }

          .menu button.active-btn {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          }

          .content{
            flex:1;
            padding:40px;
            background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
            overflow-y: auto;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .top-bar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 25px;
          }

          .logout-btn {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
          }

          .logout-btn:hover {
            background: #ef4444;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }

          /* Professional Welcome Banner */
          .welcome-banner {
            padding: 35px;
            border-radius: 24px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin-bottom: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }

          .welcome-banner h1 {
            font-size: 2.2rem;
            margin-bottom: 8px;
            padding-bottom: 10px;
            background: -webkit-linear-gradient(0deg, #fff, #cbd5e1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .welcome-banner p {
            color: #94a3b8;
            font-size: 1.1rem;
          }

          .date-badge {
            background: rgba(255, 255, 255, 0.1);
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 0.95rem;
          }

          /* Professional Cards Grid */
          .cards{
            display:grid;
            grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
            gap:24px;
          }

          .card{
            padding:30px;
            border-radius:20px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(96, 165, 250, 0.3);
          }

          .card-icon {
            font-size: 30px;
            margin-bottom: 15px;
            background: rgba(255,255,255,0.05);
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
          }

          .card h3{
            color:#94a3b8;
            margin-bottom:10px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
          }

          .card h2{
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
          }

          .card .highlight-amount {
            color: #4ade80; /* Nice soft green for money */
          }

          .overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 45;
            backdrop-filter: blur(4px);
          }

          /* --- Mobile Responsiveness Fixes --- */
          @media(max-width:768px){
            .dashboard{
              flex-direction:column;
            }
            .content {
              height: auto;
              padding: 20px;
            }
            .mobile-header {
              display: flex;
            }
            .sidebar {
              position: fixed;
              top: 0;
              left: -300px;
              height: 100vh;
              overflow-y: auto;
            }
            .sidebar.open {
              left: 0;
              box-shadow: 10px 0 30px rgba(0,0,0,0.5);
            }
            .overlay.show {
              display: block;
            }
            
            /* FIXED: Force 1 column on mobile to stop text squishing */
            .cards {
              grid-template-columns: 1fr;
            }
            .welcome-banner {
              padding: 25px;
              flex-direction: column;
              align-items: flex-start;
            }
            .welcome-banner h1 {
              font-size: 1.8rem;
            }
          }
        `}
      </style>

      <div className={`overlay ${isMenuOpen ? "show" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

      <div className="dashboard">
        
        <div className="mobile-header">
          <h2 className="logo" style={{ marginBottom: 0 }}>
            Bill<span>ify</span>
          </h2>
          <button className="hamburger-btn" onClick={() => setIsMenuOpen(true)}>☰</button>
        </div>

        <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="logo">Bill<span>ify</span></h2>
            <button className="hamburger-btn" style={{ marginBottom: "40px" }} onClick={() => setIsMenuOpen(false)}>✕</button>
          </div>

          <div className="menu">
            <button className={page === "dashboard" ? "active-btn" : ""} onClick={() => handleNavigation("dashboard")}>
              📊 Dashboard
            </button>
            <button className={page === "travel" ? "active-btn" : ""} onClick={() => handleNavigation("travel")}>
              ✈️ Create Travel Bill
            </button>
            <button className={page === "expense" ? "active-btn" : ""} onClick={() => handleNavigation("expense")}>
              💰 Create Expense Bill
            </button>

            <button onClick={() => setShowBills(!showBills)}>👁️ View Bills</button>

            {showBills && (
              <>
                <button
                  className={page === "travelBills" ? "active-btn" : ""}
                  onClick={() => handleNavigation("travelBills")}
                  style={{ marginLeft: "20px", background: page === "travelBills" ? "" : "rgba(255,255,255,0.05)" }}
                >
                  ✈️ Travel Bills
                </button>
                <button
                  className={page === "expenseBills" ? "active-btn" : ""}
                  onClick={() => handleNavigation("expenseBills")}
                  style={{ marginLeft: "20px", background: page === "expenseBills" ? "" : "rgba(255,255,255,0.05)" }}
                >
                  💰 Expense Bills
                </button>
              </>
            )}

            <button className={page === "download" ? "active-btn" : ""} onClick={() => handleNavigation("download")}>
              📄 Download Bill
            </button>
            <button className={page === "settings" ? "active-btn" : ""} onClick={() => handleNavigation("settings")}>
              ⚙️ Settings
            </button>
          </div>
        </div>

        <div className="content">
          <div className="top-bar">
            <button className="logout-btn" onClick={handleLogout}>Logout </button>
          </div>

          {page === "dashboard" && (
            <>
              {/* Premium Welcome Banner */}
              <div className="welcome-banner">
                <div>
                  <h1>Welcome back, {user?.userName?.split(" ")[0] || "User"} 👋</h1>
                  <p>Here is your financial overview and pending reports.</p>
                </div>
                <div className="date-badge">
                  📅 {todayDate}
                </div>
              </div>

              {/* 4 Professional Dashboard Cards */}
              <div className="cards">
                <div className="card">
                  <div className="card-icon">✈️</div>
                  <h3>Travel Bills</h3>
                  <h2>{isLoading ? "..." : stats.travelCount}</h2>
                </div>
                
                <div className="card">
                  <div className="card-icon">🧾</div>
                  <h3>Expense Bills</h3>
                  <h2>{isLoading ? "..." : stats.expenseCount}</h2>
                </div>
                
                <div className="card">
                  <div className="card-icon">💳</div>
                  <h3>Total Travel Cost</h3>
                  <h2 className="highlight-amount">
                    {isLoading ? "..." : `₹${Number(stats.travelAmount || 0).toLocaleString('en-IN')}`}
                  </h2>
                </div>
                
                <div className="card">
                  <div className="card-icon">💰</div>
                  <h3>Total Expense Cost</h3>
                  <h2 className="highlight-amount">
                    {isLoading ? "..." : `₹${Number(stats.expenseAmount || 0).toLocaleString('en-IN')}`}
                  </h2>
                </div>
              </div>
            </>
          )}

          {page === "travel" && <TravelBillForm user={user} editData={editTravelData} />}
          {page === "expense" && <ExpenseBillForm user={user} editData={editExpenseData} />}
          {page === "travelBills" && <TravelBills user={user} onEdit={handleEditTravel} />}
          {page === "expenseBills" && <ExpenseBills user={user} onEdit={handleEditExpense} />}
          {page === "download" && <DownloadBill user={user} />}
          {page === "settings" && <Settings user={user} />}
        </div>
      </div>
    </>
  );
}

export default Dashboard;