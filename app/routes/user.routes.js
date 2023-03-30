const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // get user details by id
  app.get("/api/usersById", [authJwt.verifyToken], controller.userDetailById);
  // get user workspace
  app.get(
    "/api/usersWorkspace/:id",
    [authJwt.verifyToken],
    controller.usersWorkspace
  );
  app.get("/api/folderList/:id", [authJwt.verifyToken], controller.folderList);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
