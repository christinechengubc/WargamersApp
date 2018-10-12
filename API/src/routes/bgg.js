const SEARCH_URL = "https://www.boardgamegeek.com/xmlapi/search?search=";
const DETAILS_URL = "https://www.boardgamegeek.com/xmlapi/boardgame/";

const bgg = require('express').Router();
const axios = require('axios');
const promisify = require('util').promisify;
const parseString = promisify(require('xml2js').parseString);

function format(game) {
    return {
        id: parseInt(game["$"].objectid),
        year: game.yearpublished ? parseInt(game.yearpublished[0]) : null,
        name: game.name[0]["_"] || game.name[0] || null
    };
}

function formatDetail(game) {
    const stats = game.statistics[0].ratings[0];
    return {
        id: parseInt(game["$"].objectid),
        name: game.name.filter((n) => n["$"].primary)[0]["_"],
        category: game.boardgamesubdomain[0]["_"].split(' ')[0],
        year_published: game.yearpublished ? parseInt(game.yearpublished[0]) : null,
        min_players: game.minplayers ? parseInt(game.minplayers[0]) : null,
        min_playtime: game.minplaytime ? parseInt(game.minplaytime[0]) : null,
        max_players: game.maxplayers ? parseInt(game.maxplayers[0]) : null,
        max_playtime: game.maxplaytime ? parseInt(game.maxplaytime[0]) : null,
        description: game.description[0].split('<br/>')[0],
        thumbnail: game.thumbnail[0],
        image: game.image[0],
        users_rated: stats.usersrated ? parseInt(stats.usersrated[0]) : null,
        rating: stats.average ? Number(parseFloat(stats.average[0]).toFixed(4)) : null,
        complexity: stats.averageweight ? Number(parseFloat(stats.averageweight[0]).toFixed(3)) : null
    }
}

bgg.get('/detail/:id', (req, res) => {
    const id = req.params.id;

    axios.get(`${DETAILS_URL}${id}?stats=1`)
    .then((result) => parseString(result.data))
    .then((result) => {
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: `found details for ${id} from bgg API`,
            result: formatDetail(result.boardgames.boardgame[0])
        });
    })
    .catch((err) => {
        return res.status(502).json({
            status: 'failure',
            code: 502,
            message: `boardgamegeek API is unavailable: ${err}`
        });
    });
});

bgg.get('/search/:title', (req, res) => {
    const title = encodeURIComponent(req.params.title);
    axios.get(`${SEARCH_URL}${title}`)
    .then((result) => parseString(result.data))
    .then((result) => {
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'discovered games from bgg API',
            result: result.boardgames.boardgame.slice(0, 10).map(format)
        });
    })
    .catch((err) => {
        return res.status(502).json({
            status: 'failure',
            code: 502,
            message: `boardgamegeek API is unavailable: ${err}`
        });
    });
});

module.exports = bgg;
