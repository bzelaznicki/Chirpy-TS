import express from "express";
import path from "path";
import { handlerReadiness } from "./handlers/handler_readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./middleware.js";
import { handlerMetrics, handlerReset } from "./handlers/handler_metrics.js";
import { handlerValidateChirp } from "./handlers/handler_validate_chirp.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());


app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz",  async (req, res, next) => {
  try {
    await handlerReadiness(req, res);
  } catch (err) {
    next(err); 
  }
});
app.get("/admin/metrics",  async (req, res, next) => {
  try {
    await handlerMetrics(req, res);
  } catch (err) {
    next(err); 
  }
});
app.post("/admin/reset",  async (req, res, next) => {
  try {
    await handlerReset(req, res);
  } catch (err) {
    next(err); 
  }
});
app.post("/api/validate_chirp", async (req, res, next) => {
  try {
    await handlerValidateChirp(req, res);
  } catch (err) {
    next(err); 
  }
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });