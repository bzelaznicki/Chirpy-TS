import express from "express";
import path from "path";
import { handlerReadiness } from "./handlers/handler_readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerMetrics, handlerReset } from "./handlers/handler_metrics.js";
import { handlerValidateChirp } from "./handlers/handler_validate_chirp.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });