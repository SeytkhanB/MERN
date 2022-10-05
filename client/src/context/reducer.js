
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
} from "./actions"
import { initialState } from "./appContext"


const reducer = (state, action) => {
  
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Please provide all values!'
    }
  }

  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: ''
    }
  }

  // REGISTER
  if (action.type === SETUP_USER_BEGIN) {
    return {
      ...state, 
      isLoading: true
    }
  }

  if (action.type === SETUP_USER_SUCCESS) {
    const {user, token, location, alertText} = action.payload

    return {
      ...state,
      user: user,
      token: token,
      userLocation: location,
      jobLocation: location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: alertText
    }
  }

  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg
    }
  }


  // TOGGLE SIDEBAR
  if (action.type === TOGGLE_SIDEBAR) {
    return {...state, showSidebar: !state.showSidebar}
  }


  // LOGOUT USER
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
      userLocation: '',
      jobLocation: ''
    }
  }


  // UPDATE USER
  // Right now these conditionals are similar, I'll do refactor then!
  if (action.type === UPDATE_USER_BEGIN) {
    return {...state, isLoading: true}
  }

  if (action.type === UPDATE_USER_SUCCESS) {
    const {token, user, location} = action.payload

    return {
      ...state,
      isLoading: false,
      token: token,
      user: user,
      userLocation: location,
      jobLocation: location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Profile Updated!'
    }
  }

  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      showAlert: true,
      isLoading: false,
      alertType: 'danger',
      alertText: action.payload.msg
    }
  }

  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      [action.payload.name]: action.payload.value
    }
  }

  if (action.type === CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editJobId: '',
      company: '',
      position: '',
      jobLocation: state.userLocation,
      jobType: 'Full-time',
      status: 'Pending'
    }
    return {...state, ...initialState}
  }

  // CREATE JOB
  if (action.type === CREATE_JOB_BEGIN) {
    return {...state, isLoading: true}
  }

  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'New job created!'
    }
  }

  if (action.type === CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg
    }
  }
  
  throw new Error(`No such action: ${action.type}`)
}

export default reducer