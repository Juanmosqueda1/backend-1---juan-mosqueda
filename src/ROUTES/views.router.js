const { Router } = require("express");
const router = Router();
const ProductManager = require("../managers/product-managers.js");
const manager = new ProductManager("./src/data/productos.json");

router.get("/products", async (req, res) => {
  const productos = await manager.getProducts();

  res.render("home", { productos });
});

router.get("/realtimeproducts", async (req, res) => {

  res.render("realTimeProducts");
});

module.exports = router;
