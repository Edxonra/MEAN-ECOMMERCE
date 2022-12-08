describe('Testing home routing',()=>{
  it('GET / endpoint',()=>{
    cy.request({
      method:'get',
      url:'/'
    }).then((res)=>{
      assert.equal(res.status,200)
      assert.equal(res.body,"ENDPOINTS")
    })
  })
})