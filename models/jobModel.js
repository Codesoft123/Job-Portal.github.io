import mongoose from "mongoose";

const Jobschema = new mongoose.Schema({
    company:{
        type:String,
        require:[true,'Company name is required'],
    },
    position:{
        require:[true,'job position is require'],
        minlength:100
    },
    status:{
        type : String ,
        enum:['pending','reject','interview'],
        default :'pending'
    },
    Worktype: {
        type:String,
        enum:['full-time', 'part-time','internship','contract'],
        default:'full-time'
    },
    WorkLocation:{
        type: String,
        enum:'Mumbai',
        require:[true,'Work location is require']
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
export default mongoose.model('job',Jobschema)