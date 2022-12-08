describe('POST /user',()=>{
  it.skip('Create user',()=>{
    cy.request({
      method:'post',
      url:'/users',
      body:{
        name:'User',
        email:'email@example.com',
        password:'1234'
      }
    }).then(res=>{
      assert.equal(res.status,201)
      assert.isObject(res.body)
    })
  })
  it('Email is already in use',()=>{
    cy.request({
      method:'post',
      url:'/users',
      body:{
        name:'User',
        email:'email@example.com',
        password:'1234'
      }, 
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Email is already in use')
    })
  })
})

describe('GET /user',()=>{
  it('Read users',()=>{
    cy.request({
      method:'get',
      url:'/users',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY3MzQxYjk0M2NhYmFhM2IzOGRmNiIsImlhdCI6MTY3MDM0NTUzNywiZXhwIjoxNjcyOTM3NTM3fQ.c7xp3N8z-aCN-2xccf6M0wN8NIvY5nP-v4EgoTJWBis'
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.isArray(res.body)
    })
  })
})

describe('POST /users/login',()=>{
  it('Log user',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email@example.com',
        password:'1234'
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
  it('Wrong password',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email@example.com',
        password:'12345'
      },
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,401)
      assert.equal(res.body,'Wrong password')
    })
  })
  it('Email do not exists',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email@example1.com',
        password:'1234'
      },
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Email do not exists')
    })
  })
})

describe('GET /users/profile',()=>{
  it('Read profile',()=>{
    cy.request({
      method:'get',
      url:'/users/profile',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY2MTc2OGU5NWVkNTcwZjI0MmY2YyIsImlhdCI6MTY3MDM0NDQxMiwiZXhwIjoxNjcyOTM2NDEyfQ.HZ4PNWec4asiE98bbYRlG2pyGw9Ts0dx-1hov_pPEK0'
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
})

describe('PUT /users/profile',()=>{
  it('Update profile',()=>{
    cy.request({
      method:'put',
      url:'/users/profile',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY2MTc2OGU5NWVkNTcwZjI0MmY2YyIsImlhdCI6MTY3MDM0NDQxMiwiZXhwIjoxNjcyOTM2NDEyfQ.HZ4PNWec4asiE98bbYRlG2pyGw9Ts0dx-1hov_pPEK0'
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
})

describe('PUT /users/:id',()=>{
  it('Update user',()=>{
    cy.request({
      method:'put',
      url:'/users/639102c023eacc174a72c56b',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY3MzQxYjk0M2NhYmFhM2IzOGRmNiIsImlhdCI6MTY3MDM0NTUzNywiZXhwIjoxNjcyOTM3NTM3fQ.c7xp3N8z-aCN-2xccf6M0wN8NIvY5nP-v4EgoTJWBis'
      },
      body:{
        isAdmin:false
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.equal(res.body,'User updated')
    })
  })
  it('User not updated',()=>{
    cy.request({
      method:'put',
      url:'/users/639102c023eacc174a72c56b',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY3MzQxYjk0M2NhYmFhM2IzOGRmNiIsImlhdCI6MTY3MDM0NTUzNywiZXhwIjoxNjcyOTM3NTM3fQ.c7xp3N8z-aCN-2xccf6M0wN8NIvY5nP-v4EgoTJWBis'
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.equal(res.body,'User not updated')
    })
  })
  it('User not found',()=>{
    cy.request({
      method:'put',
      url:'/users/039102c023eacc174a72c56b',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY3MzQxYjk0M2NhYmFhM2IzOGRmNiIsImlhdCI6MTY3MDM0NTUzNywiZXhwIjoxNjcyOTM3NTM3fQ.c7xp3N8z-aCN-2xccf6M0wN8NIvY5nP-v4EgoTJWBis'
      },
      failOnStatusCode:false
    }).then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'User not found')
    })
  })
})