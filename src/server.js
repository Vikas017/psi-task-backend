require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB connected"))
  .catch(err => {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
/*
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
    app.listen(5000, () => console.log("Server running"));
  })
  .catch(err => console.log(err));*/