import express from "express";
import path from "path";
import { handlerReadiness } from "./handlers/handler_readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { errorHandler } from "./error_middleware.js";
import { handlerMetrics, handlerReset } from "./handlers/handler_metrics.js";
import { handlerPostChirp } from "./handlers/handler_post_chirp.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser, handlerLogin, handlerUpdateUser } from "./handlers/handler_user.js";
import { handlerGetChirps, handlerGetSingleChirp } from "./handlers/handler_get_chirps.js";
import { handlerRefresh, handlerRevokeToken } from "./handlers/handler_tokens.js";
import { handlerDeleteChirp } from "./handlers/handler_delete_chirp.js";
import { handlerWebhookPolka } from "./handlers/handler_webhook_polka.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);


const app = express();


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
app.post("/api/chirps", async (req, res, next) => {
  try {
    await handlerPostChirp(req, res);
  } catch (err) {
    next(err); 
  }
});
app.get("/api/chirps", async (req, res, next) => {
  try {
    await handlerGetChirps(req, res);
  } catch (err) {
    next(err); 
  }
});
app.get("/api/chirps/:chirpId", async (req, res, next) => {
  try {
    await handlerGetSingleChirp(req, res);
  } catch (err) {
    next(err); 
  }
});
app.delete("/api/chirps/:chirpId", async (req, res, next) => {
  try {
    await handlerDeleteChirp(req, res);
  } catch (err) {
    next(err); 
  }
});
app.post("/api/users", async (req, res, next) => {
  try {
    await handlerCreateUser(req, res);
  } catch (err) {
    next(err); 
  }
});
app.put("/api/users", async (req, res, next) => {
  try {
    await handlerUpdateUser(req, res);
  } catch (err) {
    next(err); 
  }
});
app.post("/api/login", async (req, res, next) => {
  try {
    await handlerLogin(req, res);
  } catch (err) {
    next(err); 
  }
});
app.post("/api/revoke", async (req, res, next) => {
  try {
    await handlerRevokeToken(req, res);
  } catch (err) {
    next(err); 
  }
});

app.post("/api/refresh", async (req, res, next) => {
  try {
    await handlerRefresh(req, res);
  } catch (err) {
    next(err); 
  }
});

app.post("/api/polka/webhooks", async (req, res, next) => {
  try {
    await handlerWebhookPolka(req, res);
  } catch (err) {
    next(err); 
  }
});


app.use(errorHandler);
app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
  });