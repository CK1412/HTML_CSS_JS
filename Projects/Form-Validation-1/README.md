### Live Demo : [Form Validation 1](https://ck1412.github.io/HTML_CSS_JS/Projects/Form-Validation-1)
> UI concept design : [Merixstudio](https://dribbble.com/shots/11468202-Fintech-App-Sign-in-Sign-up)  
> Tutorial : [F8 Official](https://youtu.be/ZdvRm1bfGAk)
---
## Phân tích
**1. Mục tiêu**
 - Ta sẽ tạo ra một form đăng kí, đăng nhập bằng HTML, CSS
 - Sau đó dùng JS để check các trường đầu vào nếu thỏa mãn thì submit được form, ngược lại sẽ thông báo lỗi  

**2. Ý tưởng**
* Ta sẽ tạo ra một thư viện *validator.js* để thực hiện các thao tác kiểm tra đối với các trường dữ liệu nhập vào khác nhau, như vậy sẽ tránh bị lặp code và sẽ có thể sử dụng với nhiều form khác.  
    1. Khi ta chọn vào 1 trường mà không nhập gì rồi blur ra ngoài sẽ thông báo lỗi, nhập dữ liệu không đúng cũng sẽ thông báo lỗi.
    2. Thư viện hiện có thể áp dụng check với các kiểu input: *text, ratio, checkbox, password, email, select/option*
    3. Các kiểu check:   
        * isRequired : bắt buộc phải nhập trường này
        * isEmail : trường này phải là email
        * minLength : độ dài tối thiểu của trường
        * isConfirmed : xác nhận lại dữ liệu của 1 trường (confirm password)
* Cách sử dụng thư viện
    1. Link thư viện *validator.js* để sử dụng
    2. Để check 1 form ta khai báo với cấu trúc sau:  

        ```
        // Ví dụ: 
        Validator({
            // khai báo form cần check
            form: '#signup-form',   

            // khai báo group của từng input
            formGroupSelector: '.form-group',   

            // khai báo nơi hiện thông báo lỗi
            errorSelector: '.form-message',    

            // Các rules để check input
            rules: [
                //  khai báo mẫu như sau:
                //  Validator.kiểu_check('id/class của input','đoạn text error')

                Validator.isRequired('#fullname', '✖ You need to enter your full name.'),

                Validator.isEmail('#email', '✖ This email is invalid.'),

                Validator.minLength('#password', 8, '✖ Your password must be at least 8 characters.'),

                Validator.isConfirmed('#password-confirm', function () {
                    return document.querySelector('#signup-form #password').value
                }, '✖ Your password does not match.'),
            ],

            onSubmit: function (data) {
                // Call API
                console.log(data)
            },

        })
        ``` 