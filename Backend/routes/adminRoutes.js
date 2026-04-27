const express = require("express");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Content = require("../models/ContentSkill");
const Skill = require("../models/Skills");
const routes = express.Router();
const jwt = require("jsonwebtoken");

// Register
routes.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await Admin.findOne({ email });

    if (data) {
      return res.json({ msg: "Duplicate email" });
    }

    const user = new Admin(req.body); 
    await user.save();

    res.json({ msg: "Registered successfully" });
  } catch (er) {
    console.error(er);
    res.json({ msg: "Sorry, try again" });
  }
});

// Login
routes.post("/login", async (req, res) => { 
  try {
    const { email, password } = req.body;
    const isExit = await Admin.findOne({ email });

    if (!isExit) {
      return res.json({ msg: "Data not Match" });
    }

    if (isExit.password === password) {
      const token = jwt.sign(
        { id: isExit._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        msg: "Login Successfully",
        data: {
          token,
          email: isExit.email,
          id: isExit._id,
          role: "admin"
        }
      });
    } else {
      res.json({ msg: "Incorrect Password" });
    }
  } catch (er) {
    console.error(er);
    res.json({ msg: "Sorry, try again" });
  }
});

// ================= NEW ADMIN DASHBOARD STATS ROUTE =================
routes.get("/dashboard-stats", async (req, res) => {
  try {
  
    const totalUsers = await User.countDocuments();

    const totalLearners = await User.countDocuments({ role: "Learner" });

    
    const totalTrainers = await User.countDocuments({ role: "Trainer" });

   
    const totalSkills = await Skill.countDocuments();

    res.json({
      msg: "Stats fetched successfully",
      data: {
        totalUsers,
        totalLearners,
        totalTrainers,
        totalSkills
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while fetching stats" });
  }
});



// ================= GET ALL USERS (With Search & Filter) =================
routes.get("/users", async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};

 
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    
    res.json({ msg: "Users fetched successfully", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while fetching users" });
  }
});

// ================= DELETE USER =================
routes.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while deleting user" });
  }
});
// ================= GET ALL CONTENT (With Search) =================
routes.get("/content", async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    // अगर सर्च कर रहे हैं तो पहले Skills collection में ढूंढो
    if (search) {
      const matchedSkills = await Skill.find({ 
        skill: { $regex: search, $options: "i" } 
      }).select('_id');

      const skillIds = matchedSkills.map(s => s._id);
      
      // अगर कोई स्किल मैच नहीं हुई तो empty array भेज दो
      if (skillIds.length === 0) {
        return res.json({ msg: "Content fetched successfully", data: [] });
      }

      // जो स्किल्स मैच हुईं, उनके आधार पर Content निकालो
      query.skillId = { $in: skillIds };
    }

    const contentData = await Content.find(query)
      .populate('skillId', 'skill description') // Skill का नाम और description लाओ
      .populate('userId', 'name email')         // Trainer का नाम और email लाओ
      .sort({ createdAt: -1 });

    res.json({ msg: "Content fetched successfully", data: contentData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while fetching content" });
  }
});

// ================= DELETE CONTENT =================
routes.delete("/content/:id", async (req, res) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);
    
    if (!deletedContent) {
      return res.status(404).json({ msg: "Content not found" });
    }
    
    res.json({ msg: "Content deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while deleting content" });
  }
});
// ================= CHANGE PASSWORD =================
routes.patch("/change-password", async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Admin को ID से ढूंढो
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // पुराना पासवर्ड मैच करो (प्लेन टेक्स्ट के अनुसार)
    if (admin.password !== currentPassword) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // नए पासवर्ड की लंबाई चेक करो
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "New password must be at least 6 characters" });
    }

    // पासवर्ड अपडेट करो
    admin.password = newPassword;
    await admin.save();

    res.json({ msg: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while changing password" });
  }
});
// =================================================================

module.exports = routes;