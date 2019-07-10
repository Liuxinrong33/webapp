// express_demo.js 文件
const fs = require('fs')

// 引入 express 并且创建一个 express 实例赋值给 app
const express = require('express')
const bodyParser = require('body-parser')

// cors 模块用来解决跨域问题
const cors = require('cors')

const log = console.log.bind(console)

const app = express()


// 配置静态文件目录
app.use(express.static('static'))
app.use(cors())
// 自己解析前端发送过来的 json 格式的数据
app.use(bodyParser.json())

var name1 = {
    name: '默认'
}

const getName = () => {
    return name1.name
}
const guasync = (func) => {
    // 第二个参数的意思是延迟 x ms 执行程序
    // 延迟的意思是排队, 就是说延迟 x ms 把这个函数放到队伍里
    setTimeout(() => {
        func()
    }, 0)
}
const loadTodos = () => {
    let data = fs.readFileSync('todo.json')
    console.log('data1111', data)

    let todos = JSON.parse(data)

    return todos
}

const saveTodos = (todos) => {
    let s = JSON.stringify(todos, null, 2)
    fs.writeFileSync('todo.json', s)
}

const todoList = loadTodos()

const sendHtml = (path, response) => {
    let options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        log(`读取的 html 文件 ${path} 内容是`, typeof data)
        // 用 response.send 函数返回数据给浏览器
        response.send(data)
    })
}

const sendJSON = (data, response) => {
    let r = JSON.stringify(data, null, 2)
    response.send(r)
}

const abort = (response, code) => {
    let mapper = {
        400: 'Bad Request',
        404: 'Not Found',
    }
    let text = mapper[code]
    response.status(code).send(text)
}

const todoAdd = (form) => {
    if (todoList.length === 0) {
        form.id = 1
    } else {
        let tail = todoList[todoList.length - 1]
        form.id = tail.id + 1
    }
    let now = Date.now()
    form.createdTime = now
    form.updatedTime = now
    form.done = false
    form.name = getName()
    console.log('getname', getName())
    todoList.push(form)
    saveTodos(todoList)
    return form
}

const todoUpdate = (id, form) => {
    id = Number(id)
    let todo = todoList.find(e => e.id === id)
    if (todo === undefined) {
        return {}
    } else {
        todo.updatedTime = Date.now()
        //把收到的form表单中每个元素写入todo中
        Object.entries(form).forEach(entry => {
            let [k, v] = entry
            todo[k] = v
        })
        // 实际上可以写成下面的形式
        // Object.entries(form).forEach([k, v] => todo[k] = v)
        saveTodos(todoList)
        return todo
    }
}

const todoDelete = (id) => {
    id = Number(id)
    let index = todoList.findIndex(e => e.id === id)
    if (index > -1) {
        let t = todoList.splice(index, 1)[0]
        saveTodos(todoList)
        return t
    } else {
        return {}
    }
}

app.get('/', (request, response) => {
    // console.log('debug 111')
    let path = 'index.html'
    sendHtml(path, response)
})

app.get('/api/todo/all', (request, response) => {
    console.log('todoList in todo', todoList)
    // console.log('todos', todos)
    // console.log('name1 in loadtodos', getName())

    let todoData = todoList
    let tododata1 = []
    console.log('get name1.name', getName())
    console.log('tododata[0] = ', todoData[0], 'tododata[0].name = ', todoData[0].name, '是否相等', todoData[0].name === getName())
    for (let i of todoData) {
        if (i.name === getName()) {
            console.log(i.name)
            tododata1.push(i)
        }
    }
    // todoData = todoList.find(e => e.name === getName())
    console.log('/all路由')
    console.log('tododata1', tododata1)
    // console.log('todoData', todoData)
    sendJSON(tododata1, response)
})

app.post('/api/todo/add', (request, response) => {
    let form = request.body
    log('form', form)
    let todo = todoAdd(form)
    sendJSON(todo, response)
})

app.post('/api/todo/update/:id', (request, response) => {
    let id = request.params.id
    let form = request.body
    let todo = todoUpdate(id, form)
    sendJSON(todo, response)
})


app.get('/api/todo/delete/:id', (request, response) => {
    let id = request.params.id
    let todo = todoDelete(id)
    sendJSON(todo, response)
})

const todoFetch = (id) => {
    id = Number(id)
    let todo = todoList.find(e => e.id === id)
    if (todo === undefined) {
        return {}
    } else {
        return todo
    }
}
const todoLogin = (name) => {
    let todo = todoList
    todo.name = name
    // console.log('name', todo.name)
    name1.name = todo.name
    return todo
}

app.post('/api/todo/login/:name', (request, response) => {
    let name = request.body.name
    // console.log('request.name', name, request)
    let todo = todoLogin(name)
    sendJSON(todo, response)

})
// 实际上很多人喜欢写成下面这样（如果他们有这个能力的话）
// const todoFetch = id => todoList.find(e => e.id === Number(id)) || {}

app.get('/api/todo/:id', (request, response) => {
    let id = request.params.id
    let todo = todoFetch(id)
    sendJSON(todo, response)
})


const main = () => {
    let server = app.listen(8000, () => {
        let host = server.address().address
        let port = server.address().port

        log(`应用实例，访问地址为 http://${host}:${port}`)
    })
}

if (require.main === module) {
    main()
}
