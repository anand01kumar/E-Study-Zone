const express = require('express');
const Skill = require('../models/Skills');
const routes = express.Router();

// POST: add skill
routes.post('/skillss', async (req, res) => {
  try {
    const { skill, description, userId } = req.body;
    if (!skill || !description || !userId) {
      return res.status(400).json({ msg: "Skill, description, and userId are required" });
    }

    const existing = await Skill.findOne({ skill, userId });
    if (existing) {
      return res.json({ msg: "Skill already exists for this user" });
    }

    const newSkill = new Skill({ skill, description, userId });
    await newSkill.save();
    res.json({ msg: "Skill saved successfully", data: newSkill });
  } catch (er) {
    console.error(er);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET: fetch all skills (admin/debug only)
routes.get('/skillss', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (er) {
    console.error(er);
    res.status(500).json({ msg: "Error fetching skills" });
  }
});

// GET: fetch skills by userId
routes.get('/getskill/:id', async (req, res) => {
  try {
    const data = await Skill.find({ userId: req.params.id });
    res.json({ msg: "Successfully fetched skills", data });
  } catch (er) {
    console.error(er);
    res.status(500).json({ msg: "Error fetching skills" });
  }
});

// DELETE: remove skill by id
routes.delete('/skillss/:id', async (req, res) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Skill not found" });
    res.json({ msg: "Skill deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting skill" });
  }
});

module.exports = routes;
