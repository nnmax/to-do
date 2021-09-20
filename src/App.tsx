import React from 'react'
import TodoInput from './components/todoInput'
import TodoMenu from './components/todoMenu'
import { useTodoList } from './hooks'
import style from './index.module.css'

const App: React.FC = () => {
  const [setTodo, getTodo] = useTodoList()

  return (
    <div className={style.home}>
      <header className={style.header}>To Do</header>
      <section>
        <TodoInput setTodo={setTodo} />
        <TodoMenu setTodo={setTodo} getTodo={getTodo} />
      </section>
    </div>
  )
}

export default App
