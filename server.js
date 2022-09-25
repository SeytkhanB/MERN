
import express from 'express';
const app = express()
import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';

// db and authenticationUser
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';         // <-- don't forget to use ".js" extension
import errorHandlerMiddleware from './middleware/error-handler.js'; // <-- don't forget to use ".js" extension

// it will make the JSON data available to us in the controllers since we will have post requests.
// we will be looking for stuff, that JSON data will be passed through us using the express
app.use(express.json())

app.get('/', (req, res) => {
  // throw new Error('error')   // to check if it gives an error and that's it!
  res.send('Welcome!')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (err) {
    console.log(err)
  }
}
start()