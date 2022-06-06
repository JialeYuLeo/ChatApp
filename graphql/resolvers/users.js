const bcrypt = require("bcryptjs");
const { User, Message } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env.json");

module.exports = {
  Query: {
    getUsers: async (_, { username }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let users;
        let errors = {};

        if (!username || username.trim() === "") {
          users = await User.findAll({
            attributes: ["username", "imageUrl", "createdAt"],
            where: { username: { [Op.ne]: user.username } },
          });
        } else {
          username = username.trim();
          if (username === user.username) {
            errors.username = username;
            throw new UserInputError("search login user", { errors });
          }
          tmpUser = await User.findOne({
            where: { username },
          });

          if (!tmpUser) {
            errors.username = "username";
            throw new UserInputError("user not found", { errors });
          } else {
            users = await User.findAll({
              attributes: ["username", "imageUrl", "createdAt"],
              where: {
                username: {
                  [Op.and]: [{ [Op.ne]: user.username }, { [Op.eq]: username }],
                },
              },
            });
          }
        }

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};

      try {
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password === "") errors.password = "password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }

        const token = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: 60 * 60,
        });

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },

  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword, imageUrl } = args;

      let errors = {};
      // errors.imageUrl = "";

      const saltRounds = 10;

      try {
        if (email.trim() === "") errors.email = "email must not be empty";
        if (email.trim().length > 30)
          errors.email = "email to long (30 maximum)";
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (username.trim().length > 20)
          errors.username = "username to long (20 maximum)";
        if (password.trim() === "")
          errors.password = "password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "repeat password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "passwords must match";

        password = await bcrypt.hash(password, 6);

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        const user = await User.create({
          username,
          email,
          password,
          imageUrl,
        });

        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
