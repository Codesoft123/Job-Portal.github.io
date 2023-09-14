import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
// schema
const userschema = new mongoose.Schema(
    {
    name: {
            type : String,
            require:[true,"name is Require"],
    },
    lastName:{
        type:String ,
    },
    email:{
        type:String,
        require:[true,"email is require"],
        unique: true,
        validator: validator.isEmail,
    },
    password:{
        type:String,
        require:[true,"password is require"],
        minlength:[6,"password length should be greater than 6 character"],
        select: true,
    },
    location:{
        type: String,
        default: "India",
    },
},
{timestamps: true}
    );
    // middelware
    userschema.pre("save", async function(){
        if(!this.isModified)return;
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    });
    // compare password
    userschema.methods.comparePassword = async function(userPassword){
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    };
    // json webtoken
    userschema.methods.createJWT = function(){
        return JWT.sign({userId: this._id}, process.env.JWT_SECRET,{
            expiresIn:"Id",
        });
    };

    export default mongoose.model("User", userschema);