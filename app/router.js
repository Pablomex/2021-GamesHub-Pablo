const express = require("express");

const router = express.Router();

//const games = require('./games.json');
//server.locals.games = games;

//router.use((req, res, next) => {
//    req.isDiceRoller = false;
//    next();
//});

router.get("/",(req,res)=>{
    res.render('index');
});

router.get("/game/:nomDuJeu",(req,res, next)=>{
    const games = res.locals.games;
    const game = games.find(game => game.name == req.params.nomDuJeu);

    res.locals.isDiceRoller = false;
    res.locals.isRPG = false;
    if (!game) {
        next();
    }

    if (game.name == 'diceRoller') {
        res.locals.isDiceRoller = true;
    }
    if (game.name == 'rpg') {
        res.locals.isRPG = true;
    }

    res.render(game.name, {
        name: game.name,
        title: game.title,
        css: game.cssFile,
        js: game.jsFile
    });
});

//Gestion de la page 404
router.use((req, res, next) => {
    res.status(404).render('404', {
        css:'404.css',
        title:"Désolé, cette page n'existe pas"
    });
});

module.exports = router;