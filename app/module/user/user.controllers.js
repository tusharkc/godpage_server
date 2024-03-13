const { loginService, signUpService } = require("./user.services");

module.exports = {
  loginController: async (req, res, next) => {
    try {
      const response = await loginService(req.body, next);
      res.send(response);
    } catch (controllerError) {
      console.log(
        "[DEBUG] User Controller at loginController Error :-",
        controllerError
      );
      next(controllerError);
    }
  },

  signUpController: async (req, res, next) => {
    try {
      const response = await signUpService(req.body);
      res.send(response);
    } catch (controllerError) {
      console.log(
        "[DEBUG] User Controller at signUpController Error :-",
        controllerError
      );

      next(controllerError);
    }
  },
};
