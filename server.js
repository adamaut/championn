const express = require('express');
const shortid = require('shortid');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

// Database setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite')
});

// Define URL model
const Url = sequelize.define('Url', {
  longUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shortCode: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Shorten URL
app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = shortid.generate();
  const shortUrl = `https://your-render-domain.onrender.com/${shortCode}`;

  try {
    await Url.create({ longUrl, shortCode });
    res.json({ shortUrl });
  } catch (err) {
    console.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ where: { shortCode } });
    if (url) {
      res.redirect(url.longUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (err) {
    console.error('Error retrieving URL:', err);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});