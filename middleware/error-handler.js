
// This function should recieve 4 parameters "err, req, res, next". Don't forget them!
const errorHandlerMiddleware = (err, req, res, next) => {
  res.status(500).json({ msg: 'there was an error' })
}
export default errorHandlerMiddleware