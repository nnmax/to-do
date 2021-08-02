import React from 'react'
import TodoInput from '../../components/todoInput'
import style from './style.module.css'

export type Todo = {
  id: string
  label: string
  done: boolean
}

const Home: React.FC = () => {
  return (
    <div className={style.home}>
      <header className={style.header}>To Do</header>
      <section>
        <TodoInput />
      </section>
    </div>
  )
}

export default Home
