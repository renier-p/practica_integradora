import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate("register", { failureRedirect: '/api/sessions/failregister' }), (req, res) => {
    res.redirect('/login');
});

router.get('/failregister', (req, res) => {
    console.log("Registro fallido");
    res.send({ error: "fallo" });
});

router.get("/github", passport.authenticate("github", { scope: 'user:email' }), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect("/")
});

router.post('/login', passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }), (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos Incorrectos" });
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    };
    res.redirect('/');
});

router.get('/faillogin', (req, res) => {
    console.log("Inicio de sesión fallido");
    res.send({ error: "fallo" });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default router;
