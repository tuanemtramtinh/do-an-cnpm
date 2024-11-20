
// doi tuong
function Validator(options) {

    function getParent(element, selector) {
        while(element.parentElement){
            //tim coi co tk selector ko dung .matches
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};
    //ham thuc hien validate
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        //lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];

        //lap qua tung rule kiem tra
        for(var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    //lay element cua formcan validate
    var formElement = document.querySelector(options.form);
    

    if (formElement) {
        //khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid){
                    isFormValid = false;
                }
            });

            
            if (isFormValid){
                //th submit vs js
                if (typeof options.onSubmit === 'function') {
                    
                    var enableInputs = formElement.querySelectorAll('[name]');

                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        values[input.name] = input.value;
                        return values;
                    },{});
                    
                    options.onSubmit(formValues);
                }//th submit vs hanh vi mac dinh 
                else{
                    formElement.submit();
                }
            }
        }
        //lap qua moi rule va xu ly lang nghe su kien blur, input,...)
        options.rules.forEach(function(rule) {

            //luu lai cac rules cho moi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }else{
            selectorRules[rule.selector] = [rule.test];

            }
            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {

                // xu ly truong hop blur ra khoi input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }

                //xu ly TH khi ng dùng nhập tiếp vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

//dinh nghia cac rule
Validator.isRequired = function(selector) {
    
    return{
        selector: selector,
        test: function(value){
            //loai bo khoang cach tranh truong hop nguoi dung chi nhap dau " "
            return value.trim() ? undefined : 'Vui lòng nhập vào đây.'
        }
    };
}

Validator.isEmail = function(selector, message) {
    return{
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập đúng email.'
        }
    };
}

Validator.minLength = function(selector, min, message) {
    return{
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message ||  `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
}

Validator.isPhone = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^(?:\+?(\d{1,3}))?(\d{9,15})$/; // Định dạng số điện thoại (có thể chứa mã quốc gia)
            return regex.test(value) ? undefined : message || 'Vui lòng nhập số điện thoại hợp lệ.';
        }
    }
}

Validator.isConfirmed = function(selector, getConfirValue, message) {
    return{
        selector: selector,
        test: function(value){
            return value === getConfirValue() ? undefined : message || 'Giá trị nhập vào không đúng.'
        }
    }
}