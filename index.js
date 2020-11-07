// Installing package=
const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidV4 } = require("uuid");

const {
  register,
  login,
  storeToken,
  clearLocalStorage,
  retrieveToken,
  verifyToken,
} = require("./helpers/userAuth");
const { storeData, loadData, checkUser } = require("./helpers/storeData");

const PORT = process.env.PORT || 3000;

// Middleware function
const parseData = (req, res, next) => {
  if (req.method === "POST") {
    const formData = {};
    req.on("data", (data) => {
      // Decode and parse data
      const parsedData = decodeURIComponent(data).split("&");

      for (let data of parsedData) {
        decodedData = decodeURIComponent(data.replace(/\+/g, "%20"));

        const [key, value] = decodedData.split("=");

        // Accumulate submitted
        // data in an object
        formData[key] = value;
      }

      // Attach form data in request object
      req.body = formData;
      next();
    });
  } else {
    next();
  }
};

// View engine setup
// app.set("views", path.join(__dirname));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// Render Login form page
app.get("/", (req, res) => {
  res.render("pages/loginForm", { error: null });
});

app.get("/register", (req, res) => {
  res.render("pages/registrationForm", { error: null });
});

// Creating Post Route for login
app.post("/loggedIn", parseData, async (req, res) => {
  // Retrive form data from request object
  const data = req.body;

  console.log("*************************************");
  if (Object.getOwnPropertyNames(data).length === 4) {
    const { username, name, password1, password2 } = data;
    if (!username || !name || !password1 || !password2) {
      return res.render("registrationForm", {
        error: "All fields must be field",
      });
    }

    if (password1 !== password2) {
      return res.render("registrationForm", {
        error: "Password must match",
      });
    }

    const userExists = await checkUser("users.json", { username });
    console.log(userExists);
    if (userExists.length > 0) {
      return res.render("registrationForm", { error: "username exists" });
    }
    register(username, name, password1, password2);
    return res.redirect("/");
  }

  if (Object.getOwnPropertyNames(data).length === 2) {
    const { username, password } = data;
    if (!username || !password) {
      return res.render("registrationForm", {
        error: "password and username do not match!",
      });
    }
    const userToken = await login(username, password);

    if (!userToken) {
      return res.render("loginForm", {
        error: "username and password do not match!!!",
      });
    }
    await storeToken(userToken);
    res.redirect("/dashboard");
  }
});

app.get("/dashboard", async (req, res) => {
  const token = await retrieveToken();
  if (!token) res.redirect("/");
  const user = await verifyToken(token);
  console.log("***", user);
  res.render("pages/dashboard", { user: user });
});

app.get("/logout", async (req, res) => {
  await clearLocalStorage();
  res.redirect("/");
});

// Setting up listener
app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
