const userModel = require("../models/user");
const subjectModel = require("../models/subject");
const adminModel = require("../models/admin");
const { hashPassword } = require("./tool");

const teacherRegister = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.json({ success: false, message: "Invalid input" });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hash = await hashPassword(password);

    await userModel.create({
      username,
      email,
      password: hash,
      usertype: "TEACHER",
      createdBy: req.user._id
    });

    res.json({ success: true, message: "Teacher created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

const adminDetails = async (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      username: req.user.username
    }
  });
};

const addAdminIfNotFound = async () => {
  const count = await adminModel.countDocuments();
  if (count === 0) {
    await adminModel.create({
      username: "admin",
      password: await hashPassword("admin123")
    });
    console.log("✅ Default admin created");
  }
};

module.exports = {
  teacherRegister,
  adminDetails,
  addAdminIfNotFound
};
