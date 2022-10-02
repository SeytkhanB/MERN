
import { 
  DISPLAY_ALERT, 
  CLEAR_ALERT,

  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER
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


  if (action.type ===LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
      userLocation: '',
      jobLocation: ''
    }
  }
  
  throw new Error(`No such action: ${action.type}`)
}
export default reducer