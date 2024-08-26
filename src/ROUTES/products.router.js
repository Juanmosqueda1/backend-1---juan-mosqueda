const express = require("express");
const router = express.Router();
const productManager = require("../dao/db/product-manager-db.js");
const manager = new productManager();

//listar los productos

router.get("/", async (req, res) => {
  const arrayProductos = await manager.getProducts();
  res.send(arrayProductos);
});

//buscar producto por id

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const producto = await manager.getProductById(id);

    if (!producto) {
      res.send("producto no encontrado");
    } else {
      res.send(producto);
    }
  } catch (error) {
    res.send("error al buscar ese id en los productos");
  }
});

router.post("/", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await manager.addProduct(nuevoProducto);

    res.status(201).send("Producto agregado exitosamente");
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  let id = req.params.pid;
  let product = req.body;

  try {
    await manager.updateProduct(id, product);
    res.status(200).send("Producto actualizado");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al actualizar el producto");
  }
});

router.delete("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    await manager.deleteProduct(id);
    res.status(200).send("Producto eliminado con éxito");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al eliminar el producto");
  }
});

module.exports = router;
