import React, { Component } from 'react'
import Menu from './Menu'
import TodoList from './TodoList'
import TodoCounter from './TodoCounter'
import TodoApi from '../api/todo'

import './todo.css'

const log = console.log.bind(console)


// Todo 组件是我们的主要组件
// 用来渲染 todo 相关内容
class Todo extends Component {
    constructor(props) {
        super(props)
        this.api = new TodoApi()
        this.state = {
            todos: [],
            text: '',
        }
        // 提前绑定好四个方法的 this
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    // 注意, ajax 请求要放在 componentDidMount 生命周期中
    // 这样获取数据后就可以调用 setState 更新 UI
    componentDidMount() {
        this.api.all(r => {
            // 获取数据后在回调函数中更新 todos 的值
            console.log('r in all', r)
            this.setState({
                todos: r,
            })
        })
    }

    onUpdate(todo) {
        // 先拿到 TodoItem 传过来的参数
        let todos = this.state.todos
        // log('before update', todos, JSON.stringify(todos))
        // 根据 id 找到 Todo 组件中的 todo 数据, 并且赋值给 t
        let t = todos.find(e => e.id === todo.id)
        // 更新 t 的 done 属性
        t.done = todo.done
        // log('after update', todos, JSON.stringify(todos))
        this.setState({
            todos: todos,
        })
    }

    onDelete(id) {
        let todos = this.state.todos
        let index = todos.findIndex(e => e.id === id)
        todos.splice(index, 1)
        this.setState({
            todos: todos,
        })
    }

    render() {
        let todos = this.state.todos
        return (
            <div>
                <Menu />
                <h2>单词列表</h2>
                {/*onUpdate 和 onDelete 是用来解决组件间通信的方案*/}
                <TodoList todos={todos} onTodoUpdate={this.onUpdate} onTodoDelete={this.onDelete}/>
                {/*下面这个组件用来处理 todo 相关统一信息*/}
                <TodoCounter todos={todos}/>
                <form onSubmit={this.onSubmit}>
                    {/*for 是 js 关键字, jsx 里面要使用 htmlFor 属性*/}
                    <label htmlFor="new-todo">
                        新建生词
                    </label>
                    <input
                        id="new-todo"
                        onChange={this.onChange}
                        value={this.state.text}
                    />
                    <button>
                        添加第 {todos.length + 1} 个 单词
                    </button>
                </form>
            </div>
        )
    }

    onChange(e) {
        this.setState({
            text: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()
        if (this.state.text.length === 0) {
            return
        }
        let task = this.state.text
        let data = {
            task,
        }
        let todos = this.state.todos
        this.api.add(data, (r) => {
            todos.push(r)
            this.setState({
                todos: todos,
                text: '',
            })
        })
    }
}

export default Todo
