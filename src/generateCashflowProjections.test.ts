import { generateCashflowProjections, getCashflowProjections } from './generateCashflowProjections'
import { getNextDay } from './getNextDay';

describe('generateCashflowProjections', () => {

  describe('startDate, endDate, periods', () => {

    it('should work with default period', () => {

      var res = (getCashflowProjections({
      }));
      expect(res.length).toEqual(12);
    })

    it('cannot specify both endDate and periods', () => {

      expect(()=>getCashflowProjections({
        endDate: new Date('2022-01-01'),
        periods: 12
      })).toThrow();
    })

    it('should handle invalid accruals', () => {

      
      expect(()=>getCashflowProjections({
        accruals: 123 as any
      })).toThrow('accruals must be an array or an object');
    })


    it('should work with startDate and periods', () => {

      var res = Array.from(generateCashflowProjections({
        startDate: new Date('01/01/2021'),
        periods: 12,
      }));
      expect(res.length).toBe(12);
      let last = res[res.length - 1];
      expect(last.date).toEqual(new Date('12/01/2021'));
      expect(last.previous.length).toBe(11);
    })



    it('should work with startDate and endDate', () => {

      var res = Array.from(generateCashflowProjections({
        startDate: new Date('01/01/2021'),
        endDate: new Date('12/15/2021'),
      }));
      expect(res.length).toBe(12);
      expect(res[res.length - 1].date).toEqual(new Date('12/01/2021'));
    })

    it('should work with custom nextDay func', () => {

      var res = Array.from(generateCashflowProjections({
        startDate: new Date('01/01/2021'),
        endDate: new Date('12/31/2021'),
        getNextDate: getNextDay
      }));
      expect(res.length).toBeGreaterThan(360);
    })
  })

  describe('accruals', () => {
    it('should gen accs object', () => {
      let cashflow = getCashflowProjections({
        startDate: new Date('01/01/2021'),
        endDate: new Date('12/31/2021'),
        accruals: {
          salary: cf => 120000 / 12,
          _tax: cf => {
            expect(cf.accruals.salary?.amount).toBe(120000 / 12);
            var taxRes = -0.25 * cf.accruals.salary.amount;//make sure it uses declaration order instead of lexical
            return taxRes;
          },
          _shouldNotBeIncluded: cf => undefined,
          withDescription: cf => ({ amount: cf.period, description: 'My accrual', key: 'withDesc' }),
          array: cf => [
            123,
            { amount: 321, key: 'definedInArray' }
          ]
        }
      });

      let last = cashflow[cashflow.length - 1];
      expect(cashflow.every(cf => {
        expect(cf.accruals.length).toEqual(5);
        expect(cf.accruals.salary).toBe(cf.accruals[0]);
        expect(cf.accruals._tax).toBe(cf.accruals[1]);
        expect(cf.accruals.salary.amount).toEqual(120000 / 12);
        expect(cf.accruals._tax.amount).toEqual(-0.25 * 120000 / 12);
        expect('_shouldNotBeIncluded' in cf.accruals).toBeFalsy();
        expect('withDesc' in cf.accruals).toBeTruthy();
        expect(cf.accruals.withDesc.amount).toEqual(cf.period);
        expect(cf.accruals.withDesc.description).toEqual('My accrual');
        expect('definedInArray' in cf.accruals).toBeTruthy();
        expect(cf.accruals.definedInArray.amount).toEqual(321)
        return true;
      })).toBeTruthy();
    })


    it('should gen accs array', () => {
      let cashflow = getCashflowProjections({
        startDate: new Date('01/01/2021'),
        endDate: new Date('12/31/2021'),
        accruals: [
          cf => 120000 / 12,//accruals[0]
          cf => {
            expect(cf.accruals.length).toEqual(1);
            expect(cf.accruals[0].amount).toBe(120000 / 12);
            var taxRes = -0.25 * cf.accruals[0].amount;//make sure it uses declaration order instead of lexical
            return {  //returns multiple accruals
              tax: taxRes, //accruals[1] == accruals['tax']
              taxAbs: -taxRes //accruals[2] == accruals['taxAbs']
            };
          },
          cf => {
            return {  //returns single accrual. accruals[3]==accruals['withDesc']
              amount: cf.period,
              description: 'My accrual',
              key: 'withDesc'
            };
          },
          cf => {
            return [//returns array of accruals
              {  //accruals[4] == accruals['withDesc1']
                amount: cf.period,
                description: 'My accrual 1',
                key: 'withDesc1'
              },
              {  //accruals[5]
                amount: cf.period,
                description: 'My accrual 2',
              }
            ];
          },
        ]
      });

      let last = cashflow[cashflow.length - 1];
      expect(cashflow.every(cf => {
        expect(cf.accruals.length).toEqual(6);
        expect('withDesc1' in cf.accruals).toBeTruthy();
        return true;
      })).toBeTruthy();
    })
  })

});