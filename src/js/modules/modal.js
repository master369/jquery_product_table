'use strict';
window.APP.modules.modal = (function(APP) {
    var $productModal,
        validator,
        renderFn,
        renderCity,
        flag = false;

    function show(product, deliveryList) {
        var tmpl = renderFn({product: product, deliveryList: deliveryList, format: {
            currency: function (price) {
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                });
                return formatter.format(price);
            }
        }
    });
        var tmplCity = renderCity({checkBox: deliveryList.checkBox
    });

        $productModal
        .html(tmpl)
        .addClass('modal-show')
        .removeClass('fade');
        $('#modalProductCity').html(tmplCity);
        updateEventListeners();
        checkData(product);
        $('.productCountry').hide();
        $('.productCity').hide();
    }

    function init() {
        $productModal = $('#activeModal');
        renderFn = _.template(_.unescape($('#myModal').html()));
        renderCity = _.template(_.unescape($('#productCity').html()));
        initEventListners();
    }

    function initEventListners() {
        $productModal.on('click','.cancel', function() {
            $productModal
        .addClass('fade')
        .removeClass('modal-show');
        });
        $productModal.on('click','.save', function() {
            var products = APP.entities.productsList.getProguctsList(),
                productListLength = products.length,
                target = $('.modal-title'),
                $productHeader = $(target).closest('[data-id]'),
                productId = parseInt($productHeader.attr('data-id'), 10),
                productIndex = _.findIndex(products, function(o) {
                    return o.Id === productId;
                });

            if (productIndex <= productListLength) {
                change();
                if (productListLength <= products.length && flag === true) {
                    $productModal
                       .addClass('fade')
                       .removeClass('modal-show');
                }
            } else {
                change();
                if (productListLength < products.length && flag === true) {
                    $productModal
                         .addClass('fade')
                         .removeClass('modal-show');
                }
            }
        });
    }
    function updateEventListeners() {
        var $modalProductDelivery = $('#modalProductDelivery'),
            $modalProductPrice = $('#modalProductPrice');

        $modalProductDelivery.on('change', function() {
            if ($modalProductDelivery.val() === 'Country') {
                $('.productCountry').show();
                $('.productCity').hide();
            } else if ($modalProductDelivery.val() === 'City') {
                $('.productCountry').hide();
                $('.productCity').show();
            } else {
                $('.productCountry').hide();
                $('.productCity').hide();
            }
        });

        $('#modalProductName').bind({
            copy : function(event) {
                event.preventDefault();
            },
            paste : function(event) {
                event.preventDefault();
            },
            cut : function(event) {
                event.preventDefault();
            }
        });
        toggleCity();

        $modalProductPrice.focusin(function () {
            if (this.value) {
                this.value = this.value.slice(1);
                this.value = parseFloat(this.value.replace(/,/g, '')).toFixed(2);
            }
        });
        $modalProductPrice.focusout(function () {
            if (this.value) {
                this.value = format(parseFloat(this.value), '$');
            }
            function format(n, currency) {
                return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            }
        });
    }
    function selectAllEvent() {
        $('#SelectAll')
        .removeClass('city-checkbox')
        .change(function() {
            $('.city-checkbox').prop('checked', $(this).prop('checked'));
        });
        $('.city-checkbox').change(function() {
            if(false === $(this).prop('checked')) {
                $('#SelectAll').prop('checked', false);
            }
            if ($('.city-checkbox:checked').length === $('.city-checkbox').length ) {
                $('#SelectAll').prop('checked', true);
            }
        });
    }
    function change() {
        var target = $('.modal-title'),
            $productHeader = $(target).closest('[data-id]'),
            productId = parseInt($productHeader.attr('data-id'), 10),
            productList = APP.entities.productsList.getProguctsList(),
            validator = APP.entities.validator.validate(),
            product = {
                Id: productId,
                Name: null,
                Price: null,
                Email: null,
                Count: null,
                Delivery:{
                    Country: '',
                    City: ''
                }
            },
            price,
            modalDelivery,
            productIndex,
            lastProduct = _.last(productList);

        flag = false;
        if (productId > lastProduct.Id) {
            product.Name = $('#modalProductName').val();
            price = $('#modalProductPrice').val();
            price= price.slice(1);
            price = parseFloat(price.replace(/,/g, '')).toFixed(2);
            product.Price = price - 0;
            product.Count = $('#modalProductCount').val() - 0;
            product.Email = $('#modalProductEmail').val();
            modalDelivery = $('#modalProductDelivery').val();
            if (modalDelivery === 'Country' ) {
                product.Delivery.Country = $('#modalProductCountry input:checked').val();
            } else if (modalDelivery === 'City') {
                product.Delivery.Country = $('#modalProductCountry input:checked').val();
                product.Delivery.City = $('#modalProductCity input:checked').map(function() {
                    return $(this).val();
                });
            } else {
                product.Delivery = 'None';
            }
            if (!checkValidator(product)) {
                productList.push(product);
                flag = true;
            } else {
                showErrors(validator.messages);
            }
        } else {
            flag = false;
            product = _.find(productList, function(o) {
                return o.Id === productId;
            });

            product.Name = $('#modalProductName').val();
            price = $('#modalProductPrice').val();
            price= price.slice(1);
            price = parseFloat(price.replace(/,/g, '')).toFixed(2);
            product.Price = price - 0;
            product.Count = $('#modalProductCount').val() - 0;
            product.Email = $('#modalProductEmail').val();
            modalDelivery = $('#modalProductDelivery').val();
            if (modalDelivery === 'Country' ) {
                product.Delivery.Country = $('#modalProductCountry input:checked').val() || '';
            } else if (modalDelivery === 'City') {
                product.Delivery.Country = $('#modalProductCountry input:checked').val();
                product.Delivery.City = $('#modalProductCity input:checked').map(function() {
                    return $(this).val();
                });
            } else {
                product.Delivery = 'None';
            }
            productIndex = _.findIndex(productList, function(o) {
                return o.Id === productId;
            });
            if (!checkValidator(product)) {
                productList[productIndex] = product;
                flag = true;
            } else {
                showErrors(validator.messages);
            }
        }
        APP.modules.tableWritter.renderTable(productList);
    }

    function checkData(product) {
        var City,
            Country,
            i;

        if (product.Delivery.City.length) {
            $("#modalProductDelivery [value='City']").attr('selected', 'selected');
            City = product.Delivery.City;

            for (i = 0; i < City.length; i++) {
                $('#' + City[i]).attr('checked', 'checked');
            }
            $("#modalProductDelivery [value='Country']").attr('selected', 'selected');
            Country = product.Delivery.Country;
            $('input[value=' + Country +']').prop('checked', true);
            $('#modalProductCountry').hide();
            $('#modalProductCity').show();
        } else if (product.Delivery.Country.length) {
            $("#modalProductDelivery [value='Country']").attr('selected', 'selected');
            Country = product.Delivery.Country;
            $('input[value=' + Country +']').prop('checked', true);

            $('#modalProductCountry').show();
            $('#modalProductCity').hide();
        } else {
            $("#modalProductDelivery [value='None']").attr('selected', 'selected');

            $('#modalProductCountry').hide();
            $('#modalProductCity').hide();
        }
    }

    function checkValidator(product) {
        validator = APP.entities.validator.validate();

        validator.config = {
            Id: [],
            Delivery:['notChoosenCountry'],
            Name: ['Required', 'isNonSpace', 'maxLength'],
            Email: ['Required','isEmailType'],
            Count: ['Required','isNum'],
            Price: ['Required']
        };
        validator.validate(product);
        return validator.hasErrors();
    }

    function hideError($field) {
        $field.css('border-color', '#ccc');
        $field.next().css('display', 'none');
    }

    function showError($field, text) {
        $field.css('border-color', '#eb7e87');
        $field.after('<p>' + text +'</p>');
        $field.next().css('color', 'red');
        $field.next().css('display', 'inline-block');
    }

    function showErrors(messages) {
        var inputs = {
                Name: $('#modalProductName'),
                Email: $('#modalProductEmail'),
                Count: $('#modalProductCount'),
                Price: $('#modalProductPrice'),
                Delivery: $('#modalProductCountry input')
            },
            keyInputs,
            messageText,
            nameField,
            textError,
            i;

        for (keyInputs in inputs) {
            hideError($(inputs[keyInputs]));
        }

        for (i = 0; i < messages.length; i++) {
            messageText = messages[i];
            nameField = messageText.slice(messageText.indexOf('*') + 1, messageText.lastIndexOf('*'));
            textError = messageText.slice(messageText.lastIndexOf('*') + 1);
            for ( keyInputs in inputs) {
                if (keyInputs === nameField) {
                    nameField = inputs[keyInputs];
                    showError($(nameField), textError);
                }
            }
            if (i === 0) {
                $(nameField).focus();
            }
        }
    }
    function toggleCity () {
        var arr = APP.entities.deliveryList.getDeliveryList(),
            renderCity = _.template(_.unescape($('#productCity').html())),
            tmp,
            tmplCity;
        $('input[name="country"]').on('change', function() {
            if ($(this).val()==='USA') {
                tmp = arr.cityUsa;
                tmplCity = renderCity({checkBox: tmp});
                $('#modalProductCity').html(tmplCity);
            }
            else if ($(this).val()==='Russia') {
                tmp = arr.cityRus;
                tmplCity = renderCity({checkBox: tmp});

                $('#modalProductCity').html(tmplCity);
            } else  {
                tmp = arr.cityJap;
                tmplCity = renderCity({checkBox: tmp});

                $('#modalProductCity').html(tmplCity);
            }
            selectAllEvent();
        });
    }
    return{
        show: show,
        init: init,
    };
})(window.APP);