
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true }
);
const UrlShortenerSchema = mongoose.Schema({
    original_url: { type: String, required: true },
    short_url: { type: String, required: true, unique: true }
});

const Url = mongoose.model('Url', UrlShortenerSchema);
module.exports = Url;

