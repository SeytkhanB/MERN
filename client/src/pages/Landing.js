
import Main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import {
  Logo
} from '../components';
import {Link} from 'react-router-dom';

const Landing = () => {

  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>

      <div className='container page'>
        {/* info */}
        <div className='info'>
          <h1>Job <span>Tracking</span> App</h1>

          <p>
            I'm baby enamel pin chartreuse chiche af selfies kinfolk photo booth
            plaid jianbing actually squid 3 wolf moon lumbersexual. Hell of humbledrag
            glutten-free lo-fi man braid leggings
          </p>

          <Link
            to='/register'
            className='btn btn-hero'
          >
            Login/Register
          </Link>
        </div>

        <img src={Main} className='main-img img' alt='Main img' />
      </div>
    </Wrapper>
  )
}

export default Landing;