const express=require('express')
const dotenv=require('dotenv')
const rateLimt=require('express-rate-limit')
const cluster=require('cluster')
const os=require('os')
dotenv.config();

if(cluster.isPrimary){
  for(i=1;i<=os.availableParallelism();i++){
    cluster.fork()
  }
  cluster.on('fork',(worker)=>{
    console.log(worker.process.pid);
    
  })
}
else{
const MongoDB=require('./config/db')
const cors=require('cors')
const { log } = require('console')
const app=express(); 
app.use(cors());
app.use(express.json());
MongoDB();


const a=rateLimt({
  windowMs:1000*60*15,
  limit:150,
  massage:'Your limit is expire please try again latter'
})
app.use(a),
// api started

app.use('/register',require('./routes/userRoutes'))
app.use('/api/admin',require('./routes/adminRoutes'))
app.use('/api',require('./routes/skillRoutes'))
// app.use('/api',require('./routes/userRoutes'))
app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/content',require('./routes/contentRoute'))
app.use('/api/public',express.static('public'))
app.use('/api/handshake',require('./routes/handshakeRoute'))
// api end

app.listen(process.env.PORT,()=>{
  console.log("Server is running on http://localhost:5000");
  
})
}










