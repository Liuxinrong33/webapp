// const log = console.log.bind(console)

const ajax = (request) => {
    /*
    request 是一个 object，有如下属性
        method，请求的方法，string
        url，请求的路径，string
        data，请求发送的数据，如果是 GET 方法则没有这个值，string
        callback，响应回调，function
    */
    let r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

// const e = (selector) => document.querySelector(selector)

const templateBlog = function(blog) {
    let id = blog.id
    let title = blog.title
    let author = blog.author
    // blog.created_time 是 秒，new Date 的参数是 毫秒，所以 *1000
    let d = new Date(blog.created_time * 1000)
    let time = d.toLocaleString()
    let t = `
        <div class="gua-blog-cell">
            <div class="">
                <a class="blog-title" href="/blog/${id}" data-id="${id}">
                    ${title}
                </a>
                <button class="comment-delete">删除博客</button>
            </div>
            <div class="">
                <span>${author}</span> @ <time>${time}</time>
            </div>
            <div class="blog-comments">
                <div class="new-comment">
                    <input class="comment-blog-id" type=hidden value="${id}">
                    <div>评论者：
                        <input class="comment-author" value="">
                    </div>
                    <div>评论内容：
                        <input class="comment-content" value="">
                    </div>
                    
                    <button class="comment-add">添加评论</button>
                </div>
            </div>
        </div>
    `
    return t
}

const insertBlogAll = function(blogs) {
    let html = ''
    for (let i = 0; i < blogs.length; i++) {
        let b = blogs[i]
        let t = templateBlog(b)
        html += t
    }
    // 把数据写入 .gua-blogs 中，直接用覆盖式写入
    let div = document.querySelector('.gua-blogs')
    div.innerHTML = html
}

const blogAll = function(callback) {
    let request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            console.log('响应', response)
            let blogs = JSON.parse(response)
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

const blogNew = function(form) {
    let data = JSON.stringify(form)
    let request = {
        method: 'POST',
        url: '/api/blog/add',
        contentType: 'application/json',
        data: data,
        callback: function(response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            console.log('响应', response)
            let res = JSON.parse(response)
        }
    }
    log('新增博客的request', request)
    ajax(request)
}
const blogDelete = function(form) {
    let data = JSON.stringify(form)
    let request = {
        method: 'POST',
        url: '/api/blog/delete',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应删除', response)
        }
    }
    log('删除的请求request', request)
    ajax(request)
}
const commentNew = (form, callback) => {
    let data = JSON.stringify(form)
    let request = {
        method: 'POST',
        url: '/api/comment/add',
        contentType: 'application/json',
        data: data,
        callback: function(response) {
            let c = JSON.parse(response)
            callback(c)
        }
    }

    ajax(request)
}

const actionCommentAdd = (event) => {
    let self = event.target
    let form = self.closest('.new-comment')
    let blogId = form.querySelector('.comment-blog-id').value
    let author = form.querySelector('.comment-author').value
    let content = form.querySelector('.comment-content').value
    let data = {
        blog_id: blogId,
        author: author,
        content,
    }
    commentNew(data, (r) => {
        log('comment new r is', r)
    })
}

const actionDelete = (event) => {
    let self = event.target
    let form = self.closest('.gua-blog-cell')
    let blogId = form.querySelector('.blog-title').dataset.id

    blogId = parseInt(blogId)
    log('id属性', typeof(blogId))
    log('form', form)
    let data = {
        id: blogId,
    }
    blogDelete(data, (r) => {
        log('删除成功', r)
    })
}
const bindEvents = function() {
    // 绑定发表新博客事件
    let button = e('#id-button-submit')
    button.addEventListener('click', function(event) {
        console.log('click new')
        // 得到用户填写的数据

        let form = {
            title: e('#id-input-title').value,
            author: e('#id-input-author').value,
            content: e('#id-input-content').value,
            mima: e('#id-input-mima').value,

        }
        // 用这个数据调用 blogNew 来创建一篇新博客
        blogNew(form)
        //刷新页面
        location.reload()
    })
    //绑定添加评论和删除博客事件

    document.body.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('comment-add')) {
            actionCommentAdd(event)
            location.reload()
        } else if (self.classList.contains('comment-delete')) {
            actionDelete(event)
            location.reload()
        }
    })
}

const __main = function() {
    // 载入博客列表
    blogAll()
    // 绑定事件
    bindEvents()
    bindEventsImg()
    autoPlay()
    main0()
}

__main()
