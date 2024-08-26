const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const manager = new ProductManager();

router.get("/products", async (req, res) => {
  const productos = await manager.getProducts();

  res.render("home", { productos });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

module.exports = router;
