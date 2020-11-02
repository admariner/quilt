/* storage - abstract persistence; currently uses
 * enforce write/read from predefined keys only */
import invariant from 'invariant'
import mapValues from 'lodash/mapValues'

import logger from 'utils/logger'

export default (keys) => {
  const assertKey = (key, scope) =>
    invariant(key in keys, `storage.${scope}: unexpected key: ${key}`)

  function get(key) {
    assertKey(key, 'get')
    return JSON.parse(localStorage.getItem(keys[key]))
  }

  function set(key, value) {
    assertKey(key, 'set')
    return localStorage.setItem(keys[key], JSON.stringify(value))
  }

  function remove(key) {
    assertKey(key, 'remove')
    return localStorage.removeItem(keys[key])
  }

  function load() {
    // user privacy may cause reads from localStorage to fail and throw
    try {
      return mapValues(keys, (_v, k) => get(k))
    } catch (err) {
      logger.log('storage.load')
      logger.error(err)
      // let reducers determine state
      return undefined
    }
  }

  return {
    get,
    set,
    remove,
    load,
  }
}
