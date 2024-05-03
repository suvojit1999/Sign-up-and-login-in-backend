import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    pnumber: {type: String},
    date: { type: Date, default: Date.now }
  });


  const userdata = mongoose.model('user', userSchema)
  export default userdata
