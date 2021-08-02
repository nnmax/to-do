import { useCallback } from 'react'
import { Todo } from '../../pages/home'

export const TODO_LIST_KEY = 'TODO_LIST'

const useTodoList = () => {
  function getTodoList(): Todo[]
  function getTodoList(id: string): Todo | undefined
  function getTodoList(id?: string): Todo | Todo[] | undefined {
    const todoList: Todo[] = []
    const todoListString = localStorage.getItem(TODO_LIST_KEY) || `[]`

    try {
      todoList.push(...(JSON.parse(todoListString) as Todo[]))
    } catch (error) {
      console.error(`${error.name}: ${error.message}.`, error.stack)
    }

    if (id === undefined) return todoList
    return todoList.find((todo) => todo.id === id)
  }

  const getTodoListMemo = useCallback(getTodoList, [])

  const setTodo = useCallback((todo: Todo) => {
    const todoList = getTodoListMemo()
    const index = todoList.findIndex((item) => item.id === todo.id)
    if (index === -1) {
      todoList.push(todo)
    } else {
      todoList[index] = todo
    }
    localStorage.setItem(TODO_LIST_KEY, JSON.stringify(todoList))
  }, [])

  return [setTodo, getTodoListMemo] as const
}

export default useTodoList
