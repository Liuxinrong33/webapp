import React, { Component } from 'react'

class TodoCounter extends Component {
    render() {
        let todos = this.props.todos
        let total = todos.length
        let completeLength = todos.filter(e => e.done).length
        let uncompleteLength = todos.filter(e => !e.done).length
        return (
            <div className="todo-counter">
                <p>统计</p>
                <div className="todo-table">
                    <div className="todo-row">
                        <span className="cell">总计单词数</span>
                        <span className="cell">记住的</span>
                        <span className="cell">未记住</span>
                    </div>
                    <div className="todo-row">
                        <span className="cell">{total}</span>
                        <span className="cell">{completeLength}</span>
                        <span className="cell">{uncompleteLength}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default TodoCounter
