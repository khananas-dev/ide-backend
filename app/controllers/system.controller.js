const os = require("os");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const baseFolder = path.join(os.homedir(), "Documents/ide-storage");
const db = require("../models");
const User = db.user;
const { spawn } = require("child_process");

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
exports.deleteFile = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(req?.body);
  if (userData) {
    try {
      let newFile = `${baseFolder}/${userData.username}/${req?.body?.path}`;
      fs.unlink(newFile, function (err) {
        if (err) {
          res.send({
            status: "error",
            message: "There is some issue while deleting the file",
            error: err,
            data: null,
          });
          return console.log(err);
        }
        res.send({
          status: "success",
          message: "The file has been deleted successfully.",
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
exports.deleteFolder = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(req?.body);
  if (userData) {
    try {
      let newFolder = `${baseFolder}/${userData.username}/${req?.body?.path}`;
      fs.rmdir(newFolder, { recursive: true }, function (err) {
        if (err) {
          res.send({
            status: "error",
            message: "There is some issue while deleting the folder",
            error: err,
            data: null,
          });
          return console.log(err);
        }
        res.send({
          status: "success",
          message: "The Folder has been deleted successfully.",
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
exports.renameFolder = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(req?.body);
  if (userData) {
    try {
      let newFolderName = `${baseFolder}/${userData.username}/${req?.body?.newPath}`;
      let oldFolderName = `${baseFolder}/${userData.username}/${req?.body?.oldPath}`;
      fs.rename(oldFolderName, newFolderName, function (err) {
        if (err) {
          res.send({
            status: "error",
            message: "There is some issue while renaming the folder",
            error: err,
            data: null,
          });
          return console.log(err);
        }
        res.send({
          status: "success",
          message: "The Folder has been renamed successfully.",
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
exports.renameFile = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(req?.body);
  if (userData) {
    try {
      let newFileName = `${baseFolder}/${userData.username}/${req?.body?.newPath}`;
      let oldFileName = `${baseFolder}/${userData.username}/${req?.body?.oldPath}`;
      fs.rename(oldFileName, newFileName, function (err) {
        if (err) {
          res.send({
            status: "error",
            message: "There is some issue while renaming the File",
            error: err,
            data: null,
          });
          return console.log(err);
        }
        res.send({
          status: "success",
          message: "The File has been renamed successfully.",
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
exports.getFileData = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(req?.body);
  if (userData) {
    try {
      let filePath = path.join(
        "",
        `${baseFolder}/${userData.username}/${req?.body?.path}`
      );
      console.log(filePath);
      fs.readFile(filePath, "utf8", function (err, data) {
        if (err) {
          res.send({
            status: "error",
            message: "There is some issue while reading the File",
            error: err,
            data: null,
          });
          return console.log(err);
        }
        res.send({
          status: "success",
          message: "The File has been readed successfully.",
          data: data,
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

exports.saveFileData = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  console.log(req?.body);
  if (userData) {
    try {
      let filePath = path.join(
        "",
        `${baseFolder}/${userData.username}/${req?.body?.path}`
      );
      console.log(filePath);
      fs.writeFile(filePath, req?.body?.content, function (err) {
        if (err) {
          res.send({
            status: "error",
            message: "There is some issue while saving the File",
            error: err,
            data: null,
          });
          return console.log(err);
        }
        res.send({
          status: "success",
          message: "The File has been saving successfully.",
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

exports.terminal = async (req, res) => {
  const { command } = req.body;
  console.log(req.body);
  let token = req.headers["x-access-token"];
  let userData = await JSON.parse(atob(token.split(".")[1]));
  let currentUserPath = path.join("", `${baseFolder}/${userData.username}`);

  const childProcess = spawn(
    "C:/Program Files/Git/usr/bin/bash.exe",
    ["--login"],
    {
      stdio: ["pipe", "pipe", "pipe"],
      cwd: path.resolve(currentUserPath),
    }
  );

  childProcess.stdin.write(`${command}\n`);
  childProcess.stdin.end();

  let output = "";
  childProcess.stdout.on("data", (data) => {
    output += data;
  });

  childProcess.stderr.on("data", (data) => {
    output += data;
  });

  childProcess.on("close", (code) => {
    res.send(output);
  });
};
