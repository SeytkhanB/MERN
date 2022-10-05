
import Job from '../models/Job.js';
import {StatusCodes} from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';

const createJob = async (req, res) => {
  const {position, company} = req.body

  if (!position || !company) {
    throw new BadRequestError('Please provide all values!')
  }

  req.body.createdBy = req.user.userId

  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job})
}


const deleteJob = async (req, res) => {
  return res.send('delete job')
}


const getAllJobs = async (req, res) => {
  // get all jobs
  const jobs = await Job.find({createdBy: req.user.userId})

  res
    .status(StatusCodes.OK)
    .json({jobs, totalJobs: jobs.length, numOfPages: 1})
}


const updateJob = async (req, res) => {
  return res.send('update job')
}
const showStats = async (req, res) => {
  return res.send('show stats')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }