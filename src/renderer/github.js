
const myUrl = 'https://api.github.com/repos/joehecn/j/releases/latest'

module.exports = async () => {
  const myHeaders = new Headers()
  myHeaders.append('User-Agent', 'joehecn')
  const myRequest = new Request(myUrl, { myHeaders })
  
  const res = await fetch(myRequest)
  return res.json()
}
