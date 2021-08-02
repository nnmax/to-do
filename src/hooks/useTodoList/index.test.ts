import useTodoList, { TODO_LIST_KEY } from '.'
import { renderHook, act } from '@testing-library/react-hooks'

class LocalStorageMock {
  store: Record<string, string>
  constructor() {
    this.store = {}
  }

  getItem(key: string) {
    return this.store[key] || null
  }

  setItem(key: string, value: string) {
    this.store[key] = value
  }

  clear() {
    this.store = {}
  }
}

const oldLocalStorage = global.localStorage

describe('testing useTodoList', () => {
  // mock global.localStorage
  beforeAll(() => {
    const localStorageMock = new LocalStorageMock()
    // @ts-ignore
    global.localStorage = localStorageMock
  })

  afterAll(() => {
    // @ts-ignore
    global.localStorage = oldLocalStorage
  })

  beforeEach(() => {
    global.localStorage.clear()
  })

  test('应该可以正确的设置 todo list', () => {
    const { result } = renderHook(() => useTodoList())
    const [setTodo, getTodoList] = result.current
    const todo = {
      id: 'id',
      label: 'label',
      done: false,
    }
    act(() => {
      setTodo(todo)
    })
    const todoList = getTodoList()

    expect(todoList[0]).toEqual(todo)
  })

  test('应该可以按 ID 获取 todo', () => {
    const { result } = renderHook(() => useTodoList())
    const [setTodo, getTodoList] = result.current
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

    const todo = getTodoList(todoList[1].id)

    expect(todo).toEqual(todoList[1])
  })

  test('应该可以正确覆盖 todo', () => {
    const { result } = renderHook(() => useTodoList())
    const [setTodo, getTodoList] = result.current
    const todo = {
      id: 'id',
      label: 'label',
      done: false,
    }
    act(() => {
      setTodo(todo)
    })

    const updatedTodo = {
      ...todo,
      label: 'label2',
      done: true,
    }

    act(() => {
      setTodo(updatedTodo)
    })

    expect(updatedTodo).toEqual(getTodoList(todo.id))
  })

  test('传类型错误的数据时应该报错', () => {
    const { result } = renderHook(() => useTodoList())
    const [, getTodoList] = result.current

    act(() => {
      window.localStorage.setItem(TODO_LIST_KEY, 'error type')
    })

    const error = jest.spyOn(global.console, 'error').mockImplementation()

    const todoList = getTodoList()

    expect(error).toHaveBeenCalledTimes(1)
    expect(todoList).toHaveLength(0)

    error.mockReset()
    error.mockRestore()
  })
})
