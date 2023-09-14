import jobsModel from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";
import jobModel from "../models/jobModel.js";
// ====== create job ======
export const createjobController = async(req,res,next) => {
    const {company , position } = req.body;
    if(!company || !position){
        next("please provide all  fields");
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({job});
};

// ==== GET JOB =====
export const getAllJobsController = async(req , res, next) => {
    const {status , workType , search , sort} = req.query;
    // condition for searching filters
    const queryObject = {
        createdBy: req.user.userId,
    };
    // logic filters
    if (status && status !== "all"){
        queryObject.status = status;
    }
    if(workType && workType  !== "all")
    {
        queryObject.status = status;
    }
    if(search){
        queryObject.workType = workType;
    }
    if(search){
        queryObject.position = {$regex: search, $option: "i"};
    }
    let queryResult = jobsModel.find(queryObject);

    if(sort ===  "latest"){
        queryResult = queryResult.sort("-createdAt");
    }
    if(sort === "oldest"){
        queryResult = queryResult.sort("createdAt");
    }
    if(sort === "a-z"){
        queryResult = queryResult.sort("position");
    }
    if(sort === "z-a"){
        queryResult = queryResult.sort("-position");
    }
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);
    // jobs count
    const totalJobs = await jobModel.countDocuments(queryResult);
    const numofPage = Math.ceil(totalJobs /limit);
    const jobs = await queryResult;
    // const jobs = await jobModel.find({createdby : req.user.userId })
    res.status(200).json({
        totalJobs,
        jobs,
        numofPage,
    });
};

// ======= updated jobs ========
export const updateJobController = async (req, res, next) => {
    const{id} = req.params;
    const {company, position} = req.body;
    // validation
    if(!company || !position){
        next("please provide All fields");
    }
    // find job
    const job = await jobsModel .findOne({ _id: id });
    // validation
    if(!job){
        next('no jobs found with this id ${id}');
    }
    if(!req.user.userId === job.createdAt.toString()){
        next(`you are not authorized to edit this post`);
        return;
    }
    const updateJob = await jobsModel.findOneAndUpdate({_id: id }, req.body,{
        new: true,
        runvalidators : true,
    });
    // res
    res.status(200).json({updateJob});
};
// ======= DELETE JOBS =========
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;
    //find job
    const job = await jobsModel.findOne({ _id: id });
    //validation
    if (!job) {
      next(`No Job Found With This ID ${id}`);
    }
    if (!req.user.userId === job.createdBy.toString()) {
      next("Your Not Authorize to delete this job");
      return;
    }
    await job.deleteOne();
    res.status(200).json({ message: "Success, Job Deleted!" });
  };
  // =======  JOBS STATS & FILTERS ===========
export const jobStatsController = async (req, res) => {
    const stats = await jobsModel.aggregate([
      // search by user jobs
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };
  //monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totlaJob: stats.length, defaultStats, monthlyApplication });
};
