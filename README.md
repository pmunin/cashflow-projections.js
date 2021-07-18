# 🚀 Cashflow projections

[![NPM Version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Docs][docs-image]][docs-url]

This javascript module lets you easily generate projections

For example:

```js
getCashflowProjections({ 
  startDate:new Date('01/01/2020'),
  periods: 24,
  accruals:{
    salary:()=>120000/12,
    tax:cf=>({amount:-cf.salary*0.25, description:'tax'}),
    bonus:cf=>cf.date.getMonth()==11?5000:undefined
  },
  totals:{
    salary: cf=>cf.accruals.salary.amount + (cf.previous[0]?.totals.salary??0)
  }
})
```

Generates array of:

```js
[
  {date:new Date('01/01/2021'), period:1, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:10000}}},
  {date:new Date('02/01/2021'), period:2, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:20000}}},
  {date:new Date('03/01/2021'), period:3, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:30000}}},
  {date:new Date('04/01/2021'), period:4, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:40000}}},
  {date:new Date('05/01/2021'), period:5, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:50000}}},
  {date:new Date('06/01/2021'), period:6, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:60000}}},
  {date:new Date('07/01/2021'), period:7, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:70000}}},
  {date:new Date('08/01/2021'), period:8, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:80000}}},
  {date:new Date('09/01/2021'), period:9, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:90000}}},
  {date:new Date('10/01/2021'), period:10, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:100000}}},
  {date:new Date('11/01/2021'), period:11, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}}, totals:{salary:{amount:11000}}},
  {date:new Date('12/01/2021'), period:12, accruals:{salary:{amount:10000}, tax:{amount:2500, description:'tax'}, bonus:{amount:5000}}, totals:{salary:{amount:120000}}},
]

//accruals and totals are actually of type array, by also have properties defined in the accrual configuration
```

[Read more docs here][docs-url]


[npm-image]: https://img.shields.io/npm/v/cashflow-projections.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/cashflow-projections
[build-image]:https://github.com/pmunin/cashflow-projections.js//actions/workflows/main.yml/badge.svg
[build-url]:https://github.com/pmunin/cashflow-projections.js/.github/actions/workflows/main.yml
[downloads-image]: https://img.shields.io/npm/dm/cashflow-projections.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/cashflow-projections
[docs-url]:https://pmunin.github.io/cashflow-projections.js/
[docs-image]:https://img.shields.io/badge/docs-typedoc-blue?style=flat&logo=Read%20the%20Docs