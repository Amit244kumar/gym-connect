import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  registerGymOwner,
  loginGymOwner,
  registerMember,
  loginMember,
  getOwnerDashboard,
  recordEntry,
} from "./routes/gym";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Gym Management API routes
  app.post("/api/gym/owner/register", registerGymOwner);
  app.post("/api/gym/owner/login", loginGymOwner);
  app.post("/api/gym/member/register", registerMember);
  app.post("/api/gym/member/login", loginMember);
  app.get("/api/gym/owner/dashboard", getOwnerDashboard);
  app.post("/api/gym/entry", recordEntry);

  return app;
}
