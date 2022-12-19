const bcryptjs = require('bcryptjs')

const users = [
  {
    name:'Admin User',
    email:'admin@example.com',
    password:bcryptjs.hashSync('1234'),
    isAdmin:true
  },
  {
    name:'User',
    email:'email1@example.com',
    password:bcryptjs.hashSync('1234')
  },
  {
    name:'User',
    email:'email2@example.com',
    password:bcryptjs.hashSync('1234')
  }
]

module.exports = users