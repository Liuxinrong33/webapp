// _ 开头的变量一般表示私有变量, 相当于一个约定
const _ajax = (method, url, data, callback) => {
    let r = new XMLHttpRequest()
    r.open(method, url, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            callback(r.response)
        }
    }
    if (method === 'POST') {
        data = JSON.stringify(data)
    }

    console.log('data', data, typeof data)
    r.send(data)
}

class Api {
    constructor(baseUrl) {
        let url = 'http://localhost:8000/api/todo'
        this.baseUrl = baseUrl || url
    }

    get(path, callback) {
        let method = 'GET'
        let url = this.baseUrl + path
        _ajax(method, url, '', (r) => {
            let t = JSON.parse(r)
            callback(t)
        })
    }

    post(path, data, callback) {
        let url = this.baseUrl + path
        _ajax('POST', url, data, (r) => {
            let t = JSON.parse(r)
            callback(t)
        })
    }
}

export default Api
