import { useState, useEffect } from "react";
import axios from "axios";

function TravelBillForm({ user, editData }) {
  const [data, setData] = useState({
    date: "",
    fromLocation: "",
    toLocation: "",
    amount: "",
  });

  // Jokhon page load hobe ba editData asbe, form auto-fill hobe
  useEffect(() => {
    if (editData) {
      const formattedDate = new Date(editData.date).toISOString().split("T")[0];
      setData({
        date: formattedDate,
        fromLocation: editData.fromLocation,
        toLocation: editData.toLocation,
        amount: editData.amount,
      });
    } else {
      setData({
        date: "",
        fromLocation: "",
        toLocation: "",
        amount: "",
      });
    }
  }, [editData]);

  const saveBill = async () => {
    try {
      const params = new URLSearchParams();

      params.append("userId", user.userId);
      params.append("date", data.date);
      params.append("fromLocation", data.fromLocation);
      params.append("toLocation", data.toLocation);
      params.append("amount", data.amount);

      if (editData) {
        // --- UPDATE LOGIC ---
        params.append("travelBillId", editData.travelBillId);

        const response = await axios.put(
          "http://localhost:6296/updatetravelbill",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log(response.data);
        alert("Travel Bill Updated Successfully");
      } else {
        // --- CREATE LOGIC ---
        const response = await axios.post(
          "http://localhost:6296/addtravelbill",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log(response.data);
        alert("Travel Bill Added Successfully");
      }

      // Success er por form clear kora
      setData({
        date: "",
        fromLocation: "",
        toLocation: "",
        amount: "",
      });
    } catch (err) {
      console.log(err.response?.data);
      console.log(err);

      alert(editData ? "Failed to Update Travel Bill" : "Failed to Add Travel Bill");
    }
  };

  return (
    <>
      <style>
        {`
          .travel-container{
            display:flex;
            justify-content:center;
            align-items:center;
            min-height:80vh;
          }

          .travel-card{
            width:100%;
            max-width:550px;
            padding:35px;
            border-radius:24px;
            background:rgba(255,255,255,0.05);
            backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,0.1);
            box-shadow:0 20px 40px rgba(0,0,0,0.3);
          }

          .travel-title{
            color:white;
            text-align:center;
            margin-bottom:25px;
            font-size:2rem;
          }

          .travel-input{
            width:100%;
            padding:15px;
            margin-bottom:18px;
            border:none;
            border-radius:12px;
            background:rgba(255,255,255,0.08);
            color:white;
            font-size:1rem;
            outline:none;
          }

          .travel-input::placeholder{
            color:#cbd5e1;
          }

          .travel-input:focus{
            border:1px solid #60a5fa;
            box-shadow:0 0 12px rgba(96,165,250,.4);
          }

          .travel-btn{
            width:100%;
            padding:15px;
            border:none;
            border-radius:12px;
            cursor:pointer;
            color:white;
            font-size:1rem;
            font-weight:600;
            background:linear-gradient(135deg,#3b82f6,#8b5cf6);
            transition:.3s;
          }

          .travel-btn:hover{
            transform:translateY(-2px);
          }
        `}
      </style>

      <div className="travel-container">
        <div className="travel-card">
          <h2 className="travel-title">
            {editData ? "📝 Update Travel Bill" : "✈️ Create Travel Bill"}
          </h2>

          <input
            className="travel-input"
            type="date"
            value={data.date}
            onChange={(e) =>
              setData({ ...data, date: e.target.value })
            }
          />

          <input
            className="travel-input"
            type="text"
            placeholder="From Location"
            value={data.fromLocation}
            onChange={(e) =>
              setData({ ...data, fromLocation: e.target.value })
            }
          />

          <input
            className="travel-input"
            type="text"
            placeholder="To Location"
            value={data.toLocation}
            onChange={(e) =>
              setData({ ...data, toLocation: e.target.value })
            }
          />

          <input
            className="travel-input"
            type="number"
            placeholder="Amount"
            value={data.amount}
            onChange={(e) =>
              setData({ ...data, amount: e.target.value })
            }
          />

          <button className="travel-btn" onClick={saveBill}>
            {editData ? "Update Travel Bill" : "Add Travel Bill"}
          </button>
        </div>
      </div>
    </>
  );
}

export default TravelBillForm;