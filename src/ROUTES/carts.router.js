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

router.post("/:cid/products/:pid", async (req, res) => {
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

//actualizar la cantidad de un producto en un  carrito

router.put("/:cid/products/:pid", async (req, res) => {
  let carritoId = req.params.cid;
  let productoId = req.params.pid;
  let newQuantity = req.body.quantity;

  if (!newQuantity || newQuantity <= 0) {
    return res.status(400).send("Cantidad inválida");
  }
  try {
    const carrito = await cartManager.getCarritoById(carritoId);
    if (!carrito) {
      return res.status(404).send("Carrito no encontrado");
    }
    const existeProducto = carrito.products.find(
      (item) => item.product.toString() === productoId
    );
    if (existeProducto) {
      existeProducto.quantity = newQuantity;
      carrito.markModified("products");
      await carrito.save();
      res.json(carrito.products);
    } else {
      res.status(404).send("Producto no encontrado en el carrito");
    }
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
  let carritoId = req.params.cid;

  try {
    const carrito = await cartManager.getCarritoById(carritoId);
    if (!carrito) {
      return res.status(404).send("Carrito no encontrado");
    }
    carrito.products = [];
    carrito.markModified("products");
    await carrito.save();

    res.json({ message: "Carrito vacío exitosamente", carrito });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error.message);
    res.status(500).send("Error del servidor");
  }
});


module.exports = router;
