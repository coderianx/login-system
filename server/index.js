const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running!");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Tüm alanlar zorunlu." });

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  db.run(query, [name, email, hashedPassword], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE"))
        return res.status(400).json({ message: "Bu email zaten kayıtlı." });

      return res.status(500).json({ message: "DB hatası." });
    }

    res.json({ message: "Kayıt başarılı!", id: this.lastID });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], async (err, user) => {
    if (err) return res.status(500).json({ message: "DB hatası." });

    if (!user)
      return res.status(400).json({ message: "Email veya şifre hatalı." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Email veya şifre hatalı." });

    res.json({ message: "Giriş başarılı!", userId: user.id });
  });
});

app.listen(5050, () => console.log("🚀 Server 5050 portunda çalışıyor."));
