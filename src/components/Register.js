import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ handleRegister }) => {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    message: ''
  });


  return (
    <div className="register">
    </div>
  )

}

export default Register;