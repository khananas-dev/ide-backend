const os = require("os");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const baseFolder = path.join(os.homedir(), "Desktop/Projects/ide/ide-storage");
const db = require("../models");
const User = db.user;

// Tree view folder structure generate
function generateTreeView(dir, basePath = "") {
  const tree = [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const childTree = generateTreeView(filePath, path.join(basePath, file));
      tree.push({
        id: uuidv4(),
        name: file,
        type: "directory",
        path: path.join(basePath, file),
        children: childTree,
      });
    } else {
      tree.push({
        id: uuidv4(),
        name: file,
        type: "file",
        path: path.join(basePath, file),
      });
    }
  });

  return tree;
}
function getDirectories(dirPath, arrayOfDirs, basePath = "") {
  const files = fs.readdirSync(dirPath);
  arrayOfDirs = arrayOfDirs || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfDirs.push({ path: path.join(basePath, file) });
      arrayOfDirs = getDirectories(
        dirPath + "/" + file,
        arrayOfDirs,
        path.join(basePath, file)
      );
    }
  });

  return arrayOfDirs;
}

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

// Get user detail by Id
exports.userDetailById = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(userData);
  User.findOne({
    _id: userData?.userId,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      try {
        res.send({
          status: "success",
          data: {
            userId: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            username: user?.username,
            // workspace: generateTreeView(`${baseFolder}/${user.username}`),
          },
        });
      } catch (error) {
        res.status(500).send({
          message:
            error.message ||
            "Some error occurred while retrieving directory and file.",
        });
      }
    } else {
      res.status(401).send({ errorMsg: "No user found by the give id." });
      return;
    }
  });
};
exports.usersWorkspace = async (req, res) => {
  let id = req.params.id;
  User.findOne({
    _id: id,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      try {
        res.send({
          status: "success",
          data: generateTreeView(`${baseFolder}/${user.username}`),
        });
      } catch (error) {
        res.status(500).send({
          message:
            error.message ||
            "Some error occurred while retrieving directory and file.",
        });
      }
    } else {
      res.status(401).send({ errorMsg: "No user found by the give id." });
      return;
    }
  });
};
exports.folderList = async (req, res) => {
  let id = req.params.id;
  User.findOne({
    _id: id,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      try {
        res.send({
          status: "success",
          data: getDirectories(`${baseFolder}/${user.username}`),
        });
      } catch (error) {
        res.status(500).send({
          message:
            error.message ||
            "Some error occurred while retrieving directory and file.",
        });
      }
    } else {
      res.status(401).send({ errorMsg: "No user found by the give id." });
      return;
    }
  });
};
