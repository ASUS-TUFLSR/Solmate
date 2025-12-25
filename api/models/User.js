import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["male", "female"]
    },
    genderPreference:{
        type:String,
        required:true,
        enum:["male", "female"]
    },
    bio:{
        type:String,
        default: ""
    },
    image:{
        type:String,
        default: ""
    },
    likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    }],
    dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    }],
    matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    }],
    
}, {timestamps: true});

userSchema.pre("save", async function () {
    
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
