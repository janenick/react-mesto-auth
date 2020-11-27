import React from 'react';
import logo from '../images/header/header-logo.svg';

function Header() {
  return (
    <header className="header page__header section">
      <img className="header__logo" alt="Логотип проекта Место" src={logo} />
    </header>
  );
}

export default Header;