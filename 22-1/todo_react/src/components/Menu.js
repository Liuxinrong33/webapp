import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class Menu extends Component {

    render() {
        let menus = [
            {
                text: 'home',
                url: '/',
            },
            {
                text: '开始',
                url: '/todo',
            },
        ]
        return (
            <div>
                <nav>
                    {
                        menus.map((e, index) =>
                            // Link 组件相当于 a 标签的作用, to 相当于 href 属性
                            <Link to={e.url} key={index}>{e.text}</Link>
                        )
                    }
                </nav>
            </div>

        )
    }
}

export default Menu
