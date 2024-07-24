const express = require("express")
const app = express()
const PUERTO = 8080
const productsRouter = require("./ROUTES/products.router.js")
const cartsRouter = require("./ROUTES/carts.router.js")

//middleware
app.use(express.json())

//rutas
app.use("/api/products/", productsRouter)
app.use("/api/carts", cartsRouter)


app.listen(PUERTO, () =>{
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
})