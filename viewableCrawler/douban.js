// node 标准库放在前面
const fs = require('fs')

// 接着放第三方库
const request = require('syncrequest')
const cheerio = require('cheerio')

// 最后放自己写的模块
const log = console.log.bind(console)


// ES6 定义一个类
class Movie {
    constructor() {
        // 分别是电影名/评分/引言/排名/封面图片链接
        this.name = ''
        this.score = 0
        this.quote = ''
        this.ranking = 0
        this.coverUrl = ''
        this.year = ''
        this.area = ''
        this.type = ''
        this.Number = 0
    }
}

// class Movie {
//     constructor() {
//         // 分别是电影名/评分/引言/排名/封面图片链接
//         this.Name = ''
//         this.SCORE = 0
//         this.quote = ''
//         this.ranking = '0'
//         this.cover_url = ''
//     }
// }

// 防御式编程
const clean = (movie) => {
    let m = movie
    let o = {
        name: m.Name,
        score: m.SCORE,
        quote: m.quote,
        ranking: Number(m.ranking),
        coverUrl: m.cover_url,
        otherNames: '',
    }
    return o
}

const movieFromDiv = (div) => {
    let e = cheerio.load(div)

    // 创建一个电影类的实例并且获取数据
    // 这些数据都是从 html 结构里面人工分析出来的
    let movie = new Movie()
    // text() 方法相当于元素的 outerText 属性, 可以获取元素的文本

    // innerHTML 和 outerText 的区别
    // innerHTML 得到的是所有子元素的文本(包含标签), a.innerHTML 是 <span>123</span>
    // outerText 得到的只有文本, 会忽略标签, a.outerText 是 123
    /*
    <div class="a">
        <span>123</span>
    </div>
    */

    movie.name = e('.title').text()
    let score = e('.rating_num').text()
    movie.score = Number(score)
    movie.quote = e('.inq').text()

    let pic = e('.pic')
    // find 是用来查找子元素的
    let ranking = pic.find('em').text()
    movie.ranking = Number(ranking)
    // attr() 方法是用来获取元素相关属性的,
    // attr('src') 获取的是元素 src 属性的值
    movie.coverUrl = pic.find('img').attr('src')

    let other = e('.other').text()
    movie.otherNames = other.slice(3).split('  /  ').join('/')

    let Number1 = e('.star').find('span').last().text().slice(0, -3)
    // log('number1',Number1)
    movie.Number = Number(Number1)

    let text1 = e('.bd').find('p').first().text()
    let a = findAllString(text1, '/')
    // log('a', a)
    // log(text1)
    let a1 = a[a.length - 2]
    let a2 = a[a.length - 1]
    // log('a1', a1, 'a2', a2)
    movie.year = Number(text1.slice(a1 - 5, a1 - 1))
    // log('year', movie.year)
    movie.area = text1.slice(a1 + 1, a2 - 1)
    // log('area', movie.area)
    movie.type = text1.slice(a2 + 1, a2 + 4)
    // log('type', movie.type)
    return movie
}
const findAllString = function(s1, s2) {
    /*
    s1 是一个字符串
    s2 是一个字符串, 长度未知, 不一定为 1
    返回参数 s2 在 s1 中出现的下标组成的 array
    如果 s2 没有在 s1 中出现, 返回 []


    */
    let array1 = []
    let n1 = s2.length
    let sli1 = ''
    for (let i = 0; i < s1.length; i++) {
        sli1 = s1.slice(i, (i + n1))
        if (sli1 === s2) {
            array1.push(i)
        }
    }
    return array1


}
const ensurePath = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

const cachedUrl = (url) => {
    let directory = 'cached_html'
    ensurePath(directory)

    // 1. 确定缓存的文件名称
    let cacheFile = directory + '/' + url.split('?')[1] + '.html'
    log('cacheFile', cacheFile)
    // 2. 检查缓存文件是否存在
    // 如果存在就读取缓存文件
    // 如果不存在就下载并且写入缓存文件
    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data
    } else {
        // 用 GET 方法获取 url 链接的内容
        // 相当于你在浏览器地址栏输入 url 按回车后得到的 HTML 内容
        let r = request.get.sync(url)
        let body = r.body
        // 写入缓存
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

const moviesFromUrl = (url) => {
    // 用 GET 方法获取 url 链接的内容
    // 相当于你在浏览器地址栏输入 url 按回车后得到的 HTML 内容
    // let r = request.get.sync(url)
    // utf-8 是网页文件的文本编码
    // let body = r.body
    let body = cachedUrl(url)
    // cheerio.load 用来把 HTML 文本解析为一个可以操作的 DOM（方便查找）
    let e = cheerio.load(body)

    // 一共有 25 个 .item
    // 类似我们之前实现的 es 函数, 但是 e 不仅可以查找一个元素, 也可以查到多个元素
    let movieDivs = e('.item')
    // 循环处理 25 个 .item
    let movies = []
    for (let i = 0; i < movieDivs.length; i++) {
        let div = movieDivs[i]
        // 扔给 movieFromDiv 函数来获取到一个 movie 对象
        let m = movieFromDiv(div)
        movies.push(m)
    }
    return movies
}

const saveMovies = (movies) => {
    // JSON.stringify 第 2 3 个参数配合起来是为了让生成的 json
    // 数据带有缩进的格式，第三个参数表示缩进的空格数
    // 建议当套路来用
    // 如果你一定想要知道原理，看下面的链接（不建议看）
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    let s = JSON.stringify(movies, null, 2)
    // 把 json 格式字符串写入到 文件 中
    let path = 'db/douban.json'
    fs.writeFileSync(path, s)
}

const downloadCovers = (movies) => {
    let coverPath = 'covers'
    ensurePath(coverPath)
    const request = require('request')
    for (let i = 0; i < movies.length; i++) {
        let m = movies[i]
        let url = m.coverUrl
        let ranking = m.ranking
        let name = m.name.split(' / ')[0]
        let path = `${coverPath}/${ranking}_${name}.jpg`
        // log('cover path', path)
        // 下载并且保存图片的套路
        request(url).pipe(fs.createWriteStream(path))
    }
}

const __main = () => {
    // 主函数
    let movies = []
    for (let i = 0; i < 10; i++) {
        let start = i * 25
        let url = `https://movie.douban.com/top250?start=${start}&filter=`
        let moviesInPage = moviesFromUrl(url)
        // ES6 的语法
        movies = [...movies, ...moviesInPage]
        // ES5 的语法
        // movies = movies.concat(moviesInPage)
    }
    saveMovies(movies)
    downloadCovers(movies)
    log('抓取成功, 数据已经写入到 douban.json 中')
}

__main()
