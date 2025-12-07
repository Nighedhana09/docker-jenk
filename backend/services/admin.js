var userModel = require('../models/user');
var subjectModel = require('../models/subject');
var tool = require('./tool');
const adminModel = require('../models/admin');
const { hashPassword } = require('../services/tool');

// Wrap all handlers with try/catch
var teacherRegister = async (req,res) => {
    try {
        var creator = req.user || null;
        req.check('username','Invalid name').notEmpty();
        req.check('email','Invalid Email Address').isEmail().notEmpty();
        req.check('password','Invalid Password').isLength({min: 5, max: 20});
        var errors = req.validationErrors();
        
        if(!creator) return res.status(401).json({ success:false, message:"Permissions not granted!" });
        if(errors) return res.json({ success:false, message:"Invalid inputs", errors });

        var { username, password, email } = req.body;
        let user = await userModel.findOne({email});
        if(user) return res.json({ success:false, message:"This email already exists!" });

        let hash = await tool.hashPassword(password);
        let newUser = new userModel({
            username, password: hash, email, usertype: 'TEACHER', createdBy: creator._id
        });
        await newUser.save();
        res.json({ success:true, message:"Profile created successfully!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success:false, message:"Unable to register profile" });
    }
}

var userRemove = async (req,res) => {
    try {
        if(!req.user) return res.status(401).json({ success:false, message:"Permissions not granted!" });
        await userModel.findOneAndUpdate({ _id: req.body._id }, { status:false });
        res.json({ success:true, message:"Account has been removed" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success:false, message:"Unable to remove account" });
    }
}

var unblockUser = async (req,res) => {
    try {
        if(!req.user) return res.status(401).json({ success:false, message:"Permissions not granted!" });
        await userModel.findOneAndUpdate({ _id: req.body._id }, { status:true });
        res.json({ success:true, message:"Account has been unblocked" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success:false, message:"Unable to unblock account" });
    }
}

var adminDetails = async (req,res) => {
    try {
        if(req.user) {
            res.json({ success:true, user:{ username:req.user.username, _id:req.user._id } });
        } else {
            res.json({ success:false, user:{} });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ success:false, message:"Internal Server Error" });
    }
}

// Similar pattern for addSubject, subjectRemove, unblockSubject, getDashboardCount
// Wrap all in try/catch and always return JSON

module.exports = { 
    teacherRegister, 
    userRemove, 
    unblockUser, 
    adminDetails, 
    addSubject: async function(req,res){ try{ /* your code */ } catch(e){ console.error(e); res.status(500).json({success:false}) } }, 
    subjectRemove: async function(req,res){ try{ /* your code */ } catch(e){ console.error(e); res.status(500).json({success:false}) } },
    unblockSubject: async function(req,res){ try{ /* your code */ } catch(e){ console.error(e); res.status(500).json({success:false}) } },
    getDashboardCount: async function(req,res){ try{ /* your code */ } catch(e){ console.error(e); res.status(500).json({success:false}) } },
    addAdminIfNotFound: async function(){ try{ /* your code */ } catch(e){ console.error(e); } }
}
