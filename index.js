const express = require("express");
const {Db}=require("mongodb")
const mongoose = require('mongoose');
const cors = require('cors')

const port = process.env.PORT || 4000
let app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded())

let connectdb = ()=>{
    mongoose.connect("mongodb+srv://user:user@kartik.exjuu.mongodb.net/?retryWrites=true&w=majority")
}

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
})

const User = new mongoose.model("User",userSchema)

app.get('/users',async(req,res)=>{
    try {
        let user = await User.find({}).lean().exec()
        return res.status(201).send({user:user})
    } catch (error) {
        res.status(401).send({error:error.message})
    }
})


app.post('/login',(req,res)=>{
    const {email , password} = req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
           if(password === user.password){
            res.send({message:"Login Successfull" , user:user})
           }else{
            res.send({message:"Password doesn't match"})
           }
        }else{
            res.send({message:"User not found"})
        }
    })
})

app.post('/register',async(req,res)=>{
    const {name , email , password} = req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"User Already registerd"})
        }else{
            const user = new User({
                name,
                email,
                password,
            })
            user.save(err =>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"Sucessfully Registered"})
                }
            })
        }
    })
   
})


app.listen(port,async()=>{
 try {
    await connectdb()
 } catch (error) {
    console.log(error)
 }
 console.log("This is port 4000")
})
