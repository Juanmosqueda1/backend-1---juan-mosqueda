const passport = require("passport")
const local = require("passport-local")
const UserModel = require("../dao/models/user.model.js")
const {createHash, isValidPassword} = require("../utils/utils.js")
const GitHubStrategy = require("passport-github2")

const localStrategy = local.Strategy

const initializePassport = () => {
    passport.use("register", new localStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) =>{
        const {first_name, last_name, email, age} = req.body;
        try {
            let user = await UserModel.findOne({email})
            if(user) return done(null, false)
            //si no existe creo un registro de usuario nuevo
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser)

            return done(null,result)

        } catch (error) {
            return done(error)
        }
    }))

    //agregamos otra estrategia para el login
    passport.use("login", new localStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //primero verifico si existe un usuario con ese mail
            const user = await UserModel.findOne({email});
            if(!user){
                console.log("el usuario no existe")
                return done(null, false)
            }

            if(!isValidPassword(password, user)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id: id})
        done(null, user)
    })
}

//estrategia nueva con github
passport.use("github", new GitHubStrategy({
    clientID: "Iv23li9N8hfwO7W9l64g",
    clientSecret: "1f9e53e1ef0a65d0d7f24a0b3e792796c1241945",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
}, async (accessToken, refreshToken, profile, done) =>{
    console.log("profile", profile)


    try {
        let user = await UserModel.findOne({email: profile._json.email})

        if(!user){
            let newUser = {
                first_name: profile._json.name,
                last_name: "",
                age: 21,
                email: profile._json.email,
                password: ""
            }

            let result = await UserModel.create(newUser)
            done(null, result)
        } else {
            done(null, user)
        }
    } catch (error) {
        return done(error)
    }
}))

module.exports = initializePassport