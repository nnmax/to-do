import React, { useContext, useRef } from 'react'
import { TodoContext } from '../../App'
import { useUUID, Todo } from '../../hooks'

interface TodoInputProps {}

const TodoInput: React.FC<TodoInputProps> = (props) => {
  const todoContextValue = useContext(TodoContext)
  if (!todoContextValue) {
    throw new Error('You must provide a value for TodoContext.Provider')
  }
  const [setTodo] = todoContextValue
  const inputRef = useRef<HTMLInputElement>(null)
  const [genUUID] = useUUID()

  const onSubmit: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') return
    if (inputRef.current === null) return

    const inputValue = inputRef.current.value.trim()
    if (inputValue === '') return
    const todo: Todo = {
      id: genUUID(),
      label: inputValue,
      done: false,
    }

    setTodo(todo)
    inputRef.current.value = ''
  }

  return (
    <input ref={inputRef} maxLength={50} onKeyPress={onSubmit} type="text" />
  )
}

export default TodoInput
