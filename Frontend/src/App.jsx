import ActionButtons from "./components/ActionButtons";
import { api } from "./services/api";
import { useState } from "react";

export default function App() {
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    const res = await api.get("/logs");
    setLogs(res.data);
  };

  return (
    <div>
      <h1>UEBA Log Simulator</h1>
      <ActionButtons />

      <hr/>
      <button onClick={loadLogs}>Load Logs</button>

      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Resource</th>
            <th>IP</th>
            <th>Risk</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.user}</td>
              <td>{l.action}</td>
              <td>{l.resource}</td>
              <td>{l.ip}</td>
              <td>{l.risk_score}</td>
              <td>{l.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
