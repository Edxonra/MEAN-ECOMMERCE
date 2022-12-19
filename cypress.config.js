const { defineConfig } = require("cypress");
const seed = require('./Backend/seeder.js')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on,config){
      on('task',{
        async "seed"(){
          await seed()
          return null
        }
      })
    }
  }
});
