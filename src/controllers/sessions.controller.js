import { sessionsService, usersService } from "../repository/index.js";
import { generateToken, isValidPassword } from "../utils/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateSessionErrorInfo } from "../services/errors/info.js";

// Ruta que realiza el registro de usuario
async function signupUser(req, res) {
  req.logger.info(`Usuario creado con éxito ${new Date().toLocaleString()}`);
  res.json({ message: "Usuario creado con éxito", data: req.user });
}

// Ruta que se ejecuta cuando falla el registro de usuario
async function failRegister(req, res, next) {
  const result = [];
  req.logger.error(
    `Error de base de datos: Error al crear el usuario ${new Date().toLocaleString()}`
  );
  CustomError.createError({
    name: "Error de base de datos",
    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
    message: "Error al crear el usuario",
    code: EErrors.DATABASE_ERROR,
  });
  res.status(500).json({ message: "Error al crear el usuario" });
  next();
}

// Ruta que realiza el inicio de sesión de usuario
async function loginUser(req, res, next) {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      const result = [username, password];
      req.logger.error(
        `Error de tipo de dato: Error de inicio de sesión ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error de inicio de sesión",
        code: EErrors.INVALID_TYPES_ERROR,
      });
      res.status(400).json({ message: "Error de inicio de sesión" });
    } else {
      const result = await usersService.getOneUser(username);
      if (
        result.length === 0 ||
        !isValidPassword(result[0].password, password)
      ) {
        req.logger.error(
          `Error de base de datos: Usuario no encontrado ${new Date().toLocaleString()}`
        );
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Usuario no encontrado",
          code: EErrors.DATABASE_ERROR,
        });
        res.status(404).json({ message: "Usuario no encontrado" });
      } else {
        const myToken = generateToken({
          first_name: result[0].first_name,
          username,
          password,
          role: result[0].role,
        });
        req.logger.info(
          `Login realizado con éxito ${new Date().toLocaleString()}`
        );
        res.json({ message: "Login realizado con éxito", token: myToken });
      }
    }
  } catch (error) {
    next(error);
  }
}

// Ruta que se ejecuta cuando falla el inicio de sesión de usuario
async function failLogin(req, res, next) {
  const result = [];
  req.logger.error(
    `Error de base de datos: Error al iniciar sessión ${new Date().toLocaleString()}`
  );
  CustomError.createError({
    name: "Error de base de datos",
    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
    message: "Error al iniciar sessión",
    code: EErrors.DATABASE_ERROR,
  });
  res.status(500).json({ message: "Error al iniciar sessión" });
  return next();
}

async function lastConnection(req, res, next) {
  const { username, action } = req.body;
  if (!username || !action) {
    const result = [username, action];
    req.logger.error(
      `Error de tipo de dato: Error al informar la última conexión ${new Date().toLocaleString()}`
    );
    CustomError.createError({
      name: "Error de tipo de dato",
      cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
      message: "Error al informar la última conexión",
      code: EErrors.INVALID_TYPES_ERROR,
    });
    res.status(400).json({ message: "Error al informar la última conexión" });
    return;
  }
  try {
    const userResult = await usersService.getOneUser(username);
    const id = userResult[0]._id;
    const newAction = `${
      action === "login" ? "Login" : "Logout"
    } realizado con éxito ${new Date().toLocaleString()}`;
    const result = await sessionsService.lastConnection(id, newAction);
    if (result.length === 0) {
      req.logger.error(
        `Error de base de datos: Usuario no encontrado ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Usuario no encontrado",
        code: EErrors.DATABASE_ERROR,
      });
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    req.logger.info(
      `Última acción informada con éxito ${new Date().toLocaleString()}`
    );
    res.json({
      message: "Última acción informada con éxito",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// Github callback
async function githubCallback(req, res, next) {
  // Prepare the req object for loginUser
  req.body = {
    username: req.user[0].email,
    password: req.user[0].password,
  };

  // Call the loginUser function
  await loginUser(req, res, next);
}

export {
  signupUser,
  failRegister,
  loginUser,
  failLogin,
  githubCallback,
  lastConnection,
};
