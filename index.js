require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns/promises');
const { nanoid } = require('nanoid');
const Url = require('./database'); // Importa o modelo

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async(req, res)=> {
  const { url } = req.body;
  // Valida o formato da URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.json({ error: 'invalid URL' });
    }
  } catch {
    return res.json({ error: 'invalid URL' });
  }

  //Verifica se o domínio existe
  try {
    await dns.lookup(parsedUrl.hostname);
  } catch {
    return res.json({ error: 'invalid URL' });
  }

  //Verifica se a URL já foi encurtada
  const existing = await Url.findOne({ original_url: url });
  if (existing) {
    return res.json({
      original_url: existing.original_url,
      short_url: existing.short_url,
    });
  }

  // Gera código curto e salva no banco
  const short_url = nanoid(6);
  const newUrl = await Url.create({ original_url: url, short_url });

  res.json({
    original_url: newUrl.original_url,
    short_url: newUrl.short_url,
  });
});


app.get('/api/shorturl/:short_url', async (req, res) => {
  const { short_url } = req.params;
  const found = await Url.findOne({ short_url });

  if (!found) return res.json({ error: 'No short URL found for given input' });

  return res.redirect(found.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
