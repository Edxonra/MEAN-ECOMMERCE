before(()=>{
  cy.task('seed')
})

describe('POST /products',()=>{
  it('Create product',()=>{
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
        url:'/products',
        headers:{
          Authorization: 'Bearer '+user.body
        }
      })
    })
    .then(res=>{
      assert.equal(res.status,201)
      assert.equal(res.body,"Product created")
    })
  })
})

describe('GET /products',()=>{
  it('Read products',()=>{
    cy.request({
      method:'get',
      url:'/products'
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
})

describe('POST /products/:id/reviews',()=>{
  it('Create review',()=>{
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
          url:'products/'+products.body.products[0]._id+'/reviews',
          headers:{
            Authorization: 'Bearer '+user.body
          },
          body:{
            rating:5,
            comment:"Common comment"
          }
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,201)
      assert.equal(res.body,'Review added successfully')
    })
  })
  it('Product already reviewed',()=>{
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
          url:'products/'+products.body.products[0]._id+'/reviews',
          headers:{
            Authorization: 'Bearer '+user.body
          },
          body:{
            rating:5,
            comment:"Common comment"
          },
          failOnStatusCode: false
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Product already reviewed')
    })
  })
  it('Product not found',()=>{
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
        url:'products/000000000000000000000000/reviews',
        headers:{
          Authorization: 'Bearer '+user.body
        },
        body:{
          rating:5,
          comment:"Common comment"
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Product not found')
    })
  })
  it('Invalid review data',()=>{
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
          url:'products/'+products.body.products[0]._id+'/reviews',
          headers:{
            Authorization: 'Bearer '+user.body
          },
          failOnStatusCode: false
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Invalid review data')
    })
  })
})

describe('GET /products/:id',()=>{
  it('Read product',()=>{
    cy.request({
      method:'get',
      url:'/products'
    })
    .then(products=>{
      cy.request({
        method:'get',
        url:'/products/'+products.body.products[0]._id
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
  it('Product not found',()=>{
    cy.request({
      method:'get',
      url:'products/000000000000000000000000',
      failOnStatusCode: false
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Product not found')
    })
  })
})

describe('DELETE /products/:id',()=>{
  it('Delete product',()=>{
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
          method:'delete',
          url:'/products/'+products.body.products[0]._id,
          headers:{
            Authorization:'Bearer '+user.body
          }
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.equal(res.body,'Product deleted')
    })
  })
  it('Not authorized to delete',()=>{
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
        url:'/products'
      })
      .then(res2=>{
        cy.request({
          method:'delete',
          url:'/products/'+res2.body.products[0]._id,
          headers:{
            Authorization:'Bearer '+user.body
          },
          failOnStatusCode: false
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,401)
      assert.equal(res.body,'Not authorized to delete')
    })
  })
  it('Product not found',()=>{
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
        method:'delete',
        url:'/products/000000000000000000000000',
        headers:{
          Authorization:'Bearer '+user.body
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Product not found')
    })
  })
})

describe('PUT /products/:id',()=>{
  it('Update product',()=>{
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
          method:'put',
          url:'/products/'+products.body.products[0]._id,
          headers:{
            Authorization:'Bearer '+user.body
          },
          body:{
            name:"Product name"
          }
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,200)
      assert.equal(res.body,'Product updated')
    })
  })
  it('Not authorized to update',()=>{
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
        url:'/products'
      })
      .then(products=>{
        cy.request({
          method:'put',
          url:'/products/'+products.body.products[0]._id,
          headers:{
            Authorization:'Bearer '+user.body
          },
          body:{
            name:"Product name"
          },
          failOnStatusCode: false
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,401)
      assert.equal(res.body,'Not authorized to update')
    })
  })
  it('Product not found',()=>{
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
        url:'/products/000000000000000000000000',
        headers:{
          Authorization:'Bearer '+user.body
        },
        body:{
          name:"Product name"
        },
        failOnStatusCode: false
      })
    })
    .then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Product not found')
    })
  })
  it('Invalid product data',()=>{
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
      .then(res2=>{
        cy.request({
          method:'put',
          url:'/products/'+res2.body.products[0]._id,
          headers:{
            Authorization:'Bearer '+user.body
          },
          failOnStatusCode: false
        })
      })
    })
    .then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Invalid product data')
    })
  })
})