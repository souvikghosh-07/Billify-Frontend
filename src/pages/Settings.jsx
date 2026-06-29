import { useState, useEffect } from "react";
import axios from "axios";

function Settings({ user }) {
  const [activeTab, setActiveTab] = useState("profile");

  // Company Details State
  const [company, setCompany] = useState({
    companyDetailsId: "", 
    companyId: "",
    companyName: "",
    address: "",
    phNo: "",
  });

  // Page load howar somoy check korbe local storage e aager theke company details save ache kina
  useEffect(() => {
    const savedCompanyDetails = JSON.parse(localStorage.getItem("companyDetails"));
    if (savedCompanyDetails) {
      setCompany(savedCompanyDetails);
    }
  }, []);

  // Handle Save / Update Company Details
  const handleSaveCompany = async () => {
    if (!company.companyId || !company.companyName) {
      alert("Company ID and Name are required!");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("companyId", company.companyId);
      params.append("companyName", company.companyName);
      params.append("address", company.address);
      params.append("phNo", company.phNo);

      if (company.companyDetailsId) {
        // --- 2ND TIME: UPDATE LOGIC (PUT) ---
        params.append("CompanyDetailsId", company.companyDetailsId);
        
        const response = await axios.put("https://billify-backtend.onrender.com/updatecompanydetails", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        // Backend je updated data return korbe seta abar save kore nilam
        setCompany(response.data);
        localStorage.setItem("companyDetails", JSON.stringify(response.data));
        
        alert("Company Details Updated Successfully!");
      } else {
        // --- 1ST TIME: SAVE LOGIC (POST) ---
        const response = await axios.post("https://billify-backtend.onrender.com/addcompanydetails", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        // Backend je notun data (with generated ID) return korbe seta save kore nilam
        setCompany(response.data);
        localStorage.setItem("companyDetails", JSON.stringify(response.data));
        
        alert("Company Details Added Successfully!");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to process request.");
    }
  };

  return (
    <>
      <style>
        {`
          .settings-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 80vh;
            padding: 20px;
          }

          .settings-card {
            width: 100%;
            max-width: 800px;
            padding: 35px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            color: white;
          }

          .settings-title {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2rem;
            font-weight: 600;
          }

          /* Tabs Styling */
          .tabs-wrapper {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            overflow-x: auto;
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
          }

          .tab-btn {
            flex: 1;
            min-width: 140px;
            padding: 12px 15px;
            border: none;
            border-radius: 12px;
            background: #1e293b;
            color: white;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: 0.3s;
            text-align: center;
          }

          .tab-btn:hover {
            background: #334155;
          }

          .tab-btn.active {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          }

          /* Content Styling */
          .tab-content {
            background: rgba(0, 0, 0, 0.2);
            padding: 30px;
            border-radius: 16px;
          }

          /* Profile Section */
          .profile-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 25px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 20px;
          }

          .profile-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 35px;
            color: white;
          }

          .profile-info h3 {
            margin-bottom: 8px;
            color: #94a3b8;
            font-weight: 500;
          }

          .profile-info span {
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
          }

          /* Form Styling */
          .form-input {
            width: 100%;
            padding: 15px;
            margin-bottom: 18px;
            border: none;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.08);
            color: white;
            font-size: 1rem;
            outline: none;
          }
          
          .form-input:focus {
            border: 1px solid #60a5fa;
            box-shadow: 0 0 10px rgba(96, 165, 250, 0.4);
          }

          .submit-btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            transition: 0.3s;
          }
          
          /* Update button specific color */
          .update-btn {
            background: linear-gradient(135deg, #eab308, #ca8a04);
          }

          .submit-btn:hover {
            transform: translateY(-2px);
          }

          /* Text Sections */
          .text-content p {
            line-height: 1.8;
            color: #cbd5e1;
            margin-bottom: 15px;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            font-size: 1.1rem;
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 12px;
          }

          @media (max-width: 768px) {
            .settings-card { padding: 20px; }
            .tab-content { padding: 20px; }
            .profile-header { flex-direction: column; text-align: center; }
          }
        `}
      </style>

      <div className="settings-container">
        <div className="settings-card">
          <h2 className="settings-title">⚙️ Settings</h2>

          <div className="tabs-wrapper">
            <button 
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === "company" ? "active" : ""}`}
              onClick={() => setActiveTab("company")}
            >
              🏢 Company Details
            </button>
            <button 
              className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              🔒 Privacy Policy
            </button>
            <button 
              className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              📞 Contact Us
            </button>
          </div>

          <div className="tab-content">
            
            {activeTab === "profile" && (
              <div>
                <div className="profile-header">
                  <div className="profile-icon">
                    {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="profile-info">
                    <h2>{user?.userName || "Unknown User"}</h2>
                    <p style={{ color: "#94a3b8", marginTop: "5px" }}>Billify Member</p>
                  </div>
                </div>
                
                <div className="profile-info">
                  <h3>Name: <span>{user?.userName || "N/A"}</span></h3>
                  <h3>Email Address: <span>{user?.email || "Not Provided"}</span></h3>
                  
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div>
                <h3 style={{ marginBottom: "20px", color: "#60a5fa" }}>
                  {company.companyDetailsId ? "Update Company Details" : "Add Company Details"}
                </h3>
                
                {/* ID input box hide kore diyechi, user dekhte pabe na kintu backend a jabe */}
                
                <input
                  className="form-input"
                  type="text"
                  placeholder="Company ID *"
                  value={company.companyId}
                  onChange={(e) => setCompany({ ...company, companyId: e.target.value })}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Company Name *"
                  value={company.companyName}
                  onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Company Address"
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Contact Number (Ph. No)"
                  value={company.phNo}
                  onChange={(e) => setCompany({ ...company, phNo: e.target.value })}
                />

                <button 
                  className={`submit-btn ${company.companyDetailsId ? 'update-btn' : ''}`} 
                  onClick={handleSaveCompany}
                >
                  {company.companyDetailsId ? "Update Details" : "Save Details"}
                </button>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="text-content">
                <h3 style={{ marginBottom: "20px", color: "#60a5fa" }}>Privacy Policy</h3>
                <p>
                  Welcome to <strong>Billify</strong>! Your privacy is of paramount importance to us. This Privacy Policy outlines how we collect, use, and protect your personal and company data when you use our services.
                </p>
                <p>
                  <strong>Data Security:</strong> All travel and expense bills submitted through Billify are securely encrypted and stored. We do not share your financial records or company details with any third-party marketing agencies.
                </p>
                <p>
                  <strong>User Consent:</strong> By using our platform, you agree to the responsible management of your digital reports. You have full rights to view, download, or delete your generated bills at any given time.
                </p>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h3 style={{ marginBottom: "20px", color: "#60a5fa" }}>Get In Touch</h3>
                
                <div className="contact-item">
                  <span style={{ fontSize: "24px" }}>📧</span>
                  <div>
                    <strong style={{ display: "block", color: "#94a3b8" }}>Email Support</strong>
                    support@billifyapp.com
                  </div>
                </div>

                <div className="contact-item">
                  <span style={{ fontSize: "24px" }}>📞</span>
                  <div>
                    <strong style={{ display: "block", color: "#94a3b8" }}>Phone (Toll-Free)</strong>
                    +91 1800-123-4567
                  </div>
                </div>

                <div className="contact-item">
                  <span style={{ fontSize: "24px" }}>📱</span>
                  <div>
                    <strong style={{ display: "block", color: "#94a3b8" }}>WhatsApp Helpline</strong>
                    +91 98765-43210
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;