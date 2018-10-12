var SEARCH_URL = "https://www.boardgamegeek.com/xmlapi/search?search="

var bgg = require('express').Router();
var axios = require('axios');
var promisify = require('util').promisify;
var parseString = promisify(require('xml2js').parseString);

function format(game) {
    return {
        id: parseInt(game["$"].objectid),
        year: game.yearpublished ? parseInt(game.yearpublished[0]) : null,
        name: game.name[0]["_"]
    };
}

bgg.get('/search/:title', (req, res) => {
    var title = encodeURIComponent(req.params.title);
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
            message: `boardgamegeek API is unavailable\n${err}`
        });
    });
});

module.exports = bgg;
