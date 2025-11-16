import { api } from "../services/api";
import { Button, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Helper function to generate synthetic, but realistic, data for SPEDIA compatibility
const generateSyntheticData = (action, userName) => {
  const isHighRisk = (action === "DELETE_RECORD" || action === "DOWNLOAD_DATA") && Math.random() < 0.6; 
  
  // Assign risk category based on score simulation
  let riskDescription;
  if (isHighRisk) {
      riskDescription = "High Risk - Potential Data Exfiltration/Unauthorized Access";
  } else if (Math.random() < 0.1) {
      riskDescription = "Medium Risk - Unusual Activity Pattern";
  } else {
      riskDescription = "Normal - Baseline User Activity";
  }

  // Simulated categorical values common in UEBA/SPEDIA datasets
  const users = [userName, "alice", "bob", "carl", "service_acct"]; 
  const activities = ["Web Browsing", "Email", "File Operation", "System Access", "Network"];
  const decoders = ["WebLog", "EmailServer", "FileSystem", "OS"];
  const agents = ["Chrome", "IE", "Outlook", "WindowsClient", "LinuxClient"];

  // Helper for generating random user email
  const getRandomEmail = (u) => `${u}_${Math.random().toString(36).substring(2, 6)}@company.com`;
  
  const userEmail = getRandomEmail(userName);
  const userTo = getRandomEmail(users[Math.floor(Math.random() * 3)]);

  const logData = {
    user: userName,
    action: action,
    resource: `/data/${Math.random().toString(36).substring(2, 8)}`,
    ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    risk_description: riskDescription, // RENAMED FIELD

    // SPEDIA-COMPATIBLE FIELDS
    agent_name: agents[Math.floor(Math.random() * agents.length)],
    decoder_name: decoders[Math.floor(Math.random() * decoders.length)],
    activity: activities[Math.floor(Math.random() * activities.length)],
    level: Math.floor(Math.random() * 5) + 1,
    size: Math.floor(Math.random() * 1000) + 100,
    
    // NEW EMAIL/URL FIELDS
    cc: (Math.random() < 0.1) ? getRandomEmail("external") : '',
    bcc: (Math.random() < 0.05) ? getRandomEmail("silent_cc") : '',
    to: (action.includes("REPORT") || action.includes("DATA")) ? userEmail : userTo,
    url: (action === "LOGIN" || action === "VIEW_REPORTS") ? `https://portal.company.com/page/${action.toLowerCase()}` : ''
  };
  
  // Ensure critical actions flag as high risk
  if (action === "DELETE_RECORD") {
      logData.user = userName; 
      logData.risk_description = "CRITICAL RISK - Unauthorized Deletion Attempt";
      logData.activity = "System Access";
  }
  
  return logData;
};

// Accept onLogGenerated prop and loggedInUser
export default function ActionButtons({ onLogGenerated, loggedInUser }) {
  const simulate = async (action) => {
    // Prevent actions if user is not logged in (handled by App.jsx now, but good practice)
    if (!loggedInUser) return;
    
    try {
      const logData = generateSyntheticData(action, loggedInUser);
      
      // Post all fields
      await api.post("/logs/generate", logData);
      console.log(`Log generated for action: ${action}`, logData);
      
      onLogGenerated(action, true); // Call success callback
    } catch (error) {
      console.error("Error generating log:", error);
      onLogGenerated(action, false); // Call failure callback
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ my: 2 }}>
      <Button 
        variant="contained" 
        endIcon={<SendIcon />} 
        onClick={() => simulate("LOGIN")}>
        Simulate Login
      </Button>
      <Button 
        variant="outlined" 
        color="secondary"
        onClick={() => simulate("VIEW_REPORTS")}>
        View Reports
      </Button>
      <Button 
        variant="outlined" 
        color="info"
        onClick={() => simulate("DOWNLOAD_DATA")}>
        Download Data
      </Button>
      <Button 
        variant="contained" 
        color="error" 
        onClick={() => simulate("DELETE_RECORD")}>
        Delete Record (High Risk)
      </Button>
    </Stack>
  );
}