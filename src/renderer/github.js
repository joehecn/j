
const myUrl = 'https://api.github.com/repos/joehecn/j/releases/latest'

module.exports = async () => {
  const res = await fetch(myUrl, {
    headers: {
      'User-Agent': 'joehecn'
    }
  })
  return res.json()
}
