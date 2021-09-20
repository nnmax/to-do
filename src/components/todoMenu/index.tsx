import React, { useMemo } from 'react'
import { useTodoList, Todo } from '../../hooks'
import { debounce } from 'lodash'

interface TodoMenuProps {
  setTodo: ReturnType<typeof useTodoList>[0]
  getTodo: ReturnType<typeof useTodoList>[1]
}

const TodoMenu: React.FC<TodoMenuProps> = (props) => {
  const { setTodo, getTodo } = props

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
