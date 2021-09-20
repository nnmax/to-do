import 'jest-localstorage-mock'
import useTodoList, { TODO_LIST_KEY } from '.'
import { renderHook, act } from '@testing-library/react-hooks'

describe('testing useTodoList', () => {
  afterEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  test('应该可以正确的设置 todo list', () => {
    const { result, rerender } = renderHook(() => useTodoList())
    const [setTodo] = result.current
    const todo = {
      id: 'id',
      label: 'label',
      done: false,
    }
    act(() => setTodo(todo))
    rerender()
    const [, getTodoList] = result.current
    const todoList = getTodoList()

    expect(todoList[0]).toEqual(todo)
  })

  test('应该可以按 ID 获取 todo', () => {
    const { result, rerender } = renderHook(() => useTodoList())
    const [setTodo] = result.current
    const todoList = [
      {
        id: 'id',
        label: 'label',
        done: false,
      },
      {
        id: 'id2',
        label: 'label2',
        done: true,
      },
    ]
    act(() => {
      setTodo(todoList[0])
      setTodo(todoList[1])
    })
    rerender()
    const [, getTodoList] = result.current
    const todo = getTodoList(todoList[1].id)

    expect(todo).toEqual(todoList[1])
  })

  test('应该可以正确覆盖 todo', () => {
    localStorage.setItem(
      TODO_LIST_KEY,
      JSON.stringify([{ id: 'id', label: 'label', done: false }])
    )
    const { result, rerender } = renderHook(() => useTodoList())
    const [setTodo] = result.current
    act(() =>
      setTodo({
        id: 'id',
        label: 'label2',
        done: true,
      })
    )
    rerender()
    const [, getTodoList] = result.current

    expect(getTodoList()).toHaveLength(1)
  })

  test('set 可以传一个函数', () => {
    const { result, rerender } = renderHook(() => useTodoList())
    const [setTodo] = result.current
    const todo = {
      id: 'id',
      label: 'label',
      done: false,
    }
    act(() => {
      setTodo(() => todo)
    })
    rerender()
    const [, getTodo] = result.current
    expect(JSON.stringify(getTodo('id'))).toBe(JSON.stringify(todo))
  })

  test('移除 todo', () => {
    localStorage.setItem(
      TODO_LIST_KEY,
      JSON.stringify([{ id: 'id', label: 'label', done: false }])
    )
    const { result, rerender } = renderHook(() => useTodoList())
    const [, , remove] = result.current
    // @ts-ignore
    act(() => remove({ id: 'id' }))
    rerender()
    const [, getTodo] = result.current
    expect(getTodo('id')).toBeUndefined()
  })
})
