
const createJob = async (req, res) => {
  return res.send('create job')
}
const deleteJob = async (req, res) => {
  return res.send('delete job')
}
const getAllJobs = async (req, res) => {
  return res.send('get all jobs')
}
const updateJob = async (req, res) => {
  return res.send('update job')
}
const showStats = async (req, res) => {
  return res.send('show stats')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }