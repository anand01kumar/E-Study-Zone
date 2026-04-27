const nodemailer=require('nodemailer')
const transport=nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:587,
  auth:{
    user:process.env.EMAIL,
    pass:process.env.PASS

  }
})
const sendEmail=async(subject,to,body)=>{
  await transport.sendMail({
    from:`E-Study-Zone <${process.env.EMAIL}>`,
    to:to,
    subject:subject,
    html:body
  })
}

module.exports=sendEmail;