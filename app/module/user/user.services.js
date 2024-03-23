const UserModel = require("../../model/User.model")(require("../../db"));
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

module.exports = {
  loginService: async (serviceInputParams) => {
    try {
      const { email, password } = serviceInputParams;

      const user = await UserModel.findOne({
        where: { email: email },
      });

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt.sign(
          { id: user.userId, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        return {
          token: token,
          message: "user logged in successfully",
          user: {
            email: user.email,
            id: user.userId,
          },
        };
      }
    } catch (serviceError) {
      console.log(
        "[DEBUG] User Service at loginService Error :-",
        serviceError
      );

      throw serviceError;
    }
  },

  signUpService: async (serviceInputParams) => {
    try {
      const { email, password, fullName } = serviceInputParams;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [user, created] = await UserModel.findOrCreate({
        where: { email: email, fullName },
        defaults: { password: hashedPassword },
      });

      if (created) {
        const token = jwt.sign(
          { id: user.userId, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        return {
          message: "user created successfully",
          token,
          user: {
            email: user.email,
            id: user.userId,
          },
        };
      }
    } catch (serviceError) {
      console.log(
        "[DEBUG] User Service at signUpService Error :-",
        serviceError
      );

      throw serviceError;
    }
  },
};
