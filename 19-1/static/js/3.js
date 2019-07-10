// 轮播图
// 每个网站包括苹果都有的轮播图组件（什么是组件）
/*
1. 写一个 div 里面有 3 个 img 标签
2. 只显示当前活动的 img 标签
3. 加 1 个按钮，点击的时候切换图片
*/
const nextIndex = function(slide, offset) {
    // let self = button
    // let slide = self.closest('.gua-slide')
    // 得到图片总数和当前图片下标
    let numberOfImgs = parseInt(slide.dataset.imgs, 10)
    let activeIndex = Number(slide.dataset.active)
    // 求出下一张图片的 id
    let i = (activeIndex + offset + numberOfImgs) % numberOfImgs
    return i
}

const bindEventSlide = function() {
    let selector = '.gua-slide-button'
    bindAll(selector, 'click', function(event) {
        let self = event.target
        // 找到 slide div
        let slide = self.parentElement
        // 上一张图片的 offset 是 -1
        // 下一张图片的 offset 是 1
        let offset = Number(self.dataset.offset)
        // 算出下一张图片的 index
        let index = nextIndex(slide, offset)
        // 显示下一张图片
        showImageAtIndex(slide, index)
    })
}
const bindEventSlide2 = function() {
    let selector = '.gua-slide-indi'
    bindAll(selector, 'click', function(event) {

        let self = event.target
        let slicde = self.parentElement
        let indi_index = Number(self.dataset.index)
        log('按钮', indi_index, '被点击了')
        showImageAtIndex(slicde, indi_index)
    })
}
const showImageAtIndex = function(slide, index) {
    let nextIndex = index
    // 设置父节点的 data-active
    slide.dataset.active = nextIndex

    // 删除当前图片的 class 给下一张图片加上 class
    let className = 'gua-active'
    // let classNameleft = 'gua-active-left'
    // let classNameright = 'gua-active-right'
    // setTimeout(function() {
    //
    //
    //     }, 1000)
    removeClassAll(className)
    // removeClassAll(classNameleft)
    // removeClassAll(classNameright)
    let nextSelector = '#id-guaimage-' + String(nextIndex)
    let img = e(nextSelector)
    img.classList.add(className)

    // 切换小圆点
    let indicatorClassName = 'gua-white'
    // 1. 删除当前小圆点的 class

    removeClassAll(indicatorClassName)
    // 2. 得到下一个小圆点的选择器
    let indicatorSelector = '#id-indicator-' + String(nextIndex)
    let indicator = e(indicatorSelector)
    indicator.classList.add(indicatorClassName)
}

const bindEventIndicator = function() {
    let selector = '.gua-slide-indi'
    bindAll(selector, 'mouseover', function(event) {
        let self = event.target
        let index = Number(self.dataset.index)
        log('index', index, typeof index)
        let slide = self.closest('.gua-slide')
        // 直接播放第 n 张图片
        showImageAtIndex(slide, index)
    })
}

const bindEventsImg = function() {
    bindEventSlide()
    // bindEventIndicator()
    bindEventSlide2()
}

const playNextImage = function() {
    let slide = e('.gua-slide')
    // 默认 offset 是 1
    let index = nextIndex(slide, 1)
    // 显示下一张图片
    showImageAtIndex(slide, index)
}

const autoPlay = function() {
    let interval = 5000
    setInterval(function() {
        // 每 2s 都会调用这个函数
        playNextImage()
    }, interval)
}

const timerDemo = function() {
    // 第一个参数是定时会被调用的函数
    // 第二个参数是延迟的时间, 以毫秒为单位, 1s = 1000ms
    // log('time start', new Date())
    // setTimeout(function() {
    //     log('time', new Date())
    // }, 1000)


    // setInterval 会无限执行函数
    // setTimeout 和 setInterval 都有一个返回值
    // 这个返回值可以用来清除定时器
    let clockId = setInterval(function() {
        log('time', new Date())
    }, 1000)
    log('clockId', clockId)
}

// const __main = function() {
//
//     // timerDemo()
// }


