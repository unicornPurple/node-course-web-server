const express = require("express");
const hbs = require("hbs"); //handlebarsjs.com, template program, views innehåller templates
const fs = require("fs");

const port = process.env.PORT || 3000; //funkar både med heroku satt port eller lokal

var app = express();

app.set("view engine", "hbs");

/*app.use((req, res, next) => {
  res.render("maintenance.hbs", {
    pageTitle: "Maintenance in progress",
    maintainMsg: "currently maintaining site"
  });
});*/

hbs.registerPartials(__dirname + "/views/partials"); //partials är generiska html header & footer
app.use(express.static(__dirname + "/public"));  //using middleware för att modifiera express

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `date: ${now} method: ${req.method} path: ${req.path}`;
  console.log(log);
  fs.appendFile("server.log", log + "\n", (err) => {
    err ? console.log("unable to write to server.log") : console.log("updating server.log");;
  });
  next();
});

hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
  return text.toUpperCase();
});

app.get("/", (req, res) => {
  res.render("home.hbs", {
    pageTitle: "Home Page",
    welcomeMsg: "welcome"
    //currentYear: new Date().getFullYear(), // använder istället hbs helper
  });
});

app.get("/about", (req, res) => {
  res.render("about.hbs", {
    pageTitle: "About Page"
    //currentYear: new Date().getFullYear()
  }); // render använder det som finns i views
});

app.get("/bad", (req, res) => {
  res.send({
    error: "bad error detected",
    errorcodes: [
      "bad",
      "error",
      "no"
    ]
  })
});

app.listen(port, () => {
  console.log(`serving to port ${port}, localhost:${port}`);
});
