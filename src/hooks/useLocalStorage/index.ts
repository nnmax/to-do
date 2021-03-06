import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
} from 'react'

type ParserOptions<T> =
  | {
      raw: true
    }
  | {
      raw: false
      serializer: (value: T) => string
      deserializer: (value: string) => T
    }

const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
  options?: ParserOptions<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
  const deserializer = useMemo(() => {
    if (!options) return JSON.parse
    if (options.raw) return (value: string) => value
    return options.deserializer
  }, [options])

  const initializer = useRef((key: string) => {
    try {
      const serializer = options
        ? options.raw
          ? String
          : options.serializer
        : JSON.stringify

      const localStorageValue = localStorage.getItem(key)
      if (localStorageValue !== null) {
        return deserializer(localStorageValue)
      } else {
        initialValue && localStorage.setItem(key, serializer(initialValue))
        return initialValue
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue
    }
  })

  const [state, setState] = useState<T | undefined>(() =>
    initializer.current(key)
  )

  useLayoutEffect(() => setState(initializer.current(key)), [key])

  const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (valOrFunc) => {
      try {
        const newState =
          typeof valOrFunc === 'function'
            ? (valOrFunc as (prevState: T | undefined) => T | undefined)(state)
            : valOrFunc
        if (typeof newState === 'undefined') return
        let value: string

        if (options) {
          if (options.raw) {
            if (typeof newState === 'string') {
              value = newState
            } else {
              value = JSON.stringify(newState)
            }
          } else if (options.serializer) {
            value = options.serializer(newState)
          } else {
            value = JSON.stringify(newState)
          }
        } else {
          value = JSON.stringify(newState)
        }

        localStorage.setItem(key, value)
        setState(deserializer(value))
      } catch {
        // If user is in private mode or has storage restriction
        // localStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, deserializer, options, state]
  )

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setState(undefined)
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw.
    }
  }, [key])

  return [state, set, remove]
}

export default useLocalStorage
