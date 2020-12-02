export const BASE_URL = 'https://auth.nomoreparties.co';

const checkResponce = (response) => response.ok ? response.json() : Promise.reject(`Ошибка from auth: ${response.status} ${response.error}`);

export const register = (password, email) => {
  console.log('register = (password, email): ', password, email);
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
    .then(checkResponce)
};
export const authorize = (identifier, password) => {
  console.log('authorize = (identifier, password): ', identifier, password);
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'password': password,
      'email': identifier
    })
  })
    .then(checkResponce)
};
export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(checkResponce)
}


