const userModel = require("../models/user");
const adminModel = require("../models/admin");
const { hashPassword } = require("./tool");

const teacherRegister = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false });
    }

    const { username, password, email } = req.body;
    const hash = await hashPassword(password);

    await userModel.create({
      username,
      email,
      password: hash,
      usertype: "TEACHER",
      createdBy: req.user._id
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

const adminDetails = async (req, res) => {
  res.json({
    success: true,
    user: req.user
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
