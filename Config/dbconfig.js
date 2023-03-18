
const mongoose = require('mongoose');
const mongoUrl = "mongodb+srv://admin:admin@cluster0.kod6nyx.mongodb.net/?retryWrites=true&w=majority";


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


const user = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

const userModel = mongoose.model('User', user);

const albumModel = mongoose.model('Album', albumSchema);

module.exports = { albumModel, userModel };