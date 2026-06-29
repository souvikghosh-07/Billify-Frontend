import { useState, useEffect } from "react";
import axios from "axios";
import TravelBillForm from "./TravelBillForm";
import ExpenseBillForm from "./ExpenseBillForm";
import DownloadBill from "./DownloadBill";
import Settings from "./Settings";
import TravelBills from "./TravelBills";
import ExpenseBills from "./ExpenseBills";

function Dashboard() {
  // We use useMemo or just extract the primitive ID to avoid infinite loops
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

  // FIX: Using 'userId' (a primitive) instead of 'user' (an object) stops the infinite loop!
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
            background: #ef4444;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }

          .logout-btn:hover {
            background: #dc2626;
            transform: translateY(-2px);
          }

          .welcome-card{
            padding:30px;
            border-radius:24px;
            background:rgba(255,255,255,0.05);
            backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,0.08);
            margin-bottom:30px;
          }

          .welcome-card h1{
            margin-bottom:10px;
          }

          .welcome-card p{
            color:#94a3b8;
          }

          .cards{
            display:grid;
            grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
            gap:20px;
          }

          .card{
            padding:25px;
            border-radius:20px;
            background:rgba(255,255,255,0.05);
            backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,0.08);
          }

          .card h3{
            color:#94a3b8;
            margin-bottom:10px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .card h2{
            color:#60a5fa;
            font-size: 28px;
          }

          .overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 45;
            backdrop-filter: blur(4px);
          }

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
                  style={{ marginLeft: "20px", background: page === "travelBills" ? "" : "#374151" }}
                >
                  ✈️ Travel Bills
                </button>
                <button
                  className={page === "expenseBills" ? "active-btn" : ""}
                  onClick={() => handleNavigation("expenseBills")}
                  style={{ marginLeft: "20px", background: page === "expenseBills" ? "" : "#374151" }}
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
            <button className="logout-btn" onClick={handleLogout}>Logout 🚪</button>
          </div>

          {page === "dashboard" && (
            <>
              <div className="welcome-card">
                <h1>Welcome, {user?.userName}</h1>
                <p>Manage your travel bills, expenses and reports from one place.</p>
              </div>

              <div className="cards">
                <div className="card">
                  <h3>Travel Bills Submitted</h3>
                  <h2>{isLoading ? "Loading..." : stats.travelCount}</h2>
                </div>
                <div className="card">
                  <h3>Expense Bills Submitted</h3>
                  <h2>{isLoading ? "Loading..." : stats.expenseCount}</h2>
                </div>
                <div className="card">
                  <h3>Total Travel Cost</h3>
                  <h2>{isLoading ? "Loading..." : `₹${stats.travelAmount}`}</h2>
                </div>
                <div className="card">
                  <h3>Total Expense Cost</h3>
                  <h2>{isLoading ? "Loading..." : `₹${stats.expenseAmount}`}</h2>
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