import React from 'react';
import { Link, useHistory } from 'react-router-dom';


function NavBar() {
  const history = useHistory();
 
  function onSignOut() {
    localStorage.removeItem('jwt');
    history.push('/register');
  }

  return (
    <div className='navbar'>
      <ul className='navbar__nav'>
        <li className='navbar__item'><Link to='sign-up' className='navbar__link'>Регистрация</Link></li>
        <li className='navbar__item'><Link to='sign-in' className='navbar__link'>Войти</Link></li>
        <li className='navbar__item'><p className='navbar__email'>email</p></li>
        <li className='navbar__item'><button onClick={onSignOut} className='navbar__btn'>Выйти</button></li>
      </ul>
    </div>
  )
}

export default NavBar;