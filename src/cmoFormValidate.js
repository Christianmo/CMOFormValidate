(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
    } else {
      root.cmoFormValidate = factory();
    }
}(this, function() {
    'use strict';

    var fields = [];
    var options;
    var errorCounter = 0;

    var validations = {
        isNotEmpty: function(val) {
            return val.trim() !== "";
        },

        isName: function(val) {
            var nameRegex = /^[a-zA-Záéíóúñ,. ]+$/;
            return nameRegex.test(val);
        },

        isEmail: function(val) {
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(val);
        },

        isInteger: function(val) {
            return parseInt(val) === Number(val);
        }
    };

    var rules = {
        names: validations.isName,
        email: validations.isEmail,
        numbers: validations.isInteger,
        required: validations.isNotEmpty
    };

    var validate = {

        init: function(data) {

            options = data;
            var form = document.querySelector(options.form);
            var button = form.querySelector(options.button);

            if (options.fields) {
                var fieldsArr = options.fields.map(function(fieldObj) {
                    return {
                        el: form.querySelector(fieldObj.selector),
                        rule: fieldObj.rule,
                        errorMessage: fieldObj.message
                    };
                });
            } else {
                var inputs = form.querySelectorAll("[data-rule]");
                var fieldsArr = Array.prototype.map.call(inputs, function(input) {
                    return {
                        el: input,
                        rule: input.dataset.rule,
                        errorMessage: input.dataset.errorMessage
                    };
                });
            }

            validate._blurHandle(fieldsArr);

            if (button) {
                validate._clickHandle(fieldsArr, button); //for specific button
            } else {
                validate._submitHandle(form, fieldsArr); //for submit event
            }
        },

        isValid: function(selector) {
            var el = document.querySelectorAll(selector)[0];

            return (el.querySelectorAll('.field-error').length === 0);
        },

        /**
         * Validation when file is blur
         * @param  {[Array]} Array of Objects
         */
        _blurHandle: function(fieldsArr) {
            var self = this;

            fieldsArr.forEach(function(fieldObj) {
                fieldObj.el.addEventListener('blur', function() {
                    self._errorHandle(fieldObj.el, fieldObj.rule, fieldObj.errorMessage);
                });
            });
        },

        /**
         * Validation by button click, validation without submit
         * @param  {[Array]} Array of Objects
         * @param  {[el]} button el
         */
        _clickHandle: function(fieldsArr, button) {
            var self = this;

            button.addEventListener('click', function(evt) {

                fieldsArr.forEach(function(fieldObj) {
                    self._errorHandle(fieldObj.el, fieldObj.rule, fieldObj.errorMessage);
                })
            });
        },

        /**
         * Validation when form is submited
         * @param  {string} form   is the selector of the form
         * @param  {array} fields is an array with the field selector, type of validation and error message
         */
        _submitHandle: function(form, fieldsArr) {
            var self = this;

            form.addEventListener('submit', function(evt) {
                evt.preventDefault();

                fieldsArr.forEach(function(fieldObj) {
                    self._errorHandle(fieldObj.el, fieldObj.rule, fieldObj.errorMessage);
                });
            });
        },

        _errorHandle: function(field, rule, message) {

            var currentClass = field.className;

            var errorMsg = document.createElement('small');
            errorMsg.className = "error-message";

            var parentNode = field.parentNode;

            if (rules[rule](field.value)) {
                field.className = currentClass.replace('field-error', '');
                var currentErrorMsg = parentNode.querySelector('small');
                if (currentErrorMsg) {
                    parentNode.removeChild(parentNode.querySelector('small'));
                    field.dataset.tooltip = '';
                }
            } else {
                if (currentClass.indexOf('field-error') === -1) {
                    field.className = currentClass + ' field-error';
                    field.parentNode.appendChild(errorMsg);
                    errorMsg.innerHTML = message;
                    field.dataset.tooltip = message;
                }
            }
        }
    };

    return {
        init: validate.init,
        isValid: validate.isValid,
        rules: rules
    }
}))