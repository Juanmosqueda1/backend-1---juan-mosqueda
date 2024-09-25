const { default: mongoose } = require("mongoose");

mongoose.connect(
    "mongodb+srv://juan-mosqueda:coderjuan@cluster0.yzyo4.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("conexion exitosa"))
  .catch((error) => console.log("tenemos un error", error));
