const express=require('express')
const User=require('../models/User')
const routes=express.Router();
const jwt =require('jsonwebtoken')
const sendEmail=require('../utils/Email')
const verifyToken=require('../middleware/verifyToken')
//For User Registation
routes.post('/',async(req,res)=>{
  try{
    const {name,email,password,qualification,role}=req.body;
    const user=await User.findOne({email:email});
    if(user){
      return res.json({msg:"User Alrady Registered"})
    }
    const data=await new User({
      name:name,
      email:email,
      password:password,
      qualification:qualification,
      role:role
    })
    data.save();
    res.json({msg:"user registered Successfully"})
    //
    let a=`
    <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Registration Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
  <tr>
    <td align="center">
      
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
        
        <!-- Header -->
        <tr>
          <td style="background:#4a90e2; padding:20px; text-align:center; color:#ffffff;">
            <h2 style="margin:0;">e-Studu-Zone</h2>
            <p style="margin:5px 0 0;">Welcome to your learning journey</p>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding:30px; color:#333;">
            
            <h3 style="margin-top:0;">Hello {{name}},</h3>
            
            <p>Thank you for registering on <strong>e-Studu-Zone</strong>. Your account has been successfully created.</p>
            
            <p><strong>Your Details:</strong></p>
            <ul>
              <li><strong>Username:</strong> {{username}}</li>
              <li><strong>Email:</strong> {{email}}</li>
            </ul>
            
            <p>You can now log in using the button below:</p>
            
            <!-- Button -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:20px 0;">
              <tr>
                <td align="center" bgcolor="#4a90e2" style="border-radius:5px;">
                  <a href="{{login_url}}" target="_blank" 
                     style="display:inline-block; padding:12px 25px; font-size:16px; color:#ffffff; text-decoration:none;">
                     Login to Your Account
                  </a>
                </td>
              </tr>
            </table>
            
            <p>Please keep your login credentials secure. If you did not create this account, please contact us immediately.</p>
            
            <p>If you have any questions, feel free to reach out at <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
            
            <p>Best regards,<br><strong>Team e-Studu-Zone</strong></p>
            
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#777;">
            © {{year}} e-Studu-Zone. All rights reserved.<br>
            <a href="{{website_url}}" style="color:#4a90e2; text-decoration:none;">Visit Website</a>
          </td>
        </tr>
        
      </table>
      
    </td>
  </tr>
</table>

</body>
</html>`;
    setTimeout(()=>{
      sendEmail("Registation On E-study-zone",email,a)
    },100)
  }
  catch(er){
    console.log(er);
    res.json("user Not Registered")
    
  }
//get user by user id





});
// update user by id
// update user by id
routes.put('/update/:id', async (req, res) => {
  try {
    const { name, qualification } = req.body; // only editable fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, qualification },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.json({ msg: "User not found" });
    }

    res.json({ msg: "User updated successfully", data: updatedUser });
  } catch (er) {
    console.log(er);
    res.json({ msg: "Error updating user" });
  }
});


routes.get('/getuser/:id',async(req,res)=>{
  try{
  const data=await User.findById(req.params.id).select('name email role qualification')
  return res.json({msg:"data fetced",data:data})
  }
  catch(er){
    console.log(er);
    res.json({msg:"User not Fetced"})
    
  }
})
//get all user
routes.get('/getuser',verifyToken,async(req,res)=>{
  try{
  const data=await User.find({status:'active'}).lean()
  return res.json({msg:"data fetced",data:data})
  }
  catch(er){
    console.log(er);
    res.json({msg:"User not Fetced"})
    
  }
})
//get all inactive user
routes.get('/getuser/all/inactive',async(req,res)=>{
  try{
  const data=await User.find({status:'inactive'})
  }
  catch(er){
    console.log(er);
    res.json({msg:"User not Fetced"})
    
  }
})
//routes for block the user
routes.get('/block/:id',async(req,res)=>{
  try{
  const data=await User.findByIdAndUpdate(req.params.id,{status:'inactive'})
    res.json({msg:"User Block Successfully"})
  }
  catch(er){
    console.log(er);
    res.json({msg:"Sorry try again later"})
    
  }
})

// routes for ub block the user
routes.get('/unblock/:id',async(req,res)=>{
  try{
  const data=await User.findByIdAndUpdate(req.params.id,{status:'active'})
    res.json({msg:"User unblock Successfully"})
  }
  catch(er){
    console.log(er);
    res.json({msg:"Sorry try again later"})
    
  }
})
routes.post('/login',async(req,res)=>{
  try{
  const{email,password}=req.body;
  const data=await User.findOne({email:email});
  if(!data){
    return  res.json({msg:"Invalid Email"})
  }
  if(data.password==password){
    const token=jwt.sign({id:data._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.json({msg:"Login Successfully",data:{
      token,
      id:data._id,
      role:data.role,
      email:data.email,
      name:data.name
    }})
  }
  else{
    return res.json({msg:"Password Incroct"})
  }
}
catch(er){
console.log(er);
res.json({msg:"Sorry Try again"})
}})

// POST: change password
routes.post('/change-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = req.body;

    // check confirm password
    if (newPassword !== confirmPassword) {
      return res.json({ msg: "New password and confirm password do not match" });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ msg: "User not found" });
    }

    // check old password 
    if (user.password !== oldPassword) {
      return res.json({ msg: "Old password is incorrect" });
    }

    // update password
    user.password =confirmPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (er) {
    console.log(er);
    res.json({ msg: "Server error" });
  }
});
// get trainer only
routes.get('/getuser/trainer/get', async (req, res) => {
    try {
        const data = await User.find({ role: "Trainer" })
        res.json({ msg: "user fetched", data: data })
    }
    catch (er) {
        console.log(er);
        res.json({ msg: "user not fetched" })

    }
})
routes.get("/count", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ msg: "Total users fetched successfully", totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error counting users" });
  }
});

// Count users by role (Trainer / Learner)
routes.get("/count/:role", async (req, res) => {
  try {
    const role = req.params.role;
    const count = await User.countDocuments({ role });
    res.json({ msg: `Total ${role}s fetched successfully`, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error counting users by role" });
  }
});



module.exports=routes;