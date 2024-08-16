const mongoose = require("mongoose")

//definimos es schema
const productoSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    stock: Number
})


//definimos el model

const ProductosModel = mongoose.model("products", productoSchema)

module.exports = ProductosModel
