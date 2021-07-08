**Live Demo :** [Form Validaton 2](https://ck1412.github.io/HTML_CSS_JS/Projects/Form-Validation-2)
> UI concept design : [Anton Zaderaka](https://dribbble.com/shots/13904682-Courses-app-Sign-up-form)  
> Tutorial : [F8 Official](https://youtu.be/jhvEPY8cEu0)
---
## Phân tích
**1. Mục tiêu**
 - Ta sẽ tạo ra một form đăng kí, đăng nhập bằng HTML, CSS
 - Sau đó dùng JS để check các trường đầu vào nếu thỏa mãn thì submit được form, ngược lại sẽ thông báo lỗi  

**2. Ý tưởng**
* Ta sẽ tạo ra một thư viện *validator.js* để thực hiện các thao tác kiểm tra đối với các trường dữ liệu nhập vào khác nhau, như vậy sẽ tránh bị lặp code và sẽ có thể sử dụng với nhiều form khác.  
    1. Khi ta chọn vào 1 trường mà không nhập gì rồi blur ra ngoài sẽ thông báo lỗi, nhập dữ liệu không đúng cũng sẽ thông báo lỗi.
    2. Thư viện hiện có thể áp dụng check với các kiểu input: *text, password, email*
    3. Ta thêm attribute rules với kiểu tương ứng vào thẻ input để check:   
        * rules="required" : bắt buộc phải nhập trường này
        * rules="required|email" : bắt buộc nhập và trường này phải là email
        * rules="required|min:x" : bắt buộc nhập và độ dài tối thiểu của trường là x kí tự (x ta tự cho)  

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

            // submit form
            onSubmit: function (data) {
                // Call API
                console.log(data)
            },

        })
        ``` 