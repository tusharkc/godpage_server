const glob = require("glob");
const path = require("path");
const express = require("express");

function registerRoutes(app) {
  const apiRouter = express.Router();

  const routesPath = path.join(__dirname, ".", "module", "**");
  const routesFiles = glob.sync(routesPath, { absolute: true });

  routesFiles
    .filter((file) => file.endsWith("routes.js"))
    .forEach((file) => {
      const routes = require(file);
      const moduleRoutes = routes.stack;

      moduleRoutes.forEach((route) => {
        console.info(
          "\x1b[35m",
          "[Info] Registering API ROUTE :-",
          route.route.path,
          "\x1b[0m"
        );
      });

      apiRouter.use("/", routes);
    });

  app.use("/api", apiRouter);
}

module.exports = registerRoutes;
