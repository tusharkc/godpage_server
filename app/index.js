require("dotenv-extended").config({ path: `./.env.${process.env.NODE_ENV}` });
const pg = require("pg");
const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("./config/config");
const app = express();
const registerRoutes = require("./utils/registerRoutes");
const corsWhiteList = require("./appConstants/corsWhiteList");
const sequelize = require("./db");
const cors = require("cors");

app.use(cors({ ...corsWhiteList }));
app.use(express.json());

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
async function startServer() {
  try {
    console.log("[DEBUG] Establishing DB connection");

    // Create database if it doesn't exist

    const dbName = config.database.database;

    const clientConnectionOptions = {
      user: config.database.username,
      password: config.database.password,
      host: config.database.host,
      database: "postgres",
      port: "5432",
    };

    if (process.env.NODE_ENV == "staging") {
      clientConnectionOptions.ssl = {
        rejectUnauthorized: false,
      };
    } else {
      clientConnectionOptions.ssl = false;
    }

    const client = new pg.Client(clientConnectionOptions);

    await client.connect();

    try {
      await client.query(`CREATE DATABASE ${dbName};`);
    } catch (error) {
      if (error.message !== 'database "' + dbName + '" already exists') {
        throw error;
      }
    }

    await client.end();

    const modelsDir = path.join(__dirname, "model");

    fs.readdirSync(modelsDir).forEach((file) => {
      if (file.endsWith("model.js")) {
        const model = require(path.join(modelsDir, file));
        model(sequelize);
      }
    });

    await sequelize.authenticate();
    console.log("[DEBUG] Established DB connection");

    // Synchronize models
    await sequelize.sync();

    // Register routes
    registerRoutes(app);

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("error:", error);
    process.exit(1);
  }
}

startServer();
