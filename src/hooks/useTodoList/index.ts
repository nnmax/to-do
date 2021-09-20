import { cloneDeep } from 'lodash'
import { useCallback, useEffect } from 'react'
import { useLocalStorage } from '..'

export const TODO_LIST_KEY = 'TODO_LIST'

export type Todo = {
  id: string
  label: string
  done: boolean
}

type GetTodoListFunc = {
  (): Todo[]
  (id: string): Todo | undefined
}

const useTodoList = () => {
  const [todoList = [], setTodoList] = useLocalStorage<Todo[]>(TODO_LIST_KEY)

  const getTodoListMemo = useCallback(
    (id?: string) => {
      if (id === undefined) return todoList
      return todoList.find((todo) => todo.id === id)
    },
    [todoList]
  ) as GetTodoListFunc

  const setTodo = useCallback(
    (todoOrFunc: Todo | ((prevTodoList: Todo[]) => Todo)) => {
      const todo: Todo =
        typeof todoOrFunc === 'function' ? todoOrFunc(todoList) : todoOrFunc
      const index = todoList.findIndex((todoItem) => todoItem.id === todo.id)
      if (index === -1) {
        setTodoList((prevTodoList = []) => {
          return [todo, ...prevTodoList]
        })
      } else {
        setTodoList((prevTodoList = []) => {
          const originalTodoList = cloneDeep(prevTodoList)
          originalTodoList[index] = todo
          return originalTodoList
        })
      }
    },
    [todoList, setTodoList]
  )

  const removeTodo = useCallback(
    (todoOrFunc: Todo | ((prevTodoList: Todo[]) => Todo)) => {
      const todo: Todo =
        typeof todoOrFunc === 'function' ? todoOrFunc(todoList) : todoOrFunc
      setTodoList((prevTodoList = []) =>
        prevTodoList.filter((todoItem) => todoItem.id !== todo.id)
      )
    },
    [todoList, setTodoList]
  )

  return [setTodo, getTodoListMemo, removeTodo] as const
}

export default useTodoList
