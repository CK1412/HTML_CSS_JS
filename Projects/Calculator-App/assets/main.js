
var buttons = document.querySelectorAll('.btn')
var display = document.querySelector('#result')
var displayHistory = document.querySelector('#display-history')

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(e) {
        printValue(e.target.value)
    })
}

function printValue(value) {
    // loại bỏ số 0 thừa ở đầu các số nguyên
    if(display.innerText == "0" && value != '.') {
        display.innerText = "";
    }

    // xử lí khi click
    if(value == "Del") {
        display.innerText = display.innerText.slice(0, -1)
    }
    else if(value == "C") {
        displayHistory.innerText = ""
        display.innerText = "0"
    }
    else if(value == "=") {
        let result = display.innerText
        displayHistory.innerText = result

        // dấu + giúp loại bỏ số 0 thừa ở cuối
        display.innerText = +eval(result).toFixed(3)
    }
    else {
        display.innerText += value
    }
}



// xử lí dark-mode , light-mode
var calculatorBox = document.querySelector('body')
var toggleBtn = document.querySelector('.toggle-btn')
var isDarkMode = false

toggleBtn.addEventListener('click', function() {
    isDarkMode = !isDarkMode
    this.classList.toggle('active')
    calculatorBox.classList.toggle('dark-mode', isDarkMode)
    calculatorBox.classList.toggle('light-mode', !isDarkMode)
})