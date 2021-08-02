import React, { useRef } from 'react'
import { useUUID, useTodoList } from '../../hooks'
import { Todo } from '../../pages/home'

const TodoInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [genUUID] = useUUID()
  const [setTodo] = useTodoList()

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
    <div>
      <input ref={inputRef} maxLength={50} onKeyPress={onSubmit} type="text" />
    </div>
  )
}

export default TodoInput
