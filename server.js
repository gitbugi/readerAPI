const express = require('express');
const cors = require('cors');
const { Translator } = require('deepl-node');
require('dotenv').config();

// API-Key aus Umgebungsvariablen oder direkt hier einsetzen
const API_KEY = process.env.DEEPL_API_KEY;
const translator = new Translator(API_KEY);
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const app = express();
app.use(cors({
  origin: '*', // Ersetze das mit deiner Frontend-URL
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true               // Falls du Cookies oder Auth-Zeug überträgst
}));

app.use(express.json(), verifyToken);

// Erlaube CORS für dein Frontend


function verifyToken(req, res, next) {
  // Der Token kann z. B. im Header 'x-api-key' übermittelt werden
  
  const token = req.headers['x-api-key'];  
  
  if (token === AUTH_TOKEN) {
    next(); // Zugriff erlaubt
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Einfache Übersetzungsroute
app.post('/translate', async (req, res) => {
  try {
    
    const { text, target } = req.body;
    
    if (!text || !target) {
      return res.status(400).json({ error: 'Text und Zielsprache (target) erforderlich' });
    }
    
    const result = await translator.translateText(text, null, target);
    res.json({ translation: result.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});