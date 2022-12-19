before(()=>{
  cy.task('seed')
})

describe('POST /orders',()=>{
  it('Create order',()=>{
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
        url:'/products'
      })
      .then(products=>{
        cy.request({
          method:'post',
          url:'/orders',
          headers:{
            Authorization: 'Bearer '+user.body
          },
          body:{
            items:[
              {
                qty:products.body.products[0].countInStock,
                product:products.body.products[0]._id
              }
            ],
            shippingAddress:{
              address:"address1",
              city:"city1",
              postalCode:"12345",
              country:"CR"
            },
            paymentMethod:"credit",
            taxPrice:1,
            shippingPrice:1
          }
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,201)
      assert.equal(res.body,'Order created')
    })
  })
  it('Empty items',()=>{
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
        method:'post',
        url:'/orders',
        headers:{
          Authorization: 'Bearer '+user.body
        },
        failOnStatusCode: false,
        body:{
          items:[
          ],
          shippingAddress:{
            address:"address1",
            city:"city1",
            postalCode:"12345",
            country:"CR"
          },
          paymentMethod:"credit",
          taxPrice:1,
          shippingPrice:1
        }
      })
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Empty items')
    })
  })
  it('Invalid order data',()=>{
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
        method:'post',
        url:'/orders',
        headers:{
          Authorization: 'Bearer '+user.body
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Invalid order data')
    })
  })
})

describe('GET /orders',()=>{
  it('Read orders',()=>{
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
        url:'/orders',
          headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.isArray(res.body)
    })
  })
})

describe('GET /orders/myorders',()=>{
  it('Read my orders',()=>{
    cy.request({
      method:'post',
      url:'/users/login',
      body:{
        email:'email1@example.com',
        password:'1234'
      }
    })
    .then(res=>{
      cy.request({
        method:'get',
        url:'/orders/myorders',
          headers:{
          Authorization: 'Bearer '+res.body
        }
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.isArray(res.body)
    })
  })
})

describe('GET /orders/:id',()=>{
  it('Read order as owner',()=>{
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
        url:'/orders',
          headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
    })
    .then(orders=>{
      cy.request({
        method:'post',
        url:'/users/login',
        body:{
          email:'email1@example.com',
          password:'1234'
        }
      })
      .then(owner=>{
        cy.request({
          method:'get',
          url:'/orders/'+orders.body[0]._id,
          headers:{
            Authorization: 'Bearer '+owner.body
          }
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
  it('Read order as admin',()=>{
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
        url:'/orders',
          headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
      .then(orders=>{
        cy.request({
          method:'get',
          url:'/orders/'+orders.body[0]._id,
          headers:{
            Authorization: 'Bearer '+admin.body
          }
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
  it('Not authorized to read',()=>{
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
        url:'/orders',
          headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
    })
    .then(orders=>{
      cy.request({
        method:'post',
        url:'/users/login',
        body:{
          email:'email2@example.com',
          password:'1234'
        }
      })
      .then(user=>{
        cy.request({
          method:'get',
          url:'/orders/'+orders.body[0]._id,
          headers:{
            Authorization: 'Bearer '+user.body
          },
          failOnStatusCode: false
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,401)
      assert.equal(res.body,"Not authorized to read")
    })
  })
  it('Order not found',()=>{
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
        url:'/orders/000000000000000000000000',
        headers:{
          Authorization: 'Bearer '+admin.body
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Order not found')
    })
  })
})

describe('/orders/:id/deliver',()=>{
  it('Update order to delivered',()=>{
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
        url:'/orders',
        headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
      .then(orders=>{
        cy.request({
          method:'put',
          url:'/orders/'+orders.body[0]._id+'/deliver',
          headers:{
            Authorization: 'Bearer '+admin.body
          }
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.equal(res.body,'Order updated')
    })
  })
  it('Order already delivered',()=>{
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
        url:'/orders',
        headers:{
          Authorization: 'Bearer '+admin.body
        }
      })
      .then(orders=>{
        cy.request({
          method:'put',
          url:'/orders/'+orders.body[0]._id+'/deliver',
          headers:{
            Authorization: 'Bearer '+admin.body
          },
          failOnStatusCode: false
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Order already delivered')
    })
  })
  it('Order not found',()=>{
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
        url:'/orders/000000000000000000000000/deliver',
        headers:{
          Authorization: 'Bearer '+admin.body
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Order not found')
    })
  })
})