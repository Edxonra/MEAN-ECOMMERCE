before(()=>{
  cy.task('seed')
})

describe('POST /user',()=>{
  it('Create user',()=>{
    cy.request({
      method:'post',
      url:'/users',
      body:{
        name:'User',
        email:'email3@example.com',
        password:'1234'
      }
    })
    .then(res=>{
      assert.equal(res.status,201)
      assert.equal(res.body,'User created')
    })
  })
  it('Email is already in use',()=>{
    cy.request({
      method:'post',
      url:'/users',
      body:{
        name:'User',
        email:'email1@example.com',
        password:'1234'
      }, 
      failOnStatusCode: false
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Email is already in use')
    })
  })
  it('Invalid user data',()=>{
    cy.request({
      method:'post',
      url:'/users',
      failOnStatusCode: false
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Invalid user data')
    })
  })
})

describe('POST /users/login',()=>{
  it('Log user',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email1@example.com',
        password:'1234'
      }
    })
    .then(user=>{
      assert.equal(user.status,200)
      assert.isString(user.body)
    })
  })
  it('Wrong password',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email1@example.com',
        password:'0234'
      },
      failOnStatusCode: false
    })
    .then(res=>{
      assert.equal(res.status,401)
      assert.equal(res.body,'Wrong password')
    })
  })
  it('Email do not exists',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'0mail1@example.com',
        password:'1234'
      },
      failOnStatusCode: false
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Email do not exists')
    })
  })
  it('Invalid user data',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      failOnStatusCode: false
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Invalid user data')
    })
  })
})

describe('GET /user',()=>{
  it('Read users',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'admin@example.com',
        password:'1234'
      }
    })
    .then(admin=>{
      cy.request({
        method:'get',
        url:'/users',
        headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
    })
    .then(users=>{
      assert.equal(users.status,200)
      assert.isArray(users.body)
    })
  })
})

describe('GET /users/profile',()=>{
  it('Read profile',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email1@example.com',
        password:'1234'
      }
    })
    .then(user=>{
      cy.request({
        method:'get',
        url:'/users/profile',
        headers:{
          Authorization: 'Bearer '+user.body
        }
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
})

describe('PUT /users/profile',()=>{
  it('Update profile',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email1@example.com',
        password:'1234'
      }
    })
    .then(user=>{
      cy.request({
        method:'put',
        url:'/users/profile',
        headers:{
          Authorization: 'Bearer '+user.body
        },
        body:{
          name:'User',
          password:'1234'
        }
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.equal(res.body,"Profile updated")
    })
  })
  it('Invalid user data',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email1@example.com',
        password:'1234'
      }
    })
    .then(user=>{
      cy.request({
        method:'put',
        url:'/users/profile',
        headers:{
          Authorization: 'Bearer '+user.body
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,"Invalid user data")
    })
  })
})

describe('PUT /users/:id',()=>{
  it('Update user',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'admin@example.com',
        password:'1234'
      }
    })
    .then(admin=>{
      cy.request({
        method:'get',
        url:'/users',
        headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
      .then(users=>{
        cy.request({
          method:'put',
          url:'/users/'+users.body[1]._id,
          headers:{
            Authorization: 'Bearer '+admin.body
          },
          body:{
            isAdmin:false
          }
        })
      })
      .then(res=>{
        assert.equal(res.status,200)
        assert.equal(res.body,'User updated')
      })
    })
  })
  it('User not found',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'admin@example.com',
        password:'1234'
      }
    })
    .then(admin=>{
      cy.request({
        method:'put',
        url:'/users/000000000000000000000000',
        headers:{
          Authorization: 'Bearer '+admin.body
        },
        body:{
          isAdmin:false
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'User not found')
    })
  })
  it('Invalid user data',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'admin@example.com',
        password:'1234'
      }
    })
    .then(admin=>{
      cy.request({
        method:'get',
        url:'/users',
        headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
      .then(users=>{
        cy.request({
          method:'put',
          url:'/users/'+users.body[1]._id,
          headers:{
            Authorization: 'Bearer '+admin.body
          },
          failOnStatusCode: false
        })
      })
      .then(res=>{
        assert.equal(res.status,400)
        assert.equal(res.body,'Invalid user data')
      })
    })
  })
})