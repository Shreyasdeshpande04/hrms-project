import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportData = (rawData, fileName, format) => {
  if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
    alert("No data available to export");
    return;
  }

  let finalData = [];

  // 1. SMART ADAPTIVE FLATTENER
  // This logic checks the data structure and creates columns that match YOUR screen
  const arr = Array.isArray(rawData) ? rawData : [rawData];

  finalData = arr.map((item, index) => {
    const row = { "SR NO": index + 1 };

    // PAGE DETECTION LOGIC
    if (item.activeJobs !== undefined) { 
        // We are on the ANALYTICS Page
        return {
            "Metric Name": "Active Jobs", "Value": item.activeJobs,
            "Metric Name ": "Total Applicants", "Value ": item.totalApplications,
            "Metric Name  ": "Total Hires", "Value  ": item.hires
        };
    } else if (item.candidateId && item.currentStage) {
        // We are on PIPELINE or INTERVIEWS Page
        row["CANDIDATE"] = item.candidateId?.name || "N/A";
        row["EMAIL"] = item.candidateId?.email || "N/A";
        row["JOB ROLE"] = item.jobId?.title || "N/A";
        row["CURRENT STATUS"] = item.currentStage || "N/A";
        row["APPLIED DATE"] = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A";
    } else if (item.title && item.departmentId) {
        // We are on JOB OPENINGS Page
        row["JOB TITLE"] = item.title;
        row["DEPARTMENT"] = item.departmentId?.name || "General";
        row["LOCATION"] = item.location;
        row["SALARY"] = item.salary;
        row["WORK TYPE"] = item.workType;
    } else {
        // Fallback for Admin/Other Users
        row["NAME"] = item.name || "N/A";
        row["EMAIL"] = item.email || "N/A";
        row["ROLE"] = item.role || "N/A";
    }
    return row;
  });

  // 2. EXPORT EXECUTION
  const cleanFileName = fileName.replace(/_/g, ' ');

  if (format === 'excel' || format === 'csvz') {
    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.${format === 'excel' ? 'xlsx' : 'csv'}`);
  } 
  else if (format === 'pdf') {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(cleanFileName.toUpperCase(), 14, 22);
    
    // AutoTable Logic
    const headers = [Object.keys(finalData[0])];
    const body = finalData.map(obj => Object.values(obj));

    doc.autoTable({
      head: headers,
      body: body,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 11, halign: 'center' },
      columnStyles: { 0: { cellWidth: 20, halign: 'center' } },
      styles: { fontSize: 10, cellPadding: 5 }
    });
    doc.save(`${fileName}.pdf`);
  }
};