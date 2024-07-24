const { error } = require("console");
const e = require("express");

const fs = require("fs").promises;
class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.ultId = 0;

    //cargar los carritos almacenados
    this.cargarCarritos();
  }

  //creo dos funciones auxiliares para cargar y leer archivos

  async cargarCarritos() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);

      if (this.carts.length > 0) {
        //verifico que exista un elemento creado
        this.ultId = Math.max(...this.carts.map((cart) => cart.id));
        //utilizo el metodo map para crear un nuevo arrayt que solo tenga los id del carrito y con el math.max obtengo el mayor
      }
    } catch (error) {
      console.log("error al cargar los carritos desde el archivo", error);
      //si no existe el archivo lo voy a crear
      await this.guardarCarritos();
    }
  }

  async guardarCarritos() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  //creo el carrito

  async crearCarrito() {
    const nuevoCarrito = {
      id: ++this.ultId,
      products: [],
    };

    this.carts.push(nuevoCarrito);
    //guardamos el array en el archivo
    await this.guardarCarritos();
    return nuevoCarrito;
  }

  //retorne un carrito por id

  async getCarritoById(carritoId) {
    try {
      const carrito = this.carts.find((c) => c.id === carritoId);

      if (!carrito) {
        throw new Error("no existe un carrito con ese id");
      }

      return carrito;
    } catch (error) {
      console.log("error al obtener el carrito por id");
      throw error;
    }
  }

  //agregar productos al carrito

  async agregarProductosAlCarrito(carritoId, productoId, quantity = 1) {
    const carrito = await this.getCarritoById(carritoId);
    const existeProducto = carrito.products.find(
      (p) => p.product === productoId
    );

    if (existeProducto) {
      existeProducto.quantity += quantity;
    } else {
      carrito.products.push({ product: productoId, quantity });
    }

    await this.guardarCarritos();
    return carrito;
  }
}

module.exports = CartManager;
