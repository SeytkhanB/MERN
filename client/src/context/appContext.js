
import {useContext, useReducer, createContext} from 'react';
import { 
  DISPLAY_ALERT, 
  CLEAR_ALERT,

  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR
} from './actions';
import reducer from './reducer';
import axios from 'axios'


const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')

const initialState = {
  showAlert: false,
  isLoading: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || ''
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


  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser
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