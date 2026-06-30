import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadBill({ user }) {
  const [billType, setBillType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ajker date ta ber kore YYYY-MM-DD format e anar jonno (Future date disable korar jonyo)
  const today = new Date().toISOString().split("T")[0];

  const downloadBill = async () => {
    if (billType === "") {
      alert("Select Bill Type");
      return;
    }

    if (dateFrom === "" || dateTo === "") {
      alert("Select Date Range");
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("userId", user.userId);
      params.append("dateFrom", dateFrom);
      params.append("dateTo", dateTo);

      const url =
        billType === "travel"
          ? "https://billify-backtend.onrender.com/downloadtravelbill"
          : "https://billify-backtend.onrender.com/downloadexpensebill";

      const response = await axios.post(url, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      let bills = response.data;

      if (bills.length === 0) {
        alert("No Bills Found in this date range");
        setIsLoading(false);
        return;
      }

      // --- SORTING LOGIC ---
      // Date onujayi oldest to newest sort kora hochhe
      bills.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Calculate Total Amount
      const totalAmount = bills.reduce(
        (sum, bill) => sum + Number(bill.amount),
        0
      );

      // Date Formatter Helper
      const formatPrettyDate = (d) => {
        return new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      // --- FETCH COMPANY DETAILS FROM LOCAL STORAGE ---
      const companyDataStr = localStorage.getItem("companyDetails");
      const company = companyDataStr ? JSON.parse(companyDataStr) : null;

      // ==========================================
      // --- PREMIUM MODERN PDF GENERATION ---
      // ==========================================
      const pdf = new jsPDF();

      // 1. TOP HEADER BANNER (Dark Blue)
      pdf.setFillColor(15, 23, 42); // Very dark slate/blue
      pdf.rect(0, 0, 210, 35, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(255, 255, 255);
      
      const reportTitle = billType === "travel" ? "TRAVEL EXPENSE REPORT" : "GENERAL EXPENSE REPORT";
      pdf.text(reportTitle, 105, 22, { align: "center" });

      // 2. COLORED METADATA CARDS (Company & Employee)
      // Left Card: Company Details
      pdf.setFillColor(241, 245, 249); // Light Grey-Blue background
      pdf.roundedRect(14, 42, 88, 35, 3, 3, "F");

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(59, 130, 246); // Blue Accent
      pdf.text("COMPANY DETAILS", 18, 50);

      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(company?.companyName || "N/A", 18, 57);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      
      // Auto-wrap address if it's too long
      const addressLines = pdf.splitTextToSize(company?.address || "Address not provided", 80);
      pdf.text(addressLines, 18, 63);
      pdf.text(`Ph: ${company?.phNo || "N/A"}`, 18, 63 + (addressLines.length * 4));


      // Right Card: Employee & Bill Details
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(108, 42, 88, 35, 3, 3, "F");

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(59, 130, 246); // Blue Accent
      pdf.text("EMPLOYEE & REPORT DETAILS", 112, 50);

      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(user?.userName || "N/A", 112, 57);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Period: ${formatPrettyDate(dateFrom)} to ${formatPrettyDate(dateTo)}`, 112, 63);
      pdf.text(`Generated: ${formatPrettyDate(new Date())}`, 112, 68);
      pdf.text(`Status: Submitted`, 112, 73);

      // 3. TABLE DATA PROCESSING (WITH DATE GROUPING)
      let lastDate = "";
      const tableBody = bills.map((bill) => {
        const formattedDate = formatPrettyDate(bill.date);
        
        // Date Grouping Logic: Same date bar bar print hobe na
        let displayDate = formattedDate;
        if (formattedDate === lastDate) {
          displayDate = ""; // Faka kore dilam jodi aager datar sathe same hoy
        } else {
          lastDate = formattedDate;
        }

        const particulars = billType === "travel" 
          ? `Route: ${bill.fromLocation} to ${bill.toLocation}`
          : `Reason: ${bill.reason}`;

        return [
          displayDate,
          particulars,
          `Rs. ${bill.amount}`
        ];
      });

      // 4. AUTO-TABLE GENERATION
      autoTable(pdf, {
        startY: 85,
        theme: "grid",
        head: [["Date", "Particulars", "Amount"]],
        body: tableBody,
        headStyles: {
          fillColor: [59, 130, 246], // Modern Blue Header
          textColor: 255,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          fontSize: 10,
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "bold", textColor: [30, 41, 59] }, // Date column
          1: { cellWidth: "auto" }, // Particulars column
          2: { cellWidth: 40, fontStyle: "bold", halign: "right" }, // Amount column
        },
        alternateRowStyles: {
          fillColor: [250, 252, 255], // Very slight blue tint for alternate rows
        },
        styles: {
          cellPadding: 6,
          lineColor: [226, 232, 240], // Light grey borders
          lineWidth: 0.1,
        }
      });

      // 5. TOTAL AMOUNT SECTION
      const finalY = pdf.lastAutoTable.finalY;
      
      pdf.setFillColor(241, 245, 249); // Same light grey-blue background
      pdf.rect(130, finalY + 5, 66, 12, "F"); 
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 41, 59);
      pdf.text("Total Amount:", 135, finalY + 13);
      
      pdf.setTextColor(22, 163, 74); // Green color for total money
      pdf.text(`Rs. ${totalAmount}`, 190, finalY + 13, { align: "right" });

      // 6. SAVE PDF
      pdf.save(
        billType === "travel" ? "Travel_Claim_Report.pdf" : "Expense_Claim_Report.pdf"
      );
    } catch (err) {
      console.log(err);
      alert("Download Failed. Please check console.");
    } finally {
      setIsLoading(false);
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

          .download-btn:hover:not(:disabled){
            transform:translateY(-2px);
          }

          .download-btn:disabled{
            opacity: 0.7;
            cursor: not-allowed;
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
            max={today}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <input
            className="download-input"
            type="date"
            max={today}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />

          <button 
            className="download-btn" 
            onClick={downloadBill}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Download Claim Report"}
          </button>
        </div>
      </div>
    </>
  );
}

export default DownloadBill;