const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', methods: '*', allowedHeaders: '*' }));

app.get('/', async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).send('Falta parámetro `url`');
  }
  try {
    const response = await fetch(target);
    response.headers.forEach((value, name) => {
      if (!name.toLowerCase().startsWith('access-control-')) {
        res.setHeader(name, value);
      }
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    const buf = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buf));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).send('Error al obtener recurso: ' + err.message);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy CORS escuchando en puerto ${PORT}`));
