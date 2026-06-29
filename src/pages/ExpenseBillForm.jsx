import { useState, useEffect } from "react";
import axios from "axios";

function ExpenseBillForm({ user, editData }) {
  const [data, setData] = useState({
    date: "",
    reason: "",
    amount: "",
  });

  useEffect(() => {
    if (editData) {
      const formattedDate = new Date(editData.date).toISOString().split("T")[0];
      setData({
        date: formattedDate,
        reason: editData.reason,
        amount: editData.amount,
      });
    } else {
      setData({
        date: "",
        reason: "",
        amount: "",
      });
    }
  }, [editData]);

  const saveExpense = async () => {
    try {
      const params = new URLSearchParams();

      // Common parameters (duto API tei lagbe)
      params.append("userId", user.userId);
      params.append("date", data.date);
      params.append("reason", data.reason);
      params.append("amount", data.amount);

      if (editData) {
        // --- UPDATE LOGIC ---
        // Backend er @PutMapping parameter onujayi expenseBillId pathano hochhe
        params.append("expenseBillId", editData.expenseBillId);

        const response = await axios.put(
          "https://billify-backtend.onrender.com/updateexpensebill",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log(response.data);
        alert("Expense Bill Updated Successfully");

      } else {
        // --- CREATE LOGIC ---
        const response = await axios.post(
          "https://billify-backtend.onrender.com/expensebill",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log(response.data);
        alert("Expense Bill Added Successfully");
      }

      // Success er por form clear kore dewa holo
      setData({
        date: "",
        reason: "",
        amount: "",
      });

    } catch (err) {
      console.log(err.response?.data);
      console.log(err);
      
      alert(editData ? "Failed to Update Expense Bill" : "Failed to Add Expense Bill");
    }
  };

  return (
    <>
      <style>
        {`
          .expense-container{
            display:flex;
            justify-content:center;
            align-items:center;
            min-height:80vh;
          }

          .expense-card{
            width:100%;
            max-width:550px;
            padding:35px;
            border-radius:24px;
            background:rgba(255,255,255,0.05);
            backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,.1);
            box-shadow:0 20px 40px rgba(0,0,0,.3);
          }

          .expense-title{
            color:white;
            text-align:center;
            margin-bottom:25px;
            font-size:2rem;
          }

          .expense-input{
            width:100%;
            padding:15px;
            margin-bottom:18px;
            border:none;
            border-radius:12px;
            background:rgba(255,255,255,.08);
            color:white;
            font-size:1rem;
            outline:none;
          }

          .expense-input::placeholder{
            color:#cbd5e1;
          }

          .expense-input:focus{
            border:1px solid #60a5fa;
            box-shadow:0 0 12px rgba(96,165,250,.4);
          }

          .expense-btn{
            width:100%;
            padding:15px;
            border:none;
            border-radius:12px;
            cursor:pointer;
            color:white;
            font-size:1rem;
            font-weight:600;
            background:linear-gradient(135deg,#22c55e,#16a34a);
            transition:.3s;
          }

          .expense-btn:hover{
            transform:translateY(-2px);
          }
        `}
      </style>

      <div className="expense-container">
        <div className="expense-card">
          <h2 className="expense-title">
            {editData ? "📝 Update Expense Bill" : "💰 Create Expense Bill"}
          </h2>

          <input
            className="expense-input"
            type="date"
            value={data.date}
            onChange={(e) =>
              setData({
                ...data,
                date: e.target.value,
              })
            }
          />

          <input
            className="expense-input"
            type="text"
            placeholder="Expense Reason"
            value={data.reason}
            onChange={(e) =>
              setData({
                ...data,
                reason: e.target.value,
              })
            }
          />

          <input
            className="expense-input"
            type="number"
            placeholder="Amount"
            value={data.amount}
            onChange={(e) =>
              setData({
                ...data,
                amount: e.target.value,
              })
            }
          />

          <button className="expense-btn" onClick={saveExpense}>
            {editData ? "Update Expense Bill" : "Add Expense Bill"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ExpenseBillForm;