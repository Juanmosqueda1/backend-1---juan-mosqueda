const e = require("express");

const fs = require("fs").promises;

class productManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, code, stock, status }) {
    if (!title || !description || !price || !code || !stock || !status ) {
      console.log("todos los campos son obligatorios");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("el codigo debe ser unico");
      return;
    }

    const nuevoProducto = {
      id: ++productManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    this.products.push(nuevoProducto);

    await this.guardarArchivo(this.products);
  }

  async getProducts() {
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id == id);

      if (!buscado) {
        console.log("producto no encontrado");
        return null;
      } else {
        console.log("producto encontrado");
        return buscado;
      }
    } catch (error) {
      console.log("error al buscar por id", error);
    }
  }

  //metodos auxiliares

  async leerArchivo() {
    const respuesta = await fs.readFile(this.path, "utf-8");
    const arrayProductos = JSON.parse(respuesta);
    return arrayProductos;
  }

  async guardarArchivo(arrayProductos) {
    await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
  }

  //actualizar productos

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id == id);

      if (index !== -1) {
        arrayProductos[index] = {
          ...arrayProductos[index],
          ...productoActualizado,
        };
        await this.guardarArchivo(arrayProductos);
        console.log("producto actualizado");
      } else {
        console.log("no se encuentra el producto");
      }
    } catch (error) {
      console.log("tenemos un error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id == id);

      if (index != -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("producto eliminado");
      } else {
        console.log("no se encuentra el archivo");
      }
    } catch (error) {
      console.log("tenemos un error al eliminar productos");
    }
  }
}

module.exports = productManager;
