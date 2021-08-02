import useUUID from '.'
import { renderHook } from '@testing-library/react-hooks'

test('testing useUUID function', () => {
  const { result } = renderHook(() => useUUID())
  const [genUUID] = result.current

  const results: string[] = []
  for (let i = 0; i < 1000; i++) {
    const uuid = genUUID()
    results.push(uuid)
  }
  results.forEach((id) => {
    expect(id).toMatch(
      /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789]{12}$/
    )
  })
})
