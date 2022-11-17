const express = require('express');
const routes = require('./routes');

const sequelize = require('./config/connection');

// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, async() => {
  console.log(`App listening on port ${PORT}!`);
  await sequelize.sync({ force: true });
  console.log(`Models have been synchronized!`)
});
