
function Validator (options) {

    var formRules = {}

    function getParent (element, selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement
            }
            else {
                element = element.parentElement
            }
        }
    }

    /*
    Quy ước tạo rule:
    - có lỗi thì return message error
    - không có lỗi thì return undefined
    */
    var validatorRules = {
        required: function (value) {
            return value ? undefined : '✖ Please enter this field.'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : '✖ This email is invalid.'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `✖ Your password must be at least ${min} characters.`
            }
        }
    }

    // lấy ra form element trong DOM theo formSelector    
    const formElement = document.querySelector(options.form);

    // chỉ xử lí khi có element trong DOM
    if(formElement) {
        const inputs = formElement.querySelectorAll('[name][rules]')

        for(var input of inputs) {

            // rules là do ta tự định nghĩa lên phải lấy bằng getAttribute
            var rules = input.getAttribute('rules').split('|')

            for(var rule of rules) {

                var ruleInfor 
                var isRuleHasValue = rule.includes(':')

                if(isRuleHasValue) {
                    ruleInfor = rule.split(':')
                    rule = ruleInfor[0]
                }

                var ruleFunct = validatorRules[rule]

                if(isRuleHasValue) {
                    ruleFunct = ruleFunct(ruleInfor[1])
                }

                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunct)
                }
                else {
                    formRules[input.name] = [ruleFunct]
                }
            }
            

            // lắng nghe sự kiện để validate (blur, change,...)
            input.onblur = handleValidate
            input.oninput = handleClearError

        }

        // hàm thực hiện validate
        function handleValidate(event) {
            var rules = formRules[event.target.name]

            // trả về đoạn text thông báo lỗi nếu có
            var errorMessage

            for(var rule of rules) {
                errorMessage = rule(event.target.value)
                if(errorMessage)
                    break
            }

            // nếu có lỗi thì hiển thị message error
            if(errorMessage) {
                var formGroup = getParent(event.target, options.formGroupSelector)
                if(formGroup) {
                    formGroup.classList.add('invalid')

                    var formMessage = formGroup.querySelector(options.errorSelector)
                    if(formMessage) {
                        formMessage.innerText = errorMessage
                    }
                }
            }

            return !errorMessage
        }

        // hàm clear message error
        function handleClearError(event) {
            var formGroup = getParent(event.target, options.formGroupSelector)
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')
                var formMessage = formGroup.querySelector(options.errorSelector)

                if(formMessage) {
                    formMessage.innerText = ''
                }
            }
        }
    }

    // xử lí hành vi submit form 
    formElement.onsubmit = function(event) {
        event.preventDefault()

        const inputs = formElement.querySelectorAll('[name][rules]')
        var isValid = true

        for(var input of inputs) {
            if(!handleValidate({target: input})) {
                isValid = false
            }
        }

        // khi không có lỗi thì submit form
        if(isValid) {
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

                // gọi lại hàm onSubmit và trả về giá trị của form
                options.onSubmit(formValues)
            }
            else {
                formElement.submit()
            }
        }
    }

}
