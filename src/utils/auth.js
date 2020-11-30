import {
  apiParams
} from './constants.js';

const checkResponce = (response) => response.ok ? response.json() : Promise.reject(`Ошибка from duckAuth: ${response.status}`);

export const register = (username, password, email) => {
  return fetch(`${apiParams.baseUrl}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, email })
  })
    .then(checkResponce)
};
export const authorize = (identifier, password) => {
  return fetch(`${apiParams.baseUrl}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ identifier, password })
  })
    .then(checkResponce)
};
export const getContent = (token) => {
  return fetch(`${apiParams.baseUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(checkResponce)
}


