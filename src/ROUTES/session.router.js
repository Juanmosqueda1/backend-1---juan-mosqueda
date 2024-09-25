const Router = require("express");
const router = Router();
const UserModel = require("../dao/models/user.model.js");
const { createHash, isValidPassword } = require("../utils/utils.js");
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken.js");

//register jws

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    const existeUsuario = await UserModel.findOne({ email });
    if (existeUsuario) {
      return res.send("el usuario ya esta registrado");
    }
    //si no existe creamos uno nuevo
    const nuevoUsuario = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
    });

    //generamos el token
    const token = generateToken({
      first_name: nuevoUsuario.first_name,
      last_name: nuevoUsuario.last_name,
      email: nuevoUsuario.email,
    });

    res.status(201).send({ message: "usuario creado", token });
  } catch (error) {
    console.error(error);
    res.status(500).send("error fatal");
  }
});

//register version passport
// router.post(
//   "/register",
//   passport.authenticate("register", {
//     failureRedirect: "/api/sessions/failregister",
//   }),
//   async (req, res) => {
//     if (!req.user) return res.send("credenciales invalidas");

//     req.session.user = {
//       first_name: req.user.first_name,
//       last_name: req.user.last_name,
//       age: req.user.age,
//       email: req.user.email,
//     };

//     req.session.login = true;

//     res.redirect("/profile");
//   }
// );

// router.get("/failregister", (req, res) => {
//   res.send("fallo el registro");
// });


//login con jwt
router.post("/login", async (req,res) => {
   const {email, password} = req.body

   try {
    const usuario = await UserModel.findOne({email})

    if(!usuario){
      res.send("usuario no encontrado")
    }
    if(!isValidPassword(password, usuario)){
      return res.send("credenciales invalidas")
    }

    const token = generateToken({
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
      age: usuario.age
    })

    res.send({message:"logueado con exito", token})
   } catch (error) {
    res.status(500).send(error)
   }
})

//login version para passport
// router.post(
//   "/login",
//   passport.authenticate("login", {
//     failureRedirect: "/api/sessions/faillogin",
//   }),
//   async (req, res) => {
//     if (!req.user) return res.send("credenciales invalidas");

//     req.session.user = {
//       first_name: req.user.first_name,
//       last_name: req.user.last_name,
//       age: req.user.age,
//       email: req.user.email,
//     };

//     req.session.login = true;

//     res.redirect("/profile");
//   }
// );

// router.get("/faillogin", (req, res) => {
//   res.send("fallo el login");
// });

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
