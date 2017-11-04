
const fillZero = num => {
  return num < 10 ? `0${num}` : num
}

export const formatTime = () => {
  const date = new Date()
  const Y = date.getFullYear()
  const M = fillZero(date.getMonth() + 1)
  const D = fillZero(date.getDate())
  const h = fillZero(date.getHours())
  const m = fillZero(date.getMinutes())
  const s = fillZero(date.getSeconds())

  return `${Y}${M}${D}-${h}${m}${s}`
}
