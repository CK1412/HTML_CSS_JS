// gán như này để đỡ phải viết dài
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const tabs = $$(".tab-item")
const images = $$(".image")

const line = $(".line")
const tabActive = $(".tab-item.active")
line.style.left = tabActive.offsetLeft + "px"
line.style.width = tabActive.offsetWidth + "px"

tabs.forEach((tab, index) => {
    const image = images[index]

    tab.onclick = function() {
        // xóa active cũ
        $(".tab-item.active").classList.remove("active")
        $(".image.active").classList.remove("active")

        // thay đổi đường line 
        line.style.left = this.offsetLeft + "px"
        line.style.width = this.offsetWidth + "px"

        // thêm active vào item được click
        this.classList.add("active")
        image.classList.add("active")

    }
})