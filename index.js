require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const urlParser = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', function(req, res) {
  let url = req.body.url;
  let urlRegex = /^https?:\/\/.+\..+/;

  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid URL' });
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (err) {
    return res.json({ error: 'invalid URL' });
  }

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid URL' });
    }
    let short_url = Math.floor(Math.random() * 10000).toString();
    res.json({ original_url: url, short_url: short_url });
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
