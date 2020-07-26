const path = require("path");

console.log(path.join(__dirname, "../models/user"));
const User = require(path.join(__dirname, "../models/user"));

console.log("In the dashboard");
console.log(User.id);
