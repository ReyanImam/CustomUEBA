import { api } from "../services/api";

export default function ActionButtons() {
  const simulate = async (action) => {
    await api.post("/logs/generate", {
      user: "UserA",
      action,
      resource: "Dashboard",
      ip: "192.168.1.10",
      risk_score: Math.floor(Math.random() * 90)
    });
    alert("Log generated!");
  };

  return (
    <div>
      <button onClick={() => simulate("LOGIN")}>Login</button>
      <button onClick={() => simulate("VIEW_REPORTS")}>View Reports</button>
      <button onClick={() => simulate("DOWNLOAD_DATA")}>Download Data</button>
      <button onClick={() => simulate("DELETE_RECORD")}>Delete Record</button>
    </div>
  );
}
