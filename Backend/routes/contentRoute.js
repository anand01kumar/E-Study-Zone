const express = require('express')
const routes = express.Router();
const Content = require('../models/ContentSkill');
const Handshake = require('../models/Handshake')
const path = require('path')
const multer = require('multer')
const upload = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, path.join("./public/uploads/"))
  },
  filename:(req,file,cb)=>{
    
    cb(null,file.originalname)
  }
});
const uploadFile = multer({storage:upload})

routes.post('/upload',uploadFile.single('content'),async(req,res)=>{
  try{
    const {skillId , content,userId} = req.body;
    const data = await new Content({
      skillId:skillId,
      file:req.file.path,
      userId:userId
    })
    data.save();
    res.json({msg:"Content Uploaded Successfully"})
  }catch(er){
    console.log(er);
    res.json({msg:"Server error"})
    
  }
  
})// get content by userId
routes.get('/get/:id', async (req, res) => {
  try {
    const data = await Content.find({ userId: req.params.id }).populate('skillId') // use find instead of findOne
      
    res.json({ msg: "Successfully fetched content", data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Sorry, try again" })
  }
})

// delete content bu id

routes.delete('/delete/:id', async (req, res) => {
  try {
    const data = await Content.findByIdAndDelete( req.params.id )
      
    res.json({ msg: "Successfully Delete Content",})
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Sorry, try again" })
  }
})

// search content api's

// search content api's
routes.post('/search', async (req, res) => {
  const { query, learnerId } = req.body; // include learnerId in request
  if (!query || query.trim() === "") {
    return res.status(400).json({ msg: "Search query is required" });
  }

  try {
    const data = await Content.find().populate("skillId").populate("userId");
    const result = [];

    for (let item of data) {
      if (item.skillId.skill.toLowerCase() === query.toLowerCase()) {
        // check if handshake exists
        const handshake = await Handshake.findOne({
          learnerId,
          trainerId: item.userId._id
        });

        result.push({
          ...item.toObject(),
          handshakeStatus: handshake ? handshake.status : null
        });
      }
    }

    if (!result.length) {
      return res.status(404).json({ msg: "No content found for this skill", data: [] });
    }

    res.json({ msg: "Search successful", data: result });
  } catch (er) {
    console.error(er);
    res.status(500).json({ msg: "Server error" });
  }
});


// handshake request route (example)
routes.post('/handshake/request/:trainerId', async (req, res) => {
  const { learnerId, status } = req.body;
  if (!learnerId || !status) {
    return res.status(400).json({ msg: "LearnerId and status are required" });
  }

  try {
    const handshake = new Handshake({
      learnerId,
      trainerId: req.params.trainerId,
      status
    });
    await handshake.save();
    res.json({ msg: "Handshake request sent successfully", data: handshake });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


routes.get('/getcontent/:id', async (req, res) => {
  try {
    // Find all accepted handshakes for this learner
    const handshakes = await Handshake.find({ learnerId: req.params.id, status: "accepted" });

    if (!handshakes.length) {
      return res.json({ msg: "No accepted handshakes found", data: [] });
    }

    // Collect trainerIds from all accepted handshakes
    const trainerId = handshakes.map(h => h.trainerId);

    // Fetch all content for those trainers
    const contents = await Content.find({ userId: { $in: trainerId } }).populate("skillId").populate("userId", "name email");;

    res.json({ msg: "Content fetched successfully", data: contents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

routes.get("/count/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const count = await Content.countDocuments({ userId });
    res.json({ msg: "Trainer content count fetched successfully", count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error counting trainer content" });
  }
});

module.exports = routes
