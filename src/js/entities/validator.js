'use strict';
window.APP.entities.validator = (function(APP) {
    var validator = {
        types: {},
        messages: [],
        config: {},
        validate: function checkData(data) {
            var i,
                msg,
                type,
                checker,
                resultOk;

            this.messages = [];

            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    type = this.config[i];
                    for (var j = 0; j < type.length; j++) {
                        checker = this.types[type[j]];

                        if (!type[j]) {
                            continue;
                        }

                        if (!checker) {
                            throw {
                                name: 'ValidationError',
                                message: 'No handler to validate type ' + type
                            };
                        }
                        resultOk = checker.validate(data[i]);
                        if (!resultOk) {
                            msg = '*' + i + '*' + checker.instructions;
                            this.messages.push(msg);
                        }
                    }
                }
            }
            return this.hasErrors();
        },
        hasErrors: function hasErrors() {
            return this.messages.length !== 0;
        }
    };
    validator.types.Required = {
        validate: function isEmpty(value) {
            return value !== '';
        },
        instructions: 'Required field.'
    };
    validator.types.notChoosenCountry = {
        validate: function empty(value) {
            if ($('#modalProductDelivery').val() === 'Country') {
                return $('#modalProductCountry input[name="country"]:checked').length !== 0;
            } else {
                return true;
            }
        },
        instructions: 'Required field.'
    };
    validator.types.isNonSpace = {
        validate: function isSpace(value) {
            return !/^\s+$/.test(value);
        },
        instructions: 'The value can not be only space'
    };
    validator.types.maxLength = {
        validate: function maxLength(value) {
            return !(value.length > 15);
        },
        instructions: 'The max length of 15 characters.'
    };
    validator.types.isEmailType = {
        validate: function isEmail(value) {
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/).test(value);
        },
        instructions: 'Incorrect Email.'
    };
    validator.types.isNum = {
        validate: function isNum(value) {
            return !/[^0-9]/g.test(value);
        },
        instructions: 'Only number.'
    };

    function validate() {
        return validator;
    }

    return{
        validate: validate,
    };
})(window.APP);