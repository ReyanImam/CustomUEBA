export function downloadCSV(data) {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Define column headers, matching the Python script feature list as closely as possible
  const headers = [
    "User", "Action", "Activity", "Resource", "IP", 
    "Agent_name", "Decoder_name", "Level", "Size", 
    "cc", "bcc", "to", "url", 
    "Risk_description", "Timestamp" // Renamed column
  ];
  
  // Helper function to safely extract and format the data field
  const formatField = (value) => {
      // Handle null/undefined/empty string
      if (value === null || value === undefined) return '';
      // Simple escape double quotes for CSV safety and wrap in double quotes
      const strValue = String(value);
      return `"${strValue.replace(/"/g, '""')}"`;
  };

  const csvRows = data.map(row => headers.map(header => {
    // Note: 'to' is a reserved word in SQL, but accessible as an object key in JS
    const key = header.toLowerCase() === 'risk_description' ? 'risk_description' : 
                header.toLowerCase() === 'agent_name' ? 'agent_name' : 
                header.toLowerCase() === 'decoder_name' ? 'decoder_name' : 
                header.toLowerCase() === 'activity' ? 'activity' : 
                header.toLowerCase() === 'level' ? 'level' : 
                header.toLowerCase() === 'size' ? 'size' : 
                header.toLowerCase() === 'to' ? 'to' : 
                header.toLowerCase() === 'cc' ? 'cc' : 
                header.toLowerCase() === 'bcc' ? 'bcc' : 
                header.toLowerCase() === 'url' ? 'url' : 
                header.toLowerCase() === 'resource' ? 'resource' :
                header.toLowerCase() === 'ip' ? 'ip' :
                header.toLowerCase() === 'user' ? 'user' :
                header.toLowerCase() === 'action' ? 'action' :
                header.toLowerCase() === 'timestamp' ? 'timestamp' : ''; // Default empty

    return formatField(row[key]);
  }).join(','));
  
  // Add headers row
  const headerRow = headers.map(h => formatField(h)).join(',');
  csvRows.unshift(headerRow);
  
  const csvArray = csvRows.join('\r\n');

  const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "ueba_logs_spedia_format.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}