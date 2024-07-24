const express = require("express");
const router = express.Router();
const productManager = require("../managers/product-managers.js");
const manager = new productManager("./src/data/productos.json");

//listar los productos

router.get("/", async (req, res) => {
  const arrayProductos = await manager.getProducts();
  res.send(arrayProductos);
});

//buscar producto por id

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const producto = await manager.getProductById(parseInt(id));

    if (!producto) {
      res.send("producto no encontrado");
    } else {
      res.send(producto);
    }
  } catch (error) {
    res.send("error al buscar ese id en los productos");
  }
});

module.exports = router;
