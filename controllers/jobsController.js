
import Job from '../models/Job.js';
import {StatusCodes} from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';

// CREATE JOB
const createJob = async (req, res) => {
  const {position, company} = req.body

  if (!position || !company) {
    throw new BadRequestError('Please provide all values!')
  }

  req.body.createdBy = req.user.userId

  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job})
}

// DELETE JOB
const deleteJob = async (req, res) => {
  const {id: jobId} = req.params
  const job = await Job.findOne({_id: jobId})

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }

  checkPermissions(req.user, job.createdBy)

  await job.remove()
  res.status(StatusCodes.OK).json({msg: 'Success! Job removed'})
}

// GET ALL JOBS
const getAllJobs = async (req, res) => {
  // get all jobs
  const jobs = await Job.find({createdBy: req.user.userId})

  res
    .status(StatusCodes.OK)
    .json({jobs, totalJobs: jobs.length, numOfPages: 1})
}

// UPDATE JOB
const updateJob = async (req, res) => {
  const {id: jobId} = req.params
  const {company, position} = req.body

  if (!company || !position) {
    throw new BadRequestError('Please provide all values')
  }

  const job = await Job.findOne({_id: jobId})

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  // check permissions  // without permissions another person can edit our job
                        // if he/she access our id. To prevent this from happening
                        // we have to check permissions
  checkPermissions(req.user, job.createdBy)

  const updatedJob = await Job.findOneAndUpdate({_id: jobId}, req.body, {
    new: true,
    runValidators: true
  })

  res.status(StatusCodes.OK).json({updatedJob})


  // ALTERNATIVE APPROACH THAN ABOVE
  // but in this case for all property we have to pull them out 
  // from "req.body" and sign them ↓
  // job.position = position
  // job.company = company
  // job.jobLocation = jobLocation

  // await job.save()   // this line good when we use hooks. "findOneAndUpdate" is not trigger hooks all together
  // res.status(StatusCodes.OK).json({job})
}

// SHOW STATS
const showStats = async (req, res) => {
  return res.send('show stats')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }