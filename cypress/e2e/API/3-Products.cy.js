describe('POST /products',()=>{
  it('Create product',()=>{
    cy.request({
      method:'post',
      url:'/products',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY2MTc2OGU5NWVkNTcwZjI0MmY2YyIsImlhdCI6MTY3MDM0NDQxMiwiZXhwIjoxNjcyOTM2NDEyfQ.HZ4PNWec4asiE98bbYRlG2pyGw9Ts0dx-1hov_pPEK0'
      }
    }).then(res=>{
      assert.equal(res.status,201)
      assert.isObject(res.body)
    })
  })
})

describe('GET /products',()=>{
  it('Read products',()=>{
    cy.request({
      method:'get',
      url:'/products',
      qs:{
        page:2,
        keyword:'name'
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
})

describe('POST /products/:id/reviews',()=>{
  it.skip('Create review',()=>{
    cy.request({
      method:'post',
      url:'products/6390e596660a0c819b445c9c/reviews',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY2MTc2OGU5NWVkNTcwZjI0MmY2YyIsImlhdCI6MTY3MDM0NDQxMiwiZXhwIjoxNjcyOTM2NDEyfQ.HZ4PNWec4asiE98bbYRlG2pyGw9Ts0dx-1hov_pPEK0'
      },
      body:{
        rating:5,
        comment:"Common comment"
      }
    }).then(res=>{
      assert.equal(res.status,201)
      assert.equal(res.body,'Review added successfully')
    })
  })
  it('Product already reviewed',()=>{
    cy.request({
      method:'post',
      url:'products/6390e596660a0c819b445c9c/reviews',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY2MTc2OGU5NWVkNTcwZjI0MmY2YyIsImlhdCI6MTY3MDM0NDQxMiwiZXhwIjoxNjcyOTM2NDEyfQ.HZ4PNWec4asiE98bbYRlG2pyGw9Ts0dx-1hov_pPEK0'
      },
      body:{
        rating:5,
        comment:"Common comment"
      },
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,400)
      assert.equal(res.body,'Product already reviewed')
    })
  })
  it('Product not found',()=>{
    cy.request({
      method:'post',
      url:'products/0390e596660a0c819b445c9c/reviews',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY2MTc2OGU5NWVkNTcwZjI0MmY2YyIsImlhdCI6MTY3MDM0NDQxMiwiZXhwIjoxNjcyOTM2NDEyfQ.HZ4PNWec4asiE98bbYRlG2pyGw9Ts0dx-1hov_pPEK0'
      },
      body:{
        rating:5,
        comment:"Common comment"
      },
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Product not found')
    })
  })
})

describe('GET /products/:id',()=>{
  it('Read product',()=>{
    cy.request({
      method:'get',
      url:'/products/6390e596660a0c819b445c9c'
    }).then(res=>{
      assert.equal(res.status,200)
      assert.isObject(res.body)
    })
  })
  it('Product not found',()=>{
    cy.request({
      method:'get',
      url:'/products/0390e596660a0c819b445c9c',
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Product not found')
    })
  })
})

describe('DELETE /products/:id',()=>{
  it.skip('Delete product',()=>{
    cy.request({
      method:'delete',
      url:'/products/6390fa2205075be1f7f9f10e',
      headers:{
        Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGY2MTc2OGU5NWVkNTcwZjI0MmY2YyIsImlhdCI6MTY3MDM0NDQxMiwiZXhwIjoxNjcyOTM2NDEyfQ.HZ4PNWec4asiE98bbYRlG2pyGw9Ts0dx-1hov_pPEK0'
      }
    }).then(res=>{
      assert.equal(res.status,200)
      assert.equal(res.body,'Product deleted')
    })
  })
  it('Not authorized to delete',()=>{
    cy.request({
      method:'delete',
      url:'/products/6391fa9805f80e1c20fd630c',
      headers:{
        Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTEwMmMwMjNlYWNjMTc0YTcyYzU2YiIsImlhdCI6MTY3MDQ0NzgwOSwiZXhwIjoxNjczMDM5ODA5fQ.jziBlaYFbgorb5c3eamOl7Q4SXFd85DnG5Xz3i6Z_iE'
      },
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,401)
      assert.equal(res.body,'Not authorized to delete')
    })
  })
  it('Product not found',()=>{
    cy.request({
      method:'delete',
      url:'/products/0391fa9805f80e1c20fd630c',
      headers:{
        Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTEwMmMwMjNlYWNjMTc0YTcyYzU2YiIsImlhdCI6MTY3MDQ0NzgwOSwiZXhwIjoxNjczMDM5ODA5fQ.jziBlaYFbgorb5c3eamOl7Q4SXFd85DnG5Xz3i6Z_iE'
      },
      failOnStatusCode: false
    }).then(res=>{
      assert.equal(res.status,404)
      assert.equal(res.body,'Product not found')
    })
  })
})