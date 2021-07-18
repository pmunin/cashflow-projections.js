import fs from 'fs'


if(fs.existsSync('./dist/index.js'))
  describe('postBuild tests',()=>{
    it("should import",()=>{
      var x = require('../dist/index.js');
    })
    it("should have methods",()=>{
      var x = require('../dist/index.js');
      expect(x).toBeDefined();
      expect(x.getCashflowProjections).toBeInstanceOf(Function);
      expect(x.getNextWorkDay).toBeInstanceOf(Function);
      expect(x.getNextDay).toBeInstanceOf(Function);
      expect(x.getNextMonth).toBeInstanceOf(Function);

      var cf = x.getCashflowProjections({
        periods:12
      });

      expect(cf).toBeInstanceOf(Array);
      expect(cf.length).toBe(12);

    })
  })
else it("dist folder does not exist",()=>{})