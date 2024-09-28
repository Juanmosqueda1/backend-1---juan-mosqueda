const passport = require("passport")
const local = require("passport-local")
const UserModel = require("../dao/models/user.model.js")
const {createHash, isValidPassword} = require("../utils/utils.js")
const GitHubStrategy = require("passport-github2")
const jwt = require("passport-jwt")

//  

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

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    if(req && req.cookies) {
        token = req.cookies["cookieToken"]
    }
    return token
}

const initializePassport = ( ) =>{ 
    passport.use("jwt", new JWTStrategy( {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "holamundo"
    }, async (jwt_payload, done) => {
        try {
            return done (null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}


module.exports = initializePassport