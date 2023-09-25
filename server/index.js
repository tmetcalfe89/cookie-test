const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const users = [
  {
    username: "test",
    password: "test",
    id: "abc"
  }
]

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())

app.post("/api/users/login", (req, res) => {
  const credentials = req.body;

  const foundUser = users.find(({ username, password }) => credentials.username === username && credentials.password === password);
  if (!foundUser) {
    res.sendStatus(400);
    return;
  }

  res.cookie("authToken", foundUser.id, {
    path: "/",
    httpOnly: true,
    maxAge: 3600000
  });
  res.sendStatus(200);
});

app.get("/api/users/check", (req, res) => {
  console.log(req.cookies);
  // const { authToken } = req.cookies || {};
  const authToken = req.cookies.authToken;

  const foundUser = users.find(({ id }) => id === authToken);
  if (!foundUser) {
    res.sendStatus(400);
    return;
  }

  res.json({ username: foundUser.username });
})

app.get("/api/users/logout", (req, res) => {
  res.clearCookie("authToken");
  res.sendStatus(200);
})

app.use("*", () => {

});

app.listen(3000, () => {
  console.log("I'm alive");
});