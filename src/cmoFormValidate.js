/**
 * CMO Form Validate
 * author: Christian Montenegro
 * version: 1.0.1
 */

window.cmoFormValidate = (function() {

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
        },

        isDNI: function(val) {
            return parseInt(val) === Number(val) && val.trim().length === 8;
        }
    };

    var rules = {
        names: validations.isName,
        email: validations.isEmail,
        numbers: validations.isInteger,
        required: validations.isNotEmpty,
        dni: validations.isDNI,
    };

    var validate = {

        init: function(options) {

            options = options;

            if (!options.fields.length) {
                return;
            }

            var form = document.querySelector(options.form);
            var fields = options.fields;

            this.blurHandle(form, fields);

            if (options.button) {
                var button = options.button;
                this.clickHandle(form, fields, button); //for specific button
            } else {
                this.submitHandle(form, fields);
            }


        },

        isValid: function(selector) {
            var el = document.querySelectorAll(selector)[0];

            return (el.querySelectorAll('.field-error').length === 0);
        },

        /**
         * Validation when file is blur
         * @param  {string} form   is the selector of the form
         * @param  {array} fields is an array with the field selector, type of validation and error message
         */
        blurHandle: function(form, fields) {
            var self = this;

            fields.forEach(function(field) {
                var el = form.querySelector(field.selector);

                if (el === null) {
                    console.info('Warning: ' + field.selector + ' element does not exist');
                    return;
                }

                el.addEventListener('blur', function() {
                    self.errorHandle(form, field);
                });
            });
        },

        /**
         * Validation by button click, validation without submit
         * @param  {[element]} form   current form or block with fields
         * @param  {[type]} fields the fields to validate
         * @param  {[type]} button the button to execute the validation
         */
        clickHandle: function(form, fields, button) {
            var self = this;
            var button = form.querySelector(button);

            if (!button) {
                console.info('Warning: ' + button + ' submit element does not exist');
                return;
            }

            button.addEventListener('click', function(evt) {

                fields.forEach(function(field) {
                    self.errorHandle(form, field);
                })
            });
        },

        /**
         * Validation when form is submited
         * @param  {string} form   is the selector of the form
         * @param  {array} fields is an array with the field selector, type of validation and error message
         */
        submitHandle: function(form, fields) {
            var self = this;

            form.addEventListener('submit', function(evt) {
                evt.preventDefault();

                fields.forEach(function(field) {
                    self.errorHandle(form, field);
                });
            });
        },

        errorHandle: function(form, field) {

            var el = form.querySelector(field.selector);

            if (el === null) {
                console.info(el + ' element does not exist');
                return;
            }

            if (!rules[field.rule]) {
                console.info('Warning: ' + field.rule + ' rule does not exist');
                return;
            }

            var currentClass = el.className;

            var errorMsg = document.createElement('small');
            errorMsg.className = "error-message";

            var parentNode = el.parentNode;

            if (rules[field.rule](el.value)) {
                el.className = currentClass.replace('field-error', '');
                var currentErrorMsg = parentNode.querySelector('small');
                if(currentErrorMsg) {
                    parentNode.removeChild(parentNode.querySelector('small'));
                    el.dataset.tooltip = '';
                }
            } else {
                if (currentClass.indexOf('field-error') === -1) {
                    el.className = currentClass + ' field-error';
                    el.parentNode.appendChild(errorMsg);
                    errorMsg.innerHTML = field.message;
                    el.dataset.tooltip = field.message;
                }

            }

        }
    };

    return validate;
})()