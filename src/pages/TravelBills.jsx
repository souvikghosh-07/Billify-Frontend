import { useEffect, useState } from "react";
import axios from "axios";

function TravelBills({ user, onEdit }) {
  const [bills, setBills] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  
  // New States for Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 5; // Ek page e 5 ta bill dekhabe

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const params = new URLSearchParams();
      params.append("userId", user.userId);

      const response = await axios.post(
        "https://billify-backtend.onrender.com/showtravelbill",
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const sortedBills = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setBills(sortedBills);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (travelBillId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this travel bill?");
    if (!confirmDelete) return;

    setDeletingId(travelBillId);
    try {
      await axios.delete("https://billify-backtend.onrender.com/deletetravelbill", {
        params: { travelBillId: travelBillId },
      });
      setBills(bills.filter((bill) => bill.travelBillId !== travelBillId));
      alert("Travel Bill Deleted Successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to delete travel bill!");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter & Pagination Logic
  const filteredBills = bills.filter((bill) => 
    bill.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bill.toLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  return (
    <>
      <style>
        {`
          .table-container { display: flex; justify-content: center; align-items: flex-start; min-height: 80vh; padding: 40px 20px; }
          .table-card { width: 100%; max-width: 900px; padding: 30px; border-radius: 24px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
          .table-title { text-align: center; color: white; margin-bottom: 30px; font-size: 2rem; font-weight: 600; }
          
          /* Search Input */
          .search-input { width: 100%; padding: 15px; margin-bottom: 20px; border: none; border-radius: 12px; background: rgba(255, 255, 255, 0.08); color: white; outline: none; font-size: 16px; }
          .search-input:focus { border: 1px solid #60a5fa; }
          
          .table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .modern-table { width: 100%; min-width: 600px; border-collapse: collapse; table-layout: fixed; border-radius: 12px; background: rgba(0, 0, 0, 0.2); }
          .modern-table thead { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
          .modern-table th, .modern-table td { padding: 16px; text-align: center; color: white; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
          
          .amount-text { font-weight: 600; color: #4ade80; }
          .action-btns { display: flex; gap: 10px; justify-content: center; }
          .edit-btn { background: #eab308; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
          .delete-btn { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
          
          /* Pagination CSS */
          .pagination { display: flex; justify-content: center; gap: 15px; margin-top: 20px; align-items: center; color: white; }
          .page-btn { padding: 8px 16px; border-radius: 8px; border: none; background: #3b82f6; color: white; cursor: pointer; font-weight: 600; }
          .page-btn:disabled { background: #475569; cursor: not-allowed; }
          
          @media (max-width: 768px) {
            .table-container { padding: 20px 10px; }
            .table-card { padding: 20px 15px; }
            .action-btns { flex-direction: column; gap: 5px; }
          }
        `}
      </style>

      <div className="table-container">
        <div className="table-card">
          <h2 className="table-title">✈️ My Travel Bills</h2>

          <input 
            type="text" 
            placeholder="Search by From/To location..." 
            className="search-input"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />

          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr><th>Date</th><th>From</th><th>To</th><th>Amount</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {currentBills.map((bill) => (
                  <tr key={bill.travelBillId}>
                    <td>{new Date(bill.date).toLocaleDateString("en-GB")}</td>
                    <td>{bill.fromLocation}</td>
                    <td>{bill.toLocation}</td>
                    <td className="amount-text">₹{bill.amount}</td>
                    <td>
                      <div className="action-btns">
                        <button className="edit-btn" onClick={() => onEdit(bill)} disabled={deletingId !== null}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(bill.travelBillId)} disabled={deletingId !== null}>
                          {deletingId === bill.travelBillId ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages || 1}</span>
            <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TravelBills;