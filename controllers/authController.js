import userModel from "../models/userModel.js";

export const registerController = async(req,res,next) => {
const {name , email, password} = req.body;

if (!name){
    next ("name is required");

}
if(!email){
    next("password is required and greater than 4 characters");

}
const exisitingUser = await userModel.findOne({ email });
if(exisitingUser){
    next("Email already exist")
}
const user = await userModel.create({name , email, password});
resizeBy.status(201).send({
    success: true,
    message: "User Created Successfully",
    user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
    },
    token,
});
};

export const LoginController = async(req,res,next) =>{
    const{email,password} = req.body;
    if(!email|| !password){
        next("Invalid Username or password");
    }
    // compare Password
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        next("Invalid Username or password");
    }
    user.password = undefined;
    const token = user.createJWT();
    res.status(200).json({
        success :true,
        message:"Login Successful" ,
        user,
        token,
    });
};