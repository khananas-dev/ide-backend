const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const os = require("os");
const path = require("path");
const fs = require("fs");
const baseFolder = path.join(os.homedir(), "Desktop/Projects/ide/ide-storage");

require("dotenv").config();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(401).send({ errorMsg: err });
      return;
    }

    // user folder creation code
    const newFolderName = path.join(baseFolder, user.username);
    try {
      if (!fs.existsSync(newFolderName)) {
        fs.mkdirSync(newFolderName);
      }
    } catch (err) {
      console.error("This is the error while creating folder", err);
    }
    //

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(401).send({ errorMsg: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(401).send({ errorMsg: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(401).send({ errorMsg: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(401).send({ errorMsg: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(401).send({
          errorMsg: "No user found",
          developerMsg: "No user found with given user name",
          responseStatus: "UNAUTHORIZED",
          responseCode: 401,
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          errorMsg: "Incorrect password or Username",
          developerMsg: "Password didn't match with the original one.",
          responseStatus: "UNAUTHORIZED",
          responseCode: 401,
        });
      }

      var token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
        },
        process.env.Auth_SECRET,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send(token);
    });
};
