const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true }
);
const urlShortenerdb = mongoose.Schema({
    originalurl: String,
    shorturl: String
});

const Url= mongoose.model('Url', urlShortenerdb);
module.exports = Url;