// index.js
import express from "express";
import userRoutes from "./routes/users.route";
import accountsRoutes from "./routes/accounts.route";
import logger from "./config/logger";

const app = express();
const port = 3000;

// Request logging middleware
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info(`${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next();
  }
);

app.use(express.json());

// Define a simple route
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello from Express and Prisma!");
});

// Use user routes
app.use("/user", userRoutes);
// Use accounts routes
app.use("/accounts", accountsRoutes);

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
