const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { storeData, loadData } = require("./helpers/storeData");

app.set("view engine", "ejs");
bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.render("welcome");
});

app.post("/chats", (req, res) => {
  const data = req.body;

  console.log("req:", data);
  res.send("data recieved");
});

// Creating Post Route for login

// Render Login form page
app.get('/login', (req, res) => {
    res.render('loginForm')
})


app.post("/information", (req, res) => {
  // Retrive form data from request object
  const data = req.body;
  const { username, password } = data;

  //Render information in the page
  res.send(`
    <p><strong>Login Information collected!</strong></p>
    <div>
      <strong>Username</strong> : ${username}
    </div>
    <div>
      <strong>Password</strong> : ${password}
    </div>
  `);
});
app.listen(3000, () => console.log("Server running now ***<:)"));
