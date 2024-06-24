const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/read", async (req, res) => {
  let allusers = await userModel.find();
  res.render("read", { users: allusers });
});

app.get("/edit/:userid", async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.userid });
  res.render("edit", { user });
});

app.post("/update/:userid", async (req, res) => {
  let { name, email, image } = req.body;
  let user = await userModel.findOneAndUpdate(
    { _id: req.params.userid },
    { image, name, email },
    { new: true }
  );
  res.redirect("/read");
});

app.post("/create", async (req, res) => {
  try {
    let { name, email, image } = req.body; // Ensure 'image' is the correct field name

    let createdUser = await userModel.create({
      name,
      email,
      image,
    });

    res.redirect("/read");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/delete/:id", async (req, res) => {
  let users = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
