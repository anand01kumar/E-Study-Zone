const express = require('express');
const routes = express.Router();
const Handshake = require('../models/Handshake');

// Send request
routes.post('/request/:id', async (req, res) => {
  const { learnerId, status } = req.body;

  if (!learnerId || !status) {
    return res.status(400).json({ msg: "LearnerId and status are required" });
  }

  try {
 
    const alreadyAccepted = await Handshake.findOne({
      trainerId: req.params.id,
      learnerId: learnerId,
      status: "accepted"
    });

    if (alreadyAccepted) {
      return res.status(400).json({ msg: "You are already connected to this trainer." });
    }

    
    const alreadyPending = await Handshake.findOne({
      trainerId: req.params.id,
      learnerId: learnerId,
      status: "pending"
    });

    if (alreadyPending) {
      return res.status(400).json({ msg: "Request is already pending with this trainer." });
    }

    const handshake = new Handshake({
      trainerId: req.params.id,
      learnerId,
      status
    });
    await handshake.save();
    res.json({ msg: "Request sent successfully", data: handshake });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get requests for trainer
routes.get('/:id', async (req, res) => {
  try {
    const data = await Handshake.find({ trainerId: req.params.id })
      .populate('learnerId', 'name email');
    if (!data.length) {
      return res.json({ msg: "No requests found", data: [] });
    }
    res.json({ msg: "Requests fetched successfully", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Accept request
routes.patch('/accept/:id', async (req, res) => {
  try {
    const data = await Handshake.findByIdAndUpdate(req.params.id, { status: "accepted" }, { new: true });
    if (!data) return res.status(404).json({ msg: "Request not found" });
    res.json({ msg: "Request accepted", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Reject request
routes.patch('/reject/:id', async (req, res) => {
  try {
    const data = await Handshake.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!data) return res.status(404).json({ msg: "Request not found" });
    res.json({ msg: "Request rejected", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// learner handshake status
routes.get('/handshake/learner/:id', async (req, res) => {
  try {
    const data = await Handshake.find({ learnerId: req.params.id })
      .populate('trainerId', 'name email');
    res.json({ msg: "Fetched learner handshakes", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = routes;