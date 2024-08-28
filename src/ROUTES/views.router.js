const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const manager = new ProductManager();
const ProductosModel = require("../dao/models/productos.models.js");

router.get("/products", async (req, res) => {
  let page = req.query.page || 1;
  let limit = 4;
  let sort = req.query.sort || "asc";

  let sortOption = sort === "desc" ? -1 : 1;

  try {
    const productos = await manager.getProducts();
    const listadoProductos = await ProductosModel.paginate(
      {},
      {
        limit,
        page,
        sort: { price: sortOption }, // Aplicar el orden según el precio
      }
    );

    const listadoProductosFinal = listadoProductos.docs.map((elemento) => {
      const { _id, ...rest } = elemento.toObject();
      return rest;
    });

    // Combinar los objetos para pasarlos a la vista
    res.render("home", {
      products: listadoProductosFinal,
      hasPrevPage: listadoProductos.hasPrevPage,
      hasNextPage: listadoProductos.hasNextPage,
      prevPage: listadoProductos.prevPage,
      nextPage: listadoProductos.nextPage,
      currentPage: listadoProductos.page,
      totalPages: listadoProductos.totalPages,
      sort,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

module.exports = router;
