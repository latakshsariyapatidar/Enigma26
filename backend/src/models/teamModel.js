import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `A team must have a name -- please provide a name`],
    unique: true,
  },
  email: {
    type: String,
    required: [true, `Please enter an email address`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `please enter a valid email address..`],
  },
  password: {
    type: String,
    required: [true, `Please enter a password`],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "participant"],
    default: "participant",
  },
  refreshToken:{
        type:String
  },
  activeSessionId:{
        type:String
  },
});



teamSchema.pre("save",async function (){
     if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10) 
});

teamSchema.methods.isPasswordCorrect = async function (Password) {
  return await bcrypt.compare(Password, this.password);
};

teamSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name,
        role:this.role,
        sessionId:this.activeSessionId
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

teamSchema.methods.generateSessionId=function(){
    this.activeSessionId = crypto.randomUUID();
    return this.activeSessionId;
}

teamSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


const Team = mongoose.model("Team", teamSchema);
export default Team;
