const fs = require('fs')
const _ = require('lodash')
const blogFilePath = 'db/blog.json'
const commentsFilePath = 'db/comment.json'
// let log = console.log.bind(console)
// 这是一个用来存储 Blog 数据的对象
class ModelBlog {
    constructor(form) {
        // || 是一种新的写法，在 js 圈子里太过流行，所以记住即可
        // a = b || c 意思是如果 b 会转成 false（比如 undefined, null），就把 c 赋值给 a
        this.title = form.title || ''
        this.author = form.author || ''
        this.content = form.content || ''
        // 生成一个 unix 时间，unix 时间是什么，上课会说
        // unix timestamp
        this.created_time = Math.floor(new Date() / 1000)
        this.id = form.id
    }
}

const loadBlogs = () => {
    // 确保文件有内容，这里就不用处理文件不存在或者内容错误的情况了
    let content = fs.readFileSync(blogFilePath, 'utf8')
    let blogs = JSON.parse(content)
    // console.log('load blogs', blogs)
    return blogs
}
const loadComments = () => {
    let content = fs.readFileSync(commentsFilePath, 'utf8')
    let comments = JSON.parse(content)
    console.log('load comments', comments)
    return comments
}
/*
b 这个对象是我们要导出给别的代码用的对象
它有一个 data 属性用来存储所有的 blogs 对象
它有 all 方法返回一个包含所有 blog 的数组
它有 new 方法来在数据中插入一个新的 blog 并且返回
它有 save 方法来保存更改到文件中
*/

const b = {
    data: loadBlogs(),
    comments: loadComments(),
}

b.all = function() {
    let blogs = this.data
    for (let i = 0; i < blogs.length; i++) {
        let blog = blogs[i]
        // let cs = []
        // for (let j = 0; j < comments.length; j++) {
        //     let c = comments[j]
        //     if (blog.id === c.blog_id) {
        //         cs.push(c)
        //     }
        // }
        // blog.comments = cs
        blog.comments = commentsForBlog(blog)
    }
    return blogs
}

b.new = function(form) {
    let m = new ModelBlog(form)
    // console.log('new blog', form, m)
    // 设置新数据的 id
    let d = this.data[this.data.length - 1]
    if (d === undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    // 把数据加入 this.data 数组
    this.data.push(m)
    // 把最新数据保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

/*
它能够删除指定 id 的数据
删除后保存修改到文件中
*/

b.delete = function(id) {
    let blogs = this.data
    let comment = this.comments
    let found = false
    console.log('blogs', blogs)
    console.log('comment', comment)
    for (var i = 0; i < blogs.length; i++) {
        let blog = blogs[i]
        if (blog.id === id) {
            found = true
            break
        }
    }
    // 用 splice 函数删除数组中的一个元素
    // 如果没有找到，i 的值就是无用值，删除也不会报错
    // 所以不用判断也可以
    console.log(i, blogs.length)
    blogs.splice(i, 1)

    console.log(i, blogs.length)
    //删除博客内的评论
    console.log('删除前内容1', this.comments)
    //



    console.log('删除后内容', this.comments)


    // 不返回数据也行，但是还是返回一下好了
    return found
}

b.save = function() {
    let s = JSON.stringify(this.data, null, 2)
    fs.writeFileSync(blogFilePath, s)
}

const commentsForBlog = (blog) => {
    const comment = require('./comment')
    let comments = comment.all()
    let cs = []
    for (let i = 0; i < comments.length; i++) {
        let c = comments[i]
        if (c.blog_id === blog.id) {
            cs.push(c)
        }
    }
    return cs
}

b.get = function(id) {
    let blogs = this.data
    // console.log('blogs', blogs)
    for (let i = 0; i < blogs.length; i++) {
        let blog = blogs[i]
        if (blog.id === id) {
            blog.comments = commentsForBlog(blog)
            return blog
        }
    }
    // 循环结束都没有找到, 说明出错了
    return {}
}

// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了（具体看使用方法）
module.exports = b
