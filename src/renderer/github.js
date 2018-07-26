
const myUrl = 'https://api.github.com/repos/joehecn/j/releases/latest'
const myHeaders = new Headers()
myHeaders.append('User-Agent', 'joehecn')
const myRequest = new Request(myUrl, { myHeaders })

module.exports = async () => {
  const res = await fetch(myRequest)
  return res.json()
}
