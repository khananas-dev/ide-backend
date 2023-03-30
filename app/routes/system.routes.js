const { authJwt } = require("../middlewares");
const controller = require("../controllers/system.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // create File
  app.post("/api/createFile", [authJwt.verifyToken], controller.createFile);
  // create folder
  app.post("/api/createFolder", [authJwt.verifyToken], controller.createFolder);
  // get user workspace
  // app.get(
  //   "/api/usersWorkspace/:id",
  //   [authJwt.verifyToken],
  //   controller.usersWorkspace
  // );
  // app.get("/api/folderList/:id", [authJwt.verifyToken], controller.folderList);
};
