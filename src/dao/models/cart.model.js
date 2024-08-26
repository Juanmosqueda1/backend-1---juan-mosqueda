const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

const CartModel = mongoose.model("carts", cartSchema)

module.exports = CartModel