import { useCallback } from 'react'

const UUID = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  const genUUID = useCallback(() => {
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }, [])

  return [genUUID] as const
}

export default UUID
