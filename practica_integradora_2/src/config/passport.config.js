import passport from 'passport';
import local from 'passport-local';
import userService from '../Dao/models/user.js';
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23li4KnTef54WYz6rG",
        clientSecret: "581585b793446cf127be0c24e4d779a07c8cf549", 
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    age: "", 
                    password: ""
                };
                let result = await userService.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                let user = await userService.findOne({ email: username });
                if (user) {
                    return done(null, false, { message: "El usuario ya existe" });
                }
                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password)
                };
                let result = await userService.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await userService.findOne({ email: username });
                if (!user) {
                    return done(null, false, { message: "El usuario no existe" });
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
