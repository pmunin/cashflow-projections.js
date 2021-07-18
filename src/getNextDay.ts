export function getNextDay(date: Date): Date {
  date = new Date(date);
  date.setDate(date.getDate() + 1);
  return date;
}

export function getNextMonth(date:Date):Date
{
  date = new Date(date);
  date.setMonth(date.getMonth() + 1);
  return date;
}

export function getNextWorkDay(date:Date, isHoliday?:(date:Date)=>boolean):Date
{
  while(!isWorkDay(date=getNextDay(date))||(isHoliday?.(date)??false))
  {
  }
  return date;
}

function isWorkDay(date:Date){
  let dow = date.getDay();
  return !(dow==0 || dow==6);
}


