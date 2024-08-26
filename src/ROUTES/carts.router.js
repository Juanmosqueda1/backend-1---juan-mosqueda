const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

//ruta post que cree un carrito nuevo

router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    req.status(500).send("error del servidor");
  }
});

//listamos los prroductos de determinado carrito

router.get("/:cid", async (req, res) => {
  let carritoId = req.params.cid;

  try {
    const carrito = await cartManager.getCarritoById(carritoId);
    res.json(carrito.products);
  } catch (error) {
    res.status(500).send("error al obtener los productos del carrito");
  }
});

//AGREGAR PRODUCTOS AL CARRITO

router.post("/:cid/product/:pid", async (req, res) => {
  let carritoId = req.params.cid;
  let productoId = req.params.pid;
  let quantity = req.body.quantity || 1;

  try {
    const actualizado = await cartManager.agregarProductosAlCarrito(
      carritoId,
      productoId,
      quantity
    );
    res.json(actualizado.products);
  } catch (error) {
    res.status(500).send("error al agregar un producto");
  }
});

module.exports = router;
