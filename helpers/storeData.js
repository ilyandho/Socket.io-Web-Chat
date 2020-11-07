const fs = require("fs");

const storeData = async (data, path) => {
  console.log("storing data");
  try {
    fs.writeFileSync(path, JSON.stringify(data));
    const storedData = fs.readFileSync(path, "utf8");
    console.log("stored now: ", storedData);
  } catch (error) {
    console.error(error);
  }
};

const loadData = (path) => {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    console.error(err);
    return false;
  }
};

const checkUser = async (path, userObj) => {
  console.log("***checking user");
  const users = await JSON.parse(loadData(path));

  const user = users.filter((item) => item.username === userObj.username);
  console.log(user);
  return user;
};
module.exports = { storeData, loadData, checkUser };
