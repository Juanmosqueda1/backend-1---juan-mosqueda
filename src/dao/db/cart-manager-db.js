const { error } = require("console");
const e = require("express");
const CartModel = require("../models/cart.model.js");

class CartManager {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.log("error al crear un nuevo carrito");
    }
  }

  //retorne un carrito por id

  async getCarritoById(carritoId) {
    try {
      const carrito = await CartModel.findById(carritoId);
      if (!carrito) {
        console.log("no existe ese carrito que buscas");
        return null;
      }
      return carrito;
    } catch (error) {
      console.log("error al obtener el carrito por id");
      throw error;
    }
  }

  //agregar productos al carrito

  async agregarProductosAlCarrito(carritoId, productoId, quantity = 1) {
    try {
      const carrito = await this.getCarritoById(carritoId);
      const existeProducto = carrito.products.find(
        (item) => item.product.toString() === productoId
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.products.push({ product: productoId, quantity });
      }

      carrito.markModified("products");
      await carrito.save();
      return carrito;
    } catch (error) {
      console.log("error al Agregar producto al carrito");
      throw error;
    }
  }
}

module.exports = CartManager;
