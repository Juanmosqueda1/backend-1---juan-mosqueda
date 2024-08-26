const ProductosModel = require("../models/productos.models.js")

class productManager {

  async addProduct({ title, description, price, code, stock, category, thumbnail }) {
    try {
        if (!title || !description || !price || !code || !stock || !category) {
            console.log("todos los campos son obligatorios");
            return;
          }


          const existeProducto = await ProductosModel.findOne({code: code})
          if(existeProducto){
            console.log("el codigo debe ser unico")
            return
          }


          const nuevoProducto = new ProductosModel({
            title,
            description,
            price,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnail || []
          });


          await nuevoProducto.save()

    } catch (error) {
        console.log("error al agregar un producto", error)
        return null
    }
  }

  async getProducts() {
    try {
      const arrayProductos = await ProductosModel.find()
      return arrayProductos;
    } catch (error) {
      console.log("error al obtener los productos", error);
    }
  }


  async getProductById(id) {
    try {
        const producto = await ProductosModel.findById(id)
        if(!producto){
            console.log("producto no encontrado")
            return null
        }
        return producto
    } catch (error) {
      console.log("error al buscar por id", error);
    }
  }
////////////////////////////////////////////////////////////////////////


  //actualizar productos

  async updateProduct(id, productoActualizado) {
    try {
        const updateado = await ProductosModel.findByIdAndUpdate( id , productoActualizado)

        if(!updateado){
            console.log(" no se encuentra el producto")
            return null
        }
        return updateado
    } catch (error) {
      console.log("tenemos un error al actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
        const deleteado = await ProductosModel.findByIdAndDelete( id )

        if(!deleteado){
            console.log(" no se encuentra el producto")
            return null
        }


    } catch (error) {
      console.log("tenemos un error al eliminar productos");
    }
  }
}

module.exports = productManager;
