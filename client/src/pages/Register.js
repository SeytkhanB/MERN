
import {useState} from 'react';
import Wrapper from '../assets/wrappers/RegisterPage';
import {Logo, FormRow, Alert} from '../components';
import {useAppContext} from '../context/appContext';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: false,
}

export default function Register() {
  const [values, setValues] = useState(initialState)
  const {isLoading, showAlert, displayAlert} = useAppContext()
  // global state and useNavigate

  const toggleMember = () => {
    setValues({...values, isMember: !values.isMember})
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { name, email, password, isMember } = values
    if (!email || !password || (!isMember && !name)) {
      displayAlert()
      return
    }
    console.log(values)
  }

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />

        <h3>{values.isMember ? 'Login' : 'Register'}</h3>

        {showAlert && <Alert />}

        {/* name input */}
        {!values.isMember && (
          <FormRow
            type='text'
            name='name'
            labelText='Name'
            value={values.name} 
            handleChange={handleChange}
          />
        )}

        {/* email input */}
        <FormRow
          type='email'
          name='email'
          labelText='Email'
          value={values.email} 
          handleChange={handleChange}
        />

        {/* password input */}
        <FormRow
          type='password'
          name='password'
          labelText='Password'
          value={values.password} 
          handleChange={handleChange}
        />

        <button
          type='submit'
          className='btn btn-block'
        >
          Submit
        </button>

        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}

          <button 
            type='button' 
            onClick={toggleMember} 
            className='member-btn'
          >
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  )
}