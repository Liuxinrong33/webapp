import React, { Component } from 'react'
import Menu from './Menu'
import TodoApi from '../api/todo'

class TodoDetail extends Component {
    constructor(props) {
        super(props)
        this.api = new TodoApi()
        this.state = {
            // this.props.match.params 获取 react router 动态路由的值
            id: this.props.match.params.id,
            todo: {},
        }
    }

    componentDidMount() {
        let id = this.state.id
        let todoId = String(id)
        this.api.detail(todoId, (r) => {
            this.setState({
                todo: r,
            })
        })
    }

    render() {
        let todo = this.state.todo
        return (
            <div>
                <Menu />
                <div>
                    {
                        Object.entries(todo).map((e, index) => {
                            let [k, v] = e
                            return (
                                <pre key={index}>
                                    ({k}): ({v})
                                </pre>
                            )
                        })
                    }
                </div>
                {/*<div>{ JSON.stringify(todo) }</div>*/}
            </div>
        )
    }
}

export default TodoDetail
