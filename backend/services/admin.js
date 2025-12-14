const userModel = require("../models/user");
const adminModel = require("../models/admin");
const subjectModel = require("../models/subject");
const { hashPassword } = require("./tool");

/* ===== REAL METHODS ===== */

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
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
};

const adminDetails = async (req, res) => {
  res.json({ success: true, user: req.user });
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

/* ===== STUBS (CRITICAL) ===== */

const addSubject = (req, res) =>
  res.status(501).json({ success: false, message: "Not implemented" });

const subjectRemove = (req, res) =>
  res.status(501).json({ success: false, message: "Not implemented" });

const unblockSubject = (req, res) =>
  res.status(501).json({ success: false, message: "Not implemented" });

const getDashboardCount = (req, res) =>
  res.status(501).json({ success: false, message: "Not implemented" });

/* ===== EXPORTS (MUST MATCH ROUTES) ===== */

module.exports = {
  teacherRegister,
  adminDetails,
  addAdminIfNotFound,
  addSubject,
  subjectRemove,
  unblockSubject,
  getDashboardCount
};
