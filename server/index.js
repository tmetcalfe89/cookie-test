const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const { PORT = 3000 } = process.env;

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
app.use(cookieParser());
app.use(cors({
  origin: 'https://tmetcalfe89.github.io',
  credentials: true,
}));

app.post("/api/users/login", (req, res) => {
  const credentials = req.body;

  const foundUser = users.find(({ username, password }) => credentials.username === username && credentials.password === password);
  if (!foundUser) {
    res.sendStatus(400);
    return;
  }

  res.cookie("authToken", foundUser.id, {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: "none",
    secure: true
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

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log("I'm alive");
});