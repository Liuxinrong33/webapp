// const log = console.log.bind(console)

// const e = function(selector) {
//     let element = document.querySelector(selector)
//     if (element === null) {
//         let s = `selector ${selector} not found`
//         alert(s)
//         //
//         return null
//     } else {
//         return element
//     }
// }
const bindAll1 = function(elements, eventName, callback) {
    for (let i = 0; i < elements.length; i++) {
        let tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}
// const es = function(selector) {
//     let elements = document.querySelectorAll(selector)
//     if (elements.length === 0) {
//         let s = `selector ${selector} not found`
//         alert(s)
//         //
//         return []
//     } else {
//         return elements
//     }
// }

const bindevent0 = function() {
    let bs = es('.music')
    bindAll1(bs, 'click', function(event) {
        log('点击')
        let ab = event.target.dataset.id
        log('找到按钮ID', ab)
        if (ab === '#play') {
            e('audio').play()
        } else if (ab === '#pause') {
            e('audio').pause()
        }
    })
}
const setspan = function() {

    let b = e('audio')
    let bc = e('.time-now')
    bc.innerHTML = '当前时间' + secondTomin(b.currentTime)

}
const setvolume = function() {
    let audio = e('audio')
    audio.volume = 0.3
}

const bindEventCanplay = function(audio) {
    log('运行canplay')
    let a = audio
    let duration = 0

    // log('a=', a)
    a.src = 'music/1.mp3'
    a.addEventListener('canplay', function(event) {
        log('监听canplay')
        duration = a.duration
        log(duration)
        test1(duration)
    })

}

const span1 = function() {
    setInterval(setspan, 1000)
    // let bs = e('.time-hole')
    let a = e('audio')
    bindEventCanplay(a)

}
const test1 = function(a) {
    log('a=', a)
    let bs = e('.time-hole')
    bs.innerHTML = '总时间' + secondTomin(a)


}
const secondTomin = function(a) {

    let c = parseInt(a)
    let d = parseInt(c / 60)
    let e = c % 60
    let f = ''
    f = d.toString() + ':' + e.toString()
    return f
}
const bindeventtxt = function() {
    let ds = e('.text-box')
    let a = e('audio')
    log('ds', ds, 'a', a)
    ds.addEventListener('click', function(event) {
        let self = event.target
        let dc= self.dataset.id
        log(dc, 'dc')
        let de = 'music/' + dc.slice(1)
        log(de, 'de')
        playeventmusic(a, de)

    })

}
const playeventmusic = function(audio, src) {
    audio.src = src
    audio.addEventListener('canplay', function(event) {

        log(audio.src, 'src')
        audio.play()
    })

}
const musicloop = function(audio) {
    let a = audio.src
    audio.addEventListener('ended', function(event) {
        audio.src = a
        audio.play()
    })
}
const musiclistloop = function() {
    let a = ['music/1.mp3', 'music/2.mp3', 'music/3.mp3']
    let c = e('audio')

    c.addEventListener('ended', function(event) {
        let b = c.src
        b = b.slice(-5, -4)
        log(b,'b')
        if (b === '3') {
            b = 0
        }
        c.src = a[b]
        log('end b2 ==', b)
        c.play()

    })
}
const musiclistrandom = function() {
    let a = ['music/1.mp3', 'music/2.mp3', 'music/3.mp3']
    let c = e('audio')

    c.addEventListener('ended', function(event) {
        let b = choice(a)

        c.src = b
        log('end b2 ==', b)
        c.play()

    })
}
const choice = function(array) {
    // 1. 得到  0 - 1 之间的小数 a
    // 2. 把 a 转成 0 - array.length 之间的小数
    // 3. 得到 0 - array.length - 1 之间的整数作为下标
    // 4. 得到 array 中的随机元素
    let a = Math.random(1)
    a = a * 3
    a = parseInt(a)
    log('随机数 =', a)
    return array[a]
}
const playEventListener = function() {
    let c = e('audio')
    let doge = e('.doge-jpg')
    c.addEventListener('play', () => {
        doge.classList.add('doge-action')
    })
    c.addEventListener('pause', () => {
        doge.classList.remove('doge-action')
    })
}
const main0 = function() {
    bindevent0()
    setvolume()
    span1()
    bindeventtxt()
    musiclistrandom()
    playEventListener()
}

