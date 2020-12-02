import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [data, setData] = useState({
    email: '',
    password: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    let { email, password } = data;
    console.log('handleSubmit from Register: ', { email, password });
    onRegister(password, email);
  }

  return (
    <section className='login section'>
      <div className='login__container'>
        <form className='login__form' onSubmit={handleSubmit}>
          <h2 className='login__title'>Регистрация</h2>
          <label className='login__form-field'>
            <input id='email' required name='email' type='email' value={data.email} onChange={handleChange} placeholder='Email' className='login__input' />
          </label>
          <label className='login__form-field'>
            <input id='password' required name='password' type='password' value={data.password} onChange={handleChange} placeholder='Пароль' className='login__input' />
          </label>
          <button type='submit' className='login__btn-sbm'>Зарегистрироваться</button>
        </form>
        <Link to='./sign-шт' className='login__link'>Уже зарегистрированы? Войти</Link>
      </div>
    </section>
  )

}

export default Register;