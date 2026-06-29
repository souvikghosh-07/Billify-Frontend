import { useEffect, useState } from "react";
import axios from "axios";

function TravelBills({ user, onEdit }) {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const params = new URLSearchParams();
      params.append("userId", user.userId);

      const response = await axios.post(
        "http://localhost:6296/showtravelbill",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setBills(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Function for Travel Bill
  const handleDelete = async (travelBillId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this travel bill?");
    if (!confirmDelete) return;

    try {
      await axios.delete("http://localhost:6296/deletetravelbill", {
        params: { travelBillId: travelBillId },
      });

      // Update UI instantly
      setBills(bills.filter((bill) => bill.travelBillId !== travelBillId));
      alert("Travel Bill Deleted Successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to delete travel bill!");
    }
  };

  return (
    <>
      <style>
        {`
          .table-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 80vh;
            padding: 40px 20px;
          }

          .table-card {
            width: 100%;
            max-width: 900px;
            padding: 30px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          .table-title {
            text-align: center;
            color: white;
            margin-bottom: 30px;
            font-size: 2rem;
            font-weight: 600;
          }

          /* Added a wrapper for mobile scrolling */
          .table-wrapper {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .modern-table {
            width: 100%;
            min-width: 600px; /* Prevents columns from squishing on mobile */
            border-collapse: collapse;
            table-layout: fixed; 
            overflow: hidden;
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.2);
          }

          .modern-table thead {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          }

          .modern-table th {
            padding: 16px;
            text-align: center; 
            color: white;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 0.5px;
          }

          .modern-table td {
            padding: 16px;
            text-align: center; 
            color: #e2e8f0;
            font-size: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .modern-table tbody tr {
            transition: all 0.3s ease;
          }

          .modern-table tbody tr:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.01);
          }

          .modern-table tbody tr:last-child td {
            border-bottom: none;
          }

          .amount-text {
            font-weight: 600;
            color: #4ade80; 
          }

          /* Buttons CSS */
          .action-btns {
            display: flex;
            gap: 10px;
            justify-content: center;
          }

          .edit-btn {
            background: #eab308;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.3s;
          }

          .edit-btn:hover { background: #ca8a04; }

          .delete-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.3s;
          }

          .delete-btn:hover { background: #dc2626; }

          /* Mobile Responsiveness Rules */
          @media (max-width: 768px) {
            .table-container {
              padding: 20px 10px;
            }
            .table-card {
              padding: 20px 15px;
            }
            .table-title {
              font-size: 1.5rem;
              margin-bottom: 20px;
            }
            .modern-table th, .modern-table td {
              padding: 12px 10px;
              font-size: 14px;
            }
            .action-btns {
              flex-direction: column; /* Stacks buttons on very small screens */
              gap: 5px;
            }
          }
        `}
      </style>

      <div className="table-container">
        <div className="table-card">
          <h2 className="table-title">✈️ My Travel Bills</h2>
          
          {/* Wrapper to allow horizontal scrolling on small screens */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.travelBillId}>
                    <td>{new Date(bill.date).toLocaleDateString("en-GB")}</td>
                    <td>{bill.fromLocation}</td>
                    <td>{bill.toLocation}</td>
                    <td className="amount-text">₹{bill.amount}</td>
                    <td>
                      <div className="action-btns">
                        <button 
                          className="edit-btn"
                          onClick={() => onEdit(bill)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(bill.travelBillId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

export default TravelBills;