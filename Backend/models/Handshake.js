const mongoose=require('mongoose')
const handShakeSchema=mongoose.Schema({
trainerId:{
  type:mongoose.Schema.ObjectId,
  ref:"User"
},
learnerId:{
  type:mongoose.Schema.ObjectId,
  ref:"User"
},
 status:{
    type:String,
    enum:['pending','reject','accepted'],
    default:'pending'
  }


 
})
module.exports = mongoose.model("Handshake",handShakeSchema)