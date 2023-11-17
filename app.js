const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const app = express();
app.use(express.static("public"));

app.use(
  session({
    secret: 'ab128726-3c35-4ad0-b717-01baaa44d4ea', 
    resave: false,
    saveUninitialized: true,
  })
);

const keycloak = new Keycloak({
  realm: 'App',
  url: 'http://localhost:8080/',
  
  resource: "My Cilent",
  secret: 'ab128726-3c35-4ad0-b717-01baaa44d4ea',
   
});

app.use(keycloak.middleware());

app.get('/login', keycloak.protect(), (req, res) => {
  res.redirect('index.html');
});

app.get('/message', keycloak.protect(), (req, res) => {
  const user = req.kauth.grant.access_token.content.preferred_username;
  res.send(`Hello ${user}! This is a protected page. You are logged in successfully.`);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});