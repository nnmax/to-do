import React, { useContext, useMemo } from 'react'
import { Todo } from '../../hooks'
import { debounce } from 'lodash'
import { TodoContext } from '../../App'

interface TodoMenuProps {}

const TodoMenu: React.FC<TodoMenuProps> = () => {
  const todoContextValue = useContext(TodoContext)
  if (!todoContextValue) {
    throw new Error('You must provide a value for TodoContext.Provider')
  }
  const [setTodo, getTodo] = todoContextValue
  const todoList = useMemo(() => getTodo(), [getTodo])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target
    setTodo((prevTodoList) => {
      const todo = prevTodoList.find((todoItem) => todoItem.id === id) as Todo
      return { ...todo, done: checked }
    })
  }

  return (
    <ul>
      {todoList.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            defaultChecked={todo.done}
            id={todo.id}
            onChange={debounce(handleCheckboxChange, 500)}
          />
          <label htmlFor={todo.id}>{todo.label}</label>
        </li>
      ))}
    </ul>
  )
}

export default TodoMenu
