require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidV4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { LocalStorage } = require("node-localstorage");

const { checkUser, storeData, loadData } = require("./storeData");
const register = async (username, name, password1, password2) => {
  console.log(">4 *************************************");
  // This is a registration

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password1.trim(), salt);

  const newUser = {
    id: uuidV4(),
    name,
    username,
    hashPass,
  };
  let newUsersArray = [];
  let usersArray = await loadData("users.json");

  if (!usersArray) {
    console.log(newUser);
    newUsersArray.push(newUser);
  } else {
    usersArray = JSON.parse(usersArray);
    newUsersArray = [...usersArray, newUser];
  }

  const storedUser = await storeData(newUsersArray, "users.json");

  console.log(storedUser);
};

const login = async (username, password) => {
  const userArray = await checkUser("users.json", { username, password });
  const user = userArray[0];
  if (!bcrypt.compare(password, user.hashPass)) {
    return null;
  }

  const userDetails = {
    id: user.id,
    name: user.name,
    username: user.username,
  };

  // const s

  const token = await jwt.sign(userDetails, process.env.SECRET);

  return token;
};

const storeToken = async (token) => {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }

  localStorage.setItem("token", token);
};

const retrieveToken = async () => {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }

  return await localStorage.getItem("token");
};

const verifyToken = async (token) => {
  const user = await jwt.verify(
    token,
    process.env.SECRET,
    (err, decoded) => decoded
  );
  return user;
};

module.exports = { register, login, storeToken, retrieveToken, verifyToken };
