
const db = {}

const getInstance = (name, storeName) => {
  if (!db[name]) {
    db[name] = {}
  }

  if (!db[name][storeName]) {
    db[name][storeName] = {}
  }

  return db[name][storeName]
}

export default {
  createInstance({ name, storeName }) {
    const instance = getInstance(name, storeName)

    return {
      setItem (key, value) {
        if (value === 'errorMsg') {
          throw new Error()
        }
        instance[key] = value
      },
      iterate (cb) {
        for ( let key in instance) {
          cb(instance[key], key)
        }
      },
      removeItem (key) {
        delete instance[key]
      },
      getItem (key) {
        return instance[key]
      }
    }
  }
}
