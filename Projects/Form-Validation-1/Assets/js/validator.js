
// đối tượng
function Validator(options) {

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    var selectorRules = {};

    // hàm thực hiện validate 
    function validate(inputElement, rule) {
        // lấy ra cha của element input, rồi từ đó lấy ra element message
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage

        // lấy ra các rule của selector
        var rules = selectorRules[rule.selector]

        // lặp qua từng rule và kiểm tra, nếu có lỗi thì dừng
        for(var i = 0; i < rules.length; i++) {
            switch(inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }

            if(errorMessage) break
        }

        // nếu có lỗi thì hiển thị lỗi và hiện màu đỏ
        // nếu không có thì không hiển thị, màu về bình thường       
        if(errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement,options.formGroupSelector).classList.add('invalid')
        }
        else {
            errorElement.innerText = ''
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage
    }

    // lấy element của form cần validate
    const formElement = document.querySelector(options.form)

    if(formElement) {

        // khi submit form  
        formElement.onsubmit = function(e) {
            e.preventDefault()

            var isFormValid = true

            // lặp qua từng rule và validate luôn
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)

                var isValid = validate(inputElement, rule)
                if(!isValid) {
                    isFormValid = false
                }
            })

            if(isFormValid) {
                // TH submit với javascript
                if(typeof options.onSubmit === 'function') { 
                    // select tất cả thẻ có name và không có disabled
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')

                    var formValues = Array.from(enableInputs).reduce(function(values, input) { 
                        // gán input value vào name và cuối cùng return value
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value
                                break
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values
                                }
                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value)
                                break;
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value

                        }
                        return values
                    }, {})

                    options.onSubmit(formValues) 
                }
                // TH submit với hành vi mặc định
                else {
                    formElement.submit()
                }
            }
            else {
                // console.log('có lỗi')
            }
        }

        // lặp qua mỗi rule và xử lí (lắng nghe sự kiện như blur, input,...)
        options.rules.forEach(function(rule) {

            // lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }

            // lấy các element input 
            var inputElements = formElement.querySelectorAll(rule.selector)
            
            Array.from(inputElements).forEach(function(inputElement) {
                // xử lí TH blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }

                // xử lí TH người dùng đang nhập vào input
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                }
            })

        })


    }
}




// định nghĩa rules
// nguyên tắc của các rules:
// 1. Khi có lỗi => trả ra message lỗi
// 2. Không có lỗi => không trả ra cái gì (undefined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || '✖ Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || '✖ Trường này phải là email'
        }
    }
}
Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `✖ Vui lòng nhập tối thiểu ${min} kí tự!`
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || '✖ Giá trị nhập vào không chính xác'
        }
    }
}