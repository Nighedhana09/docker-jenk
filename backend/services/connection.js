const mongoose = require("mongoose");
const config = require("config");
const adminService = require("./admin");

mongoose.Promise = global.Promise;

mongoose.connect(
  config.get("mongodb.connectionString"),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    maxPoolSize: 10
  }
).then(() => {
  console.log("✅ Connected to MongoDB");
  adminService.addAdminIfNotFound();
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

module.exports = mongoose;
