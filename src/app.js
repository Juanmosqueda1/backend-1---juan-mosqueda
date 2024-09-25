const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const sessionRouter = require("./routes/session.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const { Server } = require("socket.io");
const socket = require("socket.io");
const mongoose = require("mongoose");
const ProductosModel = require("./dao/models/productos.models.js");
const cookieParser = require("cookie-parser");
require("./database.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport")
const initializePassport = require("./config/passport.config.js")


//middleware
app.use(express.json());
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));

//configuro handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, // Permite acceso a propiedades heredadas
      allowProtoMethodsByDefault: true, // Permite acceso a métodos heredados
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

const claveSecreta = "holamundo";
app.use(cookieParser(claveSecreta));

//session
app.use(
  session({
    secret: "secretcoder",
    resave: true,
    //resave me permite mantener  activa la sesion frente a la inacticidad del usuario
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://juan-mosqueda:coderjuan@cluster0.yzyo4.mongodb.net/storage?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  }));

  initializePassport()
  app.use(passport.initialize())
  app.use(passport.session())

//rutas
app.use("/api/products/", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const io = socket(httpServer);

const ProductManager = require("./dao/db/product-manager-db.js");
const manager = new ProductManager();

io.on("connection", async (socket) => {
  console.log("Un cliente se conectó");

  // Enviar productos al cliente conectado
  socket.emit("productos", await manager.getProducts());

  // Manejar eliminación de productos
  socket.on("eliminarProducto", async (id) => {
    try {
      await manager.deleteProduct(id);
      io.emit("productos", await manager.getProducts());
      console.log("Producto eliminado y productos actualizados");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  });

  // Manejar adición de productos desde el formulario
  socket.on("productForm", async (data) => {
    console.log("Datos recibidos del cliente:", data);
    try {
      const { title, description, price, code, stock, category } = data;

      // Asegúrate de que el producto se añade correctamente
      await manager.addProduct({
        title,
        description,
        price,
        code,
        stock,
        category,
      });

      // Emitir la lista actualizada de productos
      const updatedProducts = await manager.getProducts();
      io.emit("productos", updatedProducts);

      console.log(
        "Producto añadido y lista de productos actualizada:",
        updatedProducts
      );
    } catch (error) {
      console.error("Error al añadir el producto:", error);
    }
  });
});
