require('normalize.css')
require('../iconfont/iconfont.css')

require('swiper')
require('swiper/dist/css/swiper.min.css')

require('./app.less')

var body = Swiper('body').container

function f(css) {
	return body.find(css)
}

new Swiper('.indexBanner', {
	pagination: '.indexBanner .swiper-pagination',
	slidesPerView: 'auto',
	centeredSlides: true,
	paginationClickable: true,
	nextButton: '.indexBanner .swiper-button-next',
	prevButton: '.indexBanner .swiper-button-prev',
	autoplay: 3000
})   ; 

/*   new Swiper('.fastlink .inner', {
        pagination: '.fastlink .inner .swiper-pagination',
        centeredSlides: true,
        paginationClickable: true,
         slidesPerView: 5,
        spaceBetween: 50,
        breakpoints: {
            1024: {
                slidesPerView: 4,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            }
        }
    });*/

var nav = f('nav')
nav.on('click', '.menuBtn', function() {
	nav.toggleClass('showLeft')
})
nav.on('click', '.menu', function(e) {
	var t = e.target.tagName
	if(t != 'LI' && t != 'A') nav.toggleClass('showLeft')
})


var priceItem = f('.product .priceItem')
var priceLed = f('.product .price strong')
priceItem.on('click', function(e) {
	priceItem.removeClass('active')

	priceLed.text(this.getAttribute('value'))
	this.className += ' active'
})

var detailTab = f('#detailTab')
var detailHead = detailTab.find('.head li')
var detailBody = detailTab.find('.body li')
var detailH = detailBody.find('h3')

detailHead.on('click', setTabActive)
detailH.on('click', setTabActive)

function setTabActive(e) {
	var to = this.getAttribute('tab-to')
	if(Number(to) < 0) return;
	detailHead.removeClass('active')
	detailBody.removeClass('active')
	detailH.removeClass('active')
	detailHead.eq(to).addClass('active')
	detailBody.eq(to).addClass('active')
	detailH.eq(to).addClass('active')
}

// 列表页 分页
/*if( pageConfig && pageConfig.pageIndex && pageConfig.pageSize) {
	const r = new XMLHttpRequest()
	r.open('GET', '/posts/pagination', true)
	r.onreadystatechange = function() {
		if(r.readyState != 4 || r.status != 200) {
			return
		}
		const res = JSON.parse(r.responseText)
		const totalPage = Math.ceil(res.total / pageConfig.pageSize)
		// 如果手动输入 url 并且大于 totalPage 的话
		if(pageConfig.pageIndex > totalPage && totalPage > 1) {
			window.location.href = '/posts/page/' + totalPage
		} else if(totalPage === 1) {
			return
		}

		// 准备分页 dom
		let htmlStr = ''
		// prev
		if(pageConfig.pageIndex > 1) {
			htmlStr += `<a class="page-num prev" href="/posts/page/${pageConfig.pageIndex - 1}" title="上一页"></a>`
		}
		for(let i = 1; i < totalPage + 1; i++) {
			if(i === pageConfig.pageIndex) {
				htmlStr += `<span class="page-num current">${i}</span>`
			} else {
				htmlStr += `<a class="page-num" href="/posts/page/${i}">${i}</a>`
			}
		}
		// next
		if(pageConfig.pageIndex < totalPage) {
			htmlStr += `<a class="page-num next" href="/posts/page/${pageConfig.pageIndex + 1}" title="下一页"></a>`
		}

		const paginationBox = document.createElement('div')
		paginationBox.classList.add('pagination')
		paginationBox.innerHTML = htmlStr
		document.getElementsByClassName('main-inner')[0].appendChild(paginationBox)
	};
	r.send()
}
*/