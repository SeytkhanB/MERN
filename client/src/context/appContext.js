
import {useContext, useReducer, createContext} from 'react';
import { 
  DISPLAY_ALERT, 
  CLEAR_ALERT,

  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,

  TOGGLE_SIDEBAR,
  LOGOUT_USER,
    
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,

  HANDLE_CHANGE,
  CLEAR_VALUES,

  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,

  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,

  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,

  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,

} from './actions';
import reducer from './reducer';
import axios from 'axios';


const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')

const initialState = {
  showSidebar: false,
  showAlert: false,
  isLoading: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  
  // We use these two lines when we edit job
  editJobId: '',
  isEditing: false,
  
  company: '',
  position: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['Full-time', 'Part-time', 'Remote', 'Internship'],
  jobType: 'Full-time',
  statusOptions: ['Pending', 'Interview', 'Declined'],
  status: 'Pending',

  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1
}

const AppContext = createContext()


const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const displayAlert = () => {
    dispatch({type: DISPLAY_ALERT})
    clearAlert()
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000)
  }

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const logoutUser = () => {
    setTimeout(() => {
      dispatch({type: LOGOUT_USER})
      removeUserFromLocalStorage()
    }, 1000)
  }

  const addUserToLocalStorage = ({user, token, location}) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('location', location)
  }
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('location')
  }


  // SETUP USER
  const setupUser = async ({currentUser, endPoint, alertText}) => {
    dispatch({ type: SETUP_USER_BEGIN})

    try {
      const {data} = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
      const {user, token, location} = data

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText }
      })

      addUserToLocalStorage({user, token, location})

    } catch (error) {
      const message = error.response.data.msg
      dispatch({
        type: SETUP_USER_ERROR,
        payload: {msg: message}
      })
    }

    clearAlert()
  }


  const authFetch = axios.create({
    baseURL: '/api/v1'
  })

  // Axios interceptors are functions that Axios calls for 
  // every request. You can use interceptors to transform the 
  // request before Axios sends it, or transform the response before 
  // Axios returns the response to your code. You can think of interceptors 
  // as Axios' equivalent to middleware in Express or Mongoose.
  // request interceptors
  authFetch.interceptors.request.use(
    function(config) {
      config.headers.common['Authorization'] = `Bearer ${state.token}`
      return config
    },
    function(error) {
      return Promise.reject(error)
    }
  )

  // response interceptor
  authFetch.interceptors.response.use(
    function(response) {
      return response
    },
    function(error) {
      if (error.response.status === 401) {
        // if user is not authorized kick them out
        logoutUser()
      }
      return Promise.reject(error)
    }
  )

  
  // UPDATE USER
  // I could mix this function with "SetupUser", but I want to make them different
  const updateUser = async (currentUser) => {
    dispatch({type: UPDATE_USER_BEGIN})

    try {
      const {data} = await authFetch.patch('/auth/updateUser', currentUser)

      const {user, location} = data

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: {user, location, token}
      })

      addUserToLocalStorage({
        user, location, token: initialState.token
      })

    } catch (error) {
      const message = error.response.data.msg
      
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: {msg: message}
        })
      }
    }

    clearAlert()
  }


  const handleChange = ({name, value}) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: {name, value}
    })
  }


  const clearValues = () => {
    dispatch({type: CLEAR_VALUES})
  }

  // CREATE JOB
  const createJob = async () => {
    dispatch({type: CREATE_JOB_BEGIN})
    try {
      const {position, company, jobLocation, jobType, status} = state

      await authFetch.post('/jobs', {
        company, position, jobLocation, jobType, status
      })

      dispatch({type: CREATE_JOB_SUCCESS})
      dispatch({type: CLEAR_VALUES})

    } catch (error) {
      if (error.response.status === 401) return
    
      const message = error.response.data.msg
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: {msg: message}
      })
    }

    clearAlert()
  }


  // GET JOBS
  const getJobs = async () => {
    const url = '/jobs'

    dispatch({type: GET_JOBS_BEGIN})
    try {
      const {data} = await authFetch.get(url)
      const {jobs, totalJobs, numOfPages} = data
      
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs, totalJobs, numOfPages
        }
      })

    } catch (error) {
      console.log(error.response);
      logoutUser()
    }

    // alert may still display when we quickly switch 
    // from "Add job" to "All job". in this case clear alert!
    clearAlert()
  }


  // SET EDIT JOB
  const setEditJob = (id) => {
    dispatch({type: SET_EDIT_JOB, payload: {id}})
  }

  const editJob = async () => {
    dispatch({type: EDIT_JOB_BEGIN})

    try {
      const {
        position, 
        company, 
        jobLocation, 
        jobType, 
        status, 
        editJobId
      } = state

      await authFetch.patch(`/jobs/${editJobId}`, {
        position,
        company,
        jobType,
        status,
        jobLocation
      })

      dispatch({type: EDIT_JOB_SUCCESS})
      dispatch({type: CLEAR_VALUES})

    } catch (error) {
      if (error.response.status === 401) return

      const message = error.response.data.msg
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: {msg: message}
      })
    }

    clearAlert()
  }


  // DELETE JOB
  const deleteJob = async (jobId) => {
    dispatch({type: DELETE_JOB_BEGIN})
    try {
      await authFetch.delete(`/jobs/${jobId}`)
      getJobs()
    } catch (error) {
      logoutUser()
    }
  }


  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export {AppProvider, initialState, useAppContext}