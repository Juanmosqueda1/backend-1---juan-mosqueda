const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const manager = new ProductManager();
const ProductosModel = require("../dao/models/productos.models.js");
const passport = require("passport");

router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/products");
  }
  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/products");
  }
  res.render("register");
});

router.get(
  "/admin",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    console.log("Usuario autenticado:", req.user); // Deberías ver la información del usuario aquí
    if (!req.user) {
      return res.status(401).send("Usuario no autenticado");
    }
    if (req.user.rol !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    if (!req.session.login) {
      return res.redirect("/login");
    }

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
        user: req.session.user,
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
  }
);

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

module.exports = router;
