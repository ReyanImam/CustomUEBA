import express from "express";
import cors from "cors";
import logsRoutes from "./routes/logsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/logs", logsRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));
