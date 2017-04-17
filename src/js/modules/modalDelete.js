'use strict';
window.APP.modules.modalDelete = (function(APP) {
    var $modalDelete,
        renderFn;

    function init() {
        $modalDelete = $('#activeDeleteModal');
        renderFn = _.template(_.unescape($('#confirmDelete').html()));
        initEventListners();
    }
    function show(product) {
        var tmpl = renderFn({product: product});

        $modalDelete
        .html(tmpl)
        .addClass('modal-show')
        .removeClass('fade');
    }

    function initEventListners() {
        $modalDelete.on('click','.cancel', function() {
            $modalDelete
        .addClass('fade')
        .removeClass('modal-show');
        });

        $modalDelete.on('click','.save', function() {
            removeProduct();
            $modalDelete
        .addClass('fade')
        .removeClass('modal-show');
        });
    }

    function removeProduct() {
        var target = $('#activeDeleteModal .modal-title'),
            $productHeader = $(target).closest('[data-id]'),
            productId = parseInt($productHeader.attr('data-id'), 10),
            productList = APP.entities.productsList.getProguctsList(),
            productIndex;

        productIndex = _.findIndex(productList, function(o) {
            return o.Id === productId;
        });
        productList.splice(productIndex, 1);
        APP.modules.tableWritter.renderTable(productList);
    }

    return{
        init: init,
        show: show,
    };
})(window.APP);