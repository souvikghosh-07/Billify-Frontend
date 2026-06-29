import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadBill({ user }) {
  const [billType, setBillType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const downloadBill = async () => {
    if (billType === "") {
      alert("Select Bill Type");
      return;
    }

    if (dateFrom === "" || dateTo === "") {
      alert("Select Date Range");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("userId", user.userId); // Backend e pathanor jonyo id tai rakhlam
      params.append("dateFrom", dateFrom);
      params.append("dateTo", dateTo);

      const url =
        billType === "travel"
          ? "http://localhost:6296/downloadtravelbill"
          : "http://localhost:6296/downloadexpensebill";

      const response = await axios.post(url, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const bills = response.data;

      if (bills.length === 0) {
        alert("No Bills Found in this date range");
        return;
      }

      // Calculate Total Amount
      const totalAmount = bills.reduce(
        (sum, bill) => sum + Number(bill.amount),
        0
      );

      // Date Formatter Helper (Formats like: 23 Jun, 2026)
      const formatPrettyDate = (d) => {
        return new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      // --- MODERN PDF STYLING STARTS HERE ---
      const pdf = new jsPDF();

      // 1. Top Header Background (Dark Slate color)
      pdf.setFillColor(30, 41, 59);
      pdf.rect(0, 0, 210, 32, "F");

      // 2. Main Title (White text inside the header)
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        billType === "travel"
          ? "Travel Expense Report"
          : "General Expense Report",
        14,
        21
      );

      // 3. User Details & Dates 
      pdf.setFontSize(11);
      
      // Left side details (Name & Period)
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Employee Name:", 14, 45);
      pdf.text("Reporting Period:", 14, 52);
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(30, 30, 30);
      pdf.text(`${user.userName || "N/A"}`, 48, 45);
      pdf.text(`${formatPrettyDate(dateFrom)}  To  ${formatPrettyDate(dateTo)}`, 48, 52);

      // Right side details (Generated On)
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Generated On:", 140, 45);
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(30, 30, 30);
      pdf.text(`${formatPrettyDate(new Date())}`, 170, 45);

      // Divider Line
      pdf.setDrawColor(220, 220, 220);
      pdf.line(14, 58, 196, 58);

      // 4. Modern Table Styling Configuration
      const tableStyles = {
        startY: 65,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246], // Bright Blue Header
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: 50,
          halign: "center",
          valign: "middle",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Light grey-blue alternate rows
        },
        margin: { top: 60, bottom: 20 },
      };

      // 5. Generate Table Data
      if (billType === "travel") {
        autoTable(pdf, {
          ...tableStyles,
          head: [["Date", "From Location", "To Location", "Amount"]],
          body: bills.map((bill) => [
            formatPrettyDate(bill.date),
            bill.fromLocation,
            bill.toLocation,
            "Rs. " + bill.amount,
          ]),
        });
      } else {
        autoTable(pdf, {
          ...tableStyles,
          head: [["Date", "Expense Reason", "Amount"]],
          body: bills.map((bill) => [
            formatPrettyDate(bill.date),
            bill.reason,
            "Rs. " + bill.amount,
          ]),
        });
      }

      // 6. Total Amount Styling at the End
      const finalY = pdf.lastAutoTable.finalY; // Gets the Y position where table ends
      
      // Total Box Background
      pdf.setFillColor(241, 245, 249); 
      pdf.rect(120, finalY + 10, 76, 14, "F"); 
      
      // Total Text Label
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(71, 85, 105);
      pdf.text("Total Amount:", 125, finalY + 19);
      
      // Total Amount Value (Green color for emphasis)
      pdf.setTextColor(22, 163, 74); 
      pdf.text(`Rs. ${totalAmount}`, 190, finalY + 19, { align: "right" });

      // 7. Save PDF
      pdf.save(
        billType === "travel" ? "Travel_Report.pdf" : "Expense_Report.pdf"
      );
    } catch (err) {
      console.log(err);
      alert("Download Failed. Please check console.");
    }
  };

  return (
    <>
      <style>
        {`
          .download-container{
            display:flex;
            justify-content:center;
            align-items:center;
            min-height:80vh;
          }

          .download-card{
            width:100%;
            max-width:650px;
            padding:35px;
            border-radius:24px;
            background:rgba(255,255,255,.05);
            backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,.1);
            box-shadow:0 20px 40px rgba(0,0,0,.3);
          }

          .download-title{
            text-align:center;
            color:white;
            margin-bottom:30px;
            font-size:2rem;
          }

          .type-buttons{
            display:flex;
            gap:20px;
            margin-bottom:25px;
          }

          .type-btn{
            flex:1;
            padding:15px;
            border:none;
            border-radius:12px;
            cursor:pointer;
            font-size:16px;
            font-weight:600;
            color:white;
            background:#1e293b;
            transition:.3s;
          }

          .type-btn:hover{
            background:#334155;
          }

          .active{
            background:linear-gradient(
              135deg,
              #3b82f6,
              #8b5cf6
            );
          }

          .download-input{
            width:100%;
            padding:15px;
            margin-bottom:20px;
            border:none;
            border-radius:12px;
            background:rgba(255,255,255,.08);
            color:white;
            font-size:16px;
            outline:none;
          }

          .download-input::-webkit-calendar-picker-indicator {
            filter: invert(1);
          }

          .download-input:focus{
            border:1px solid #60a5fa;
            box-shadow:0 0 10px rgba(96,165,250,.4);
          }

          .download-btn{
            width:100%;
            padding:15px;
            border:none;
            border-radius:12px;
            cursor:pointer;
            font-size:17px;
            font-weight:600;
            color:white;
            background:linear-gradient(
              135deg,
              #22c55e,
              #16a34a
            );
            transition:.3s;
          }

          .download-btn:hover{
            transform:translateY(-2px);
          }
        `}
      </style>

      <div className="download-container">
        <div className="download-card">
          <h2 className="download-title">📄 Download Bills</h2>

          <div className="type-buttons">
            <button
              className={
                billType === "travel" ? "type-btn active" : "type-btn"
              }
              onClick={() => setBillType("travel")}
            >
              ✈️ Travel Bill
            </button>

            <button
              className={
                billType === "expense" ? "type-btn active" : "type-btn"
              }
              onClick={() => setBillType("expense")}
            >
              💰 Expense Bill
            </button>
          </div>

          <input
            className="download-input"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <input
            className="download-input"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />

          <button className="download-btn" onClick={downloadBill}>
            Download Professional PDF
          </button>
        </div>
      </div>
    </>
  );
}

export default DownloadBill;