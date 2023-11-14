import { Router } from "express";
import passport from "passport";
import {
  signupUser,
  failRegister,
  failLogin,
  loginUser,
  githubCallback,
  lastConnection,
} from "../controllers/sessions.controller.js";
import { passportCall } from "../utils/index.js";
import { authToken } from "../utils/index.js";

//Inicializa servicios
const router = Router();

//Ruta que realiza el registro
router.post(
  "/signup",
  passportCall("register", {
    session: false,
    passReqToCallback: true,
    failureMessage: true,
    failureRedirect: "api/sessions/failedRegister",
  }),
  signupUser
);

//Ruta que se ejecuta cuando falla el registro
router.get("/failRegister", failRegister);

//Ruta que realiza el login
router.post("/login", loginUser);

//Ruta que se ejecuta cuando falla el login
router.get("/failLogin", failLogin);

//Ruta que realiza el login con github
router.get(
  "/github",
  passport.authenticate(
    "github",
    { scope: ["user:email"] },
    async (req, res) => {}
  )
);

//Callback de github
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/api/sessions/failLogin",
    session: false,
    failureMessage: true,
  }),
  githubCallback
);

//Ruta que informa la ultima conexion del usuario
router.put("/lastConnection", authToken, lastConnection);

export default router;
