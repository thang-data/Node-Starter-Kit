
const { mongoUrl } = require('../database/albumData');

const mongoose = require('mongoose');

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('Connected to database');
});


const albumSchema = new mongoose.Schema({
    albumId: Number,
    artistName: String,
    collectionName: String,
    artworkUrl100: String,
    releaseDate: String,
    primaryGenreName: String,
    url: String,
});

const albumModel = mongoose.model('Album', albumSchema);

module.exports = albumModel;