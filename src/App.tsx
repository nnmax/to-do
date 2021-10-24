import React, { createContext } from 'react'
import TodoInput from './components/todoInput'
import TodoMenu from './components/todoMenu'
import { useTodoList } from './hooks'
import style from './index.module.css'

export const TodoContext = createContext<
  ReturnType<typeof useTodoList> | undefined
>(undefined)
if (process.env.NODE_ENV !== 'production') {
  TodoContext.displayName = 'TodoContext'
}

const App: React.FC = () => {
  const todoListValue = useTodoList()

  return (
    <div className={style.home}>
      <header className={style.header}>To Do</header>
      <section>
        <TodoContext.Provider value={todoListValue}>
          <TodoInput />
          <TodoMenu />
        </TodoContext.Provider>
      </section>
    </div>
  )
}

export default App
