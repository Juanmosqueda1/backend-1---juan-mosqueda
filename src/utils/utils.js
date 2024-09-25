//bcrypt
const bcrypt = require("bcrypt")

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//hashsync toma el password y aplica un proceso de hasheo a partir de un salt
// un salt es un string random que se hace para q el proceso se realice de forma impredecible (el 10 significa que el sal sera de 10 caracteres)

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

module.exports = {createHash, isValidPassword}