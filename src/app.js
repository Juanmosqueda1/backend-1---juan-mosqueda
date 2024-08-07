const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const { Server } = require("socket.io");
const socket = require("socket.io");

//middleware
app.use(express.json());
app.use(express.static("./src/public"));

//configuro handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//rutas
app.use("/api/products/", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

const io = socket(httpServer);

const ProductManager = require("./managers/product-managers.js");
const manager = new ProductManager("./src/data/productos.json");

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
    try {
      const { title, description, price, code, stock, category, status = true} = data;
      await manager.addProduct({
        title,
        description,
        price,
        code,
        stock,
        category,
      });
      io.emit("productos", await manager.getProducts());
      console.log("Producto añadido y productos actualizados");
    } catch (error) {
      console.error("Error al añadir el producto:", error);
    }
  });
});
