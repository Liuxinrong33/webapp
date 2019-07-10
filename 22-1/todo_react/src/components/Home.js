import React, { Component } from 'react'
import Menu from './Menu'
import TodoApi from '../api/todo';
import './todo.css'
// class component

class Home extends Component {
    constructor(props) {
        super(props)
        this.api = new TodoApi()
        this.state = {
            name: '',
        }
    }
    onChange = (e) => {
        this.setState({
            name: e.target.value,
        })
        console.log('name onchange', this.state, 'nametype=', typeof this.state.name)
    }
    onLogin = () => {

        this.api.login(this.state.name, this.state, (r) => {
            console.log('登陆成功, response = ', r)
        })
    }
    componentDidMount() {
        console.log('更新页面')
    }

    render() {
        return (

            <div className={'todo-home'}>
                <input type="text" value={this.state.name} onChange={this.onChange}/>
                <button onClick={this.onLogin}>登陆</button>
                {/*Home 组件中渲染 Menu 组件*/}

                <Menu />
                TODO单词本
            </div>
        )
    }
}


// functional component
// function Home() {
//     return (
//         <div>
//             <input/>
//             {/*Home 组件中渲染 Menu 组件*/}
//             <Menu />
//             点击上面的链接
//         </div>
//     )
// }

export default Home
