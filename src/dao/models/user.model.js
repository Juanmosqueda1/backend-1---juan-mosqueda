const moongoose = require("mongoose");

const userSchema = new moongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String
    // require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  password: {
    type: String
    // require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  rol: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
});

const UserModel = moongoose.model("user", userSchema);

module.exports = UserModel;
