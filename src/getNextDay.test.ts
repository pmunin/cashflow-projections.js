import { getNextDay, getNextWorkDay, getNextMonth } from "./getNextDay"

describe('next days', () => {
  it('should return the next day', () => {
    const date = new Date(2017, 0, 1)// sunday
    const nextDay = getNextDay(date)
    expect(nextDay).toEqual(new Date(2017, 0, 2))
  })
  it('should return the next day even for next year', () => {
    const date = new Date(2016, 11, 31)// saturday
    const nextDay = getNextDay(date)
    expect(nextDay).toEqual(new Date(2017, 0, 1))
  })
  it('should return the next working day', () => {
    const date = new Date(2016, 11, 31)// saturday
    const nextDay = getNextWorkDay(date)
    expect(nextDay).toEqual(new Date(2017, 0, 2))
  })
})
