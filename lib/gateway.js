/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
const axios = require('axios');

// eslint-disable-next-line arrow-body-style
const gettoken = async (email, password) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.API_MT_URL}/users/login`,
      method: 'POST',
      data: {
        email: email,
        password: password,
      },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// eslint-disable-next-line arrow-body-style
// eslint-disable-next-line camelcase
const register = async (email, password, name, role_id) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.API_MT_URL}/users/register`,
      method: 'POST',
      data: {
        email: email,
        password: password,
        name: name,
        role_id: role_id,
      },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { gettoken, register };
