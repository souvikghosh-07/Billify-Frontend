import { useState, useEffect } from "react";
import axios from "axios";

function Settings({ user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Change Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Company Details State
  const [company, setCompany] = useState({
    companyDetailsId: "", 
    companyId: "",
    companyName: "",
    address: "",
    phNo: "",
  });

  useEffect(() => {
    const savedCompanyDetails = JSON.parse(localStorage.getItem("companyDetails"));
    if (savedCompanyDetails) {
      setCompany(savedCompanyDetails);
    }
  }, []);

  const handleSaveCompany = async () => {
    if (!company.companyId || !company.companyName) {
      alert("Company ID and Name are required!");
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("companyId", company.companyId);
      params.append("companyName", company.companyName);
      params.append("address", company.address);
      params.append("phNo", company.phNo);

      if (company.companyDetailsId) {
        params.append("CompanyDetailsId", company.companyDetailsId);
        
        const response = await axios.put("https://billify-backtend.onrender.com/updatecompanydetails", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        setCompany(response.data);
        localStorage.setItem("companyDetails", JSON.stringify(response.data));
        
        alert("Company Details Updated Successfully!");
      } else {
        const response = await axios.post("https://billify-backtend.onrender.com/addcompanydetails", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        setCompany(response.data);
        localStorage.setItem("companyDetails", JSON.stringify(response.data));
        
        alert("Company Details Added Successfully!");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to process request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match!");
      return;
    }

    setIsChangingPwd(true);

    try {
      const params = new URLSearchParams();
      params.append("userId", user.userId);
      params.append("oldPassword", oldPassword);
      params.append("newPassword", newPassword);

      const response = await axios.put("https://billify-backtend.onrender.com/passwordchange", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      alert(response.data);
      
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    } catch (err) {
      console.log(err);
      alert("Failed to change password.");
    } finally {
      setIsChangingPwd(false);
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

          .tab-content {
            background: rgba(0, 0, 0, 0.2);
            padding: 30px;
            border-radius: 16px;
          }

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
          
          .update-btn {
            background: linear-gradient(135deg, #eab308, #ca8a04);
          }
          
          .cancel-btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            background: #ef4444;
            transition: 0.3s;
          }

          .submit-btn:hover:not(:disabled), .cancel-btn:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .text-content p {
            line-height: 1.8;
            color: #cbd5e1;
            margin-bottom: 15px;
            font-size: 1rem;
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

          .btn-group {
            display: flex;
            gap: 15px;
          }

          @media (max-width: 768px) {
            .settings-card { padding: 20px; }
            .tab-content { padding: 20px; }
            .profile-header { flex-direction: column; text-align: center; }
            .btn-group { flex-direction: column; }
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

                <div style={{ marginTop: "35px", paddingTop: "25px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  {!showPasswordFields ? (
                    <button 
                      className="submit-btn" 
                      onClick={() => setShowPasswordFields(true)}
                    >
                      Change Password
                    </button>
                  ) : (
                    <div>
                      <h3 style={{ marginBottom: "20px", color: "#60a5fa" }}>Update Password</h3>
                      <input
                        className="form-input"
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <input
                        className="form-input"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <input
                        className="form-input"
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <div className="btn-group">
                        <button 
                          className="submit-btn" 
                          onClick={handleChangePassword}
                          disabled={isChangingPwd}
                        >
                          {isChangingPwd ? "Updating..." : "Submit"}
                        </button>
                        <button 
                          className="cancel-btn" 
                          onClick={() => {
                            setShowPasswordFields(false);
                            setOldPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          disabled={isChangingPwd}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div>
                <h3 style={{ marginBottom: "20px", color: "#60a5fa" }}>
                  {company.companyDetailsId ? "Update Company Details" : "Add Company Details"}
                </h3>
                
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
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : (company.companyDetailsId ? "Update Details" : "Save Details")}
                </button>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="text-content">
                <h3 style={{ marginBottom: "20px", color: "#60a5fa" }}>Privacy Policy</h3>
                <p>
                  At <strong>Billify</strong>, we are committed to safeguarding your privacy. This Privacy Policy outlines our practices regarding the collection, storage, and protection of your personal and corporate information.
                </p>

                <div style={{ marginTop: "25px" }}>
                  <h4 style={{ color: "#f8fafc", marginBottom: "8px", fontSize: "1.1rem" }}>1. Information We Collect</h4>
                  <p>We collect essential data required to provide our services efficiently, including user profile details, company settings, and submitted travel or expense records.</p>
                  
                  <h4 style={{ color: "#f8fafc", margin: "20px 0 8px 0", fontSize: "1.1rem" }}>2. Data Security & Storage</h4>
                  <p>All financial records and bills processed through Billify are secured using industry-standard encryption. We maintain strict access controls to ensure your corporate data remains confidential and is protected against unauthorized access.</p>
                  
                  <h4 style={{ color: "#f8fafc", margin: "20px 0 8px 0", fontSize: "1.1rem" }}>3. Third-Party Disclosure</h4>
                  <p>Your trust is our top priority. Billify guarantees that your financial data, expense claims, and company details are never sold, rented, or shared with third-party marketing agencies under any circumstances.</p>
                  
                  <h4 style={{ color: "#f8fafc", margin: "20px 0 8px 0", fontSize: "1.1rem" }}>4. Your Rights & Control</h4>
                  <p>You retain full ownership of your data. As a user, you have complete authority to access, modify, download, or permanently delete your generated reports and profile information at any time directly through the platform.</p>
                </div>
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
                    +91 6296191723
                  </div>
                </div>

                <div className="contact-item">
                  <span style={{ fontSize: "24px" }}>📱</span>
                  <div>
                    <strong style={{ display: "block", color: "#94a3b8" }}>WhatsApp Helpline</strong>
                    +91 6296191723
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