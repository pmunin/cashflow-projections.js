import { getNextDay, getNextMonth } from "./getNextDay";

/**
 * generates cashflow projections
 *
 * @export
 * @param {CashflowArgs} args
 * @returns {Iterable<CashflowProjection>}
 */
export function* generateCashflowProjections(args:CashflowArgs) : Iterable<CashflowProjection>
{
  if(args.endDate && args.periods) throw 'Both endDate and periods specified. Should be only one of them specified';
  if(!args.endDate && !args.periods) args.periods = 12;
  let getNextDate = args.getNextDate || getNextMonth;
  
  let cfp:CashflowProjection=undefined;
  let previous:CashflowProjection[]=[]

  for (let period = 1, date = args.startDate || new Date();
    args.endDate? date<=args.endDate : period<=args.periods; 
    period++, date = getNextDate(date, cfp)) {
      let cf_previous = [...previous];
      cfp={
        date,
        period,
        accruals:[]as any,
        totals:[]as any,
        context:args,
        previous:cf_previous
      };
      previous.splice(0,0,cfp);//insert at beginning the new cashflow projection
      args.initPeriod?.(cfp);
      
      addAccrualsByDefinitions(cfp, args.accruals, 'accruals');

      addAccrualsByDefinitions(cfp, args.totals, 'totals');

      args.finalizePeriod?.(cfp);
      yield cfp;
  }
}

export function getCashflowProjections(args:CashflowArgs) : CashflowProjection[]
{
  return Array.from(generateCashflowProjections(args));
}

export type CashflowArgs={
  /**
   * start date of the cashflow. If not provided, it will be current time
   *
   * @type {Date}
   */
  startDate?:Date,
  /**
   * end date of the cashflow. If not provided, it will try to use periods as a limit of periods
   *
   * @type {Date}
   */
  endDate?:Date,
  /**
   * amount of periods to generate. If not provided, it will use 12 as default
   *
   * @type {number}
   */
  periods?:number
  /**
   * function defining how to get date for next period from a given date and cashflow projection
   */
  getNextDate?:(date: Date, cashflow:CashflowProjection)=>Date
  /**
   * defines how to generate accruals for each cashflow projection
   *
   * @type {CashflowAccrualDefinitions}
   */
  accruals?:CashflowAccrualDefinitions
  /**
   * defines how to generate totals for each cashflow projection
   * @type {CashflowAccrualDefinitions}
   */
  totals?:CashflowAccrualDefinitions
  initPeriod?:(period:CashflowProjection)=>void
  finalizePeriod?:(period:CashflowProjection)=>void
}


/**
 * Projection of cashflow for particular period
 *
 * @export
 */
export type CashflowProjection = {
  date:Date,
  period:number,
  accruals:CashflowAccrualCollection,
  totals:CashflowAccrualCollection,
  context:CashflowArgs
  previous: CashflowProjection[]
}

export type CashflowAccrualCollection = Array<CashflowAccrualObject>&{[key:string]:CashflowAccrualObject}

export type CashflowAccrual = number | CashflowAccrualObject;

export type CashflowAccrualObject = {
  amount:number,
  description?:string,
  key?:string
  [customProp:string]:any
}



/**
 * Defines how to generate accrual for a cashflow projection
 * @example {
 * 
* {
*   salary:()=>100000/12,
*   tax:cf=>({amount:-cf.salary*0.25, description:'tax'}),
*   bonus:cf=>cf.date.getMonth()==11?cf.salary*0.1:undefined
* }
* ---OR---
* accruals:
* [
*   cf=>{
*     var salary = 100000/12;
*     var tax= -salary*0.25,
*     return {
*       salary,
*       tax
*     }
*   },
*   cf=>{
*     if(cf.date.getMonth()==11) return { bonus:{amount:10000, description:'second part of bonus'}};
*   }
* ]
* }
*/
export type CashflowAccrualDefinitions = CashflowAccrualDefinition[] | {[key:string]:CashflowAccrualDefinition}

export type CashflowAccrualDefinition=(period:CashflowProjection)=>(
  | void  //no accrual will be added
  | CashflowAccrual //number or object with amount (and description)
  | { [key:string] : CashflowAccrual }  //dictionary with key (key must not be 'amount', otherwise this object will be treated as accrual)
  | Array<CashflowAccrual> //array of accruals
)
function addAccrualsByDefinitions(cf: CashflowProjection, accDefs: CashflowAccrualDefinitions, cfProp:keyof CashflowProjection) {
  if(!accDefs) return;

  let keyAccruals 
    = Array.isArray(accDefs)?accDefs.map(accDef=>([undefined, accDef]))
    : accDefs instanceof Object? Object.entries(accDefs) 
    : undefined;

  if(!keyAccruals) throw new Error('accruals must be an array or an object')
  
  for (const [key, accDef] of keyAccruals) {
    let accRes = accDef(cf);
    addAccrualToCollection(cf[cfProp] as any, accRes, key as any);
  }
}

type CashflowAccrualResult = ReturnType<CashflowAccrualDefinition>;

function addAccrualToCollection(collection:CashflowAccrualCollection, accruals:CashflowAccrualResult, key?:string)
{
  if(typeof accruals == 'undefined') return;

  if(isAccrualObject(accruals)){
    collection.push(accruals);
    if(accruals.key) key=accruals.key;
    collection[key]=accruals;
  }
  else if(typeof accruals=='number')
  {
    let acc:CashflowAccrualObject = {amount:accruals};
    addAccrualToCollection(collection, acc, key);
  }
  else if(accruals instanceof Array)
  {
    for (const acc of accruals)
      addAccrualToCollection(collection, acc, key);
  }
  else if(accruals instanceof Object)//does not have amount property, so it should be considered as dictionnary of accruals
  {
    let accs = Object.entries(accruals);
    for (const [subKey, acc] of accs) {
      addAccrualToCollection(collection, acc, subKey);
    }
  }
}

function isAccrualObject(obj:any):obj is CashflowAccrualObject
{
  return obj instanceof Object && 'amount' in obj;
}
