const dotenv = require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const app = express();
const port = 3000;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Configuración de logearte con Github
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use(session({    
    secret: "secret",
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// Middleware para verificar si el usuario está autenticado
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

app.get("/", (req, res) => {
    const html = "<a href='/auth/github'>Login with Github</a>";
    res.send(html);
});

app.get("/auth/github", 
    passport.authenticate("github", { scope: ["user:email"] }
));

app.get("/auth/github/callback", 
    passport.authenticate("github", { failureRedirect: "/" }), //Te redirige a la home page si falla
    (req, res) => {
    res.redirect("/profile");
    console.log(req);
});

app.get("/profile", ensureAuthenticated, (req, res) => {
    res.send(`Hola ${req.user.displayName || req.user.username}`); //Si no tiene displayName, muestra el username
})

app.get("/logout", (req, res) => {
    req.logout(done => {
        console.log(done, "Usuario deslogueado");
    });
    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});