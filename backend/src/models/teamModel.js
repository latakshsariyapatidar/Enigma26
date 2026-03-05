import mongoose from "mongoose";
import validator from "validator";

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
  passwordConfirm: {
    type: String,
    required: [true, `Please confirm your password!`],
    //this only works on SAVE or CREATE -- So whenever we want to update a user's credentials this validation wont work
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "The passwords don't match, Please re-enter the passwords.",
    },
  },
  changedPasswordAt: Date,
  createdAt: Date,
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["admin", "participant"],
    default: "participant",
  },
});

const Team = mongoose.model("Team", teamSchema);
export default Team;
