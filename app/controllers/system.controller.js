const os = require("os");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const baseFolder = path.join(os.homedir(), "Documents/ide-storage");
const db = require("../models");
const User = db.user;

// Create File
exports.createFile = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  if (userData) {
    try {
      let newFile =
        req?.body?.path !== " "
          ? `${baseFolder}/${userData.username}/${req?.body?.path}/${req?.body?.fileName}`
          : `${baseFolder}/${userData.username}/${req?.body?.fileName}`;
      fs.writeFile(newFile, "", function (err) {
        if (err) {
          res.send({
            status: "error",
            message: "There is some issue while create the file",
            error: err,
            data: null,
          });
          return console.log(err);
        }
        res.send({
          status: "success",
          message: "The File has been created successfully.",
          data: null,
        });
        console.log("The file was saved!");
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
};
exports.createFolder = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(req?.body);
  if (userData) {
    try {
      let newFolder =
        req?.body?.path !== " "
          ? `${baseFolder}/${userData.username}/${req?.body?.path}/${req?.body?.folderName}`
          : `${baseFolder}/${userData.username}/${req?.body?.folderName}`;
      if (!fs.existsSync(newFolder)) {
        fs.mkdir(newFolder, function (err) {
          if (err) {
            res.send({
              status: "error",
              message: "There is some issue while create the folder",
              error: err,
              data: null,
            });
            return console.log(err);
          }
          res.send({
            status: "success",
            message: "The Folder has been created successfully.",
            data: null,
          });
          console.log("The file was saved!");
        });
      } else {
        res.send({
          status: "error",
          message: "The Folder already exists",
          data: null,
        });
      }
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
};
