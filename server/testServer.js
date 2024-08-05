// testServer.js
const express = require('express');
const app = express();

app.get('/reward/redemptions', (req, res) => {
  res.send('Redemptions route working');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
