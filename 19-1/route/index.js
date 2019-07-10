const fs = require('fs')
const comment = require('../model/comment')

const sendHtml = (path, response) => {
    let options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, (error, data) => {
        console.log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}

const index = {
    path: '/',
    method: 'get',
    func: (request, response) => {
        let path = 'blog_index.html'
        sendHtml(path, response)
    }
}

const blogDetail = {
    path: '/blog/:id',
    method: 'get',
    func: (request, response) => {
        let id = request.params.id
        let path = 'blog_detail.html'
        // sendHtml(path, response)
        let options = {
            encoding: 'utf-8'
        }
        path = 'template/' + path
        fs.readFile(path, options, (error, data) => {
            // console.log(`读取的html文件 ${path} 内容是`, data)
            let s = data.replace('{{id}}', id)
            // console.log('s is', s)
            response.send(s)
        })
    }
}

const routes = [
    index,
    blogDetail,
]

module.exports.routes = routes

// module.exports = {
//     routes: routes,
// }