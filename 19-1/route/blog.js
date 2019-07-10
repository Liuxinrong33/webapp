const blog = require('../model/blog')
console.log('blog 的值', blog)
const log = console.log.bind(console)
const all = {
    path: '/api/blog/all',
    method: 'get',
    func: (request, response) => {
        let blogs = blog.all()
        let r = JSON.stringify(blogs)
        response.send(r)
    }
}

const add = {
    path: '/api/blog/add',
    method: 'post',
    func: (request, response) => {
        // 浏览器发过来的数据我们一般称之为 form（表单）
        let form = request.body
        // 插入新数据并返回
        // 验证密码
        let r
        if (form.mima === '') {
            let b = blog.new(form)
            r = JSON.stringify(b)
        } else {
            r = JSON.stringify({})
        }
        response.send(r)
    }
}

/*
请求 POST /api/blog/delete 来删除一个博客
ajax 传的参数是下面这个对象的 JSON 字符串
{
    id: 1
}
*/

// 用 deleteBlog 而不是 delete 是因为 delete 是一个 js 关键字（就像是 function 一样）
const deleteBlog = {
    path: '/api/blog/delete',
    method: 'post',
    func: (request, response) => {
        // 浏览器发过来的数据我们一般称之为 form（表单）
        let form = request.body
        // 删除数据并返回结果
        let success = blog.delete(form.id)
        let result = {
            success: success,
        }
        let r = JSON.stringify(result)
        response.send(r)
    }
}

const detailBlog = {
    path: '/api/blog/:id',
    method: 'get',
    func: (request, response) => {
        let id = Number(request.params.id)
        let b = blog.get(id)
        let r = JSON.stringify(b)
        response.send(r)
    }
}

const routes = [
    all,
    add,
    deleteBlog,
    detailBlog,
]

module.exports.routes = routes
