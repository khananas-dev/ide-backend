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
  // create Folder
  app.post("/api/createFolder", [authJwt.verifyToken], controller.createFolder);
  // delete File
  app.put("/api/deleteFile", [authJwt.verifyToken], controller.deleteFile);
  // delete Folder
  app.put("/api/deleteFolder", [authJwt.verifyToken], controller.deleteFolder);
  // rename Folder
  app.put("/api/renameFolder", [authJwt.verifyToken], controller.renameFolder);
  // rename File
  app.put("/api/renameFile", [authJwt.verifyToken], controller.renameFile);
  // get data
  app.post("/api/getFileData", [authJwt.verifyToken], controller.getFileData);
  // save data
  app.put("/api/saveFileData", [authJwt.verifyToken], controller.saveFileData);
  // terminal
  app.put("/api/terminal", [authJwt.verifyToken], controller.terminal);

  // get user workspace
  // app.get(
  //   "/api/usersWorkspace/:id",
  //   [authJwt.verifyToken],
  //   controller.usersWorkspace
  // );
  // app.get("/api/folderList/:id", [authJwt.verifyToken], controller.folderList);
};
