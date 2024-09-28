const Router = require("express");
const router = Router();
const UserModel = require("../dao/models/user.model.js");
const { createHash, isValidPassword } = require("../utils/utils.js");
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken.js");
const jwt = require("jsonwebtoken");

//register jws

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age, rol } = req.body;

  try {
    const existeUsuario = await UserModel.findOne({ email });
    if (existeUsuario) {
      return res.status(400).send("el usuario ya esta registrado");
    }
    //si no existe creamos uno nuevo
    const nuevoUsuario = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      rol
    });

    await nuevoUsuario.save();

    //generamos el token
    const token = generateToken({
      first_name: nuevoUsuario.first_name,
      last_name: nuevoUsuario.last_name,
      email: nuevoUsuario.email,
    });

    res.cookie("cookieToken", token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("error fatal");
  }
});

//login con jwt
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalizar el email
    const emailLimpio = email.trim().toLowerCase();
    const usuario = await UserModel.findOne({ email: emailLimpio });

    if (!usuario) {
      return res.send("usuario no encontrado");
    }

    // Verificar la contraseña
    if (!isValidPassword(password, usuario)) {
      return res.send("credenciales invalidas");
    }

    // Generar el token JWT
    const token = generateToken({
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
    });

    req.session.user = {
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
      age: usuario.age
    }

    req.session.login = true

    // Configurar la cookie con el token
    res.cookie("cookieToken", token, {
      maxAge: 3600000, // 1 hora
      httpOnly: true,
    });

    // Redirigir al usuario a /products
    return res.redirect("/products");

  } catch (error) {
    // Manejo de errores
    return res.status(500).send(error);
  }
});

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

//version para github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

module.exports = router;
