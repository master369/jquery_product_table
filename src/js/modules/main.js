'use strict';
window.APP.modules.main = (function(APP) {
    var products = APP.entities.productsList,
        table = APP.modules.tableWritter,
        productslist;


    function init() {
        initEventListners();
        productslist = products.getProguctsList();
        table.renderTable(productslist);
    }

    function initEventListners() {
        $('#tableName, #tablePrice').click(sortHandler);
        $('#tableBody').on('click','.clickable', function(event) {
            var target = event.target,
                $productRow = $(target).closest('[data-id]'),
                productId = parseInt($productRow.attr('data-id'), 10),
                product,
                delivery = APP.entities.deliveryList.getDeliveryList();

            product = _.find(productslist, function(item) {
                return item.Id === productId;
            });
            APP.modules.modal.show(product, delivery);
        });
        $('#controls').on('click','.clickable', function(event) {
            var product = {
                    Id: 0,
                    Price: 0,
                    Count: 0,
                    Email: '',
                    Name: '',
                    Delivery: {
                        Country: 'Russia',
                        City: '',
                    }
                },
                lastProduct,
                delivery = APP.entities.deliveryList.getDeliveryList();

            lastProduct = _.last(productslist);
            product.Id = lastProduct.Id + 1;
            APP.modules.modal.show(product, delivery);
        });
        $('#tableBody').on('click','.remove', function(event) {
            var target = event.target,
                $productRow = $(target).closest('[data-id]'),
                productId = parseInt($productRow.attr('data-id'), 10),
                product;

            product = _.find(productslist, function(item) {
                return item.Id === productId;
            });
            APP.modules.modalDelete.show(product);
        });
        $('#controls').on('click','.search', function(event) {
            var $searchVal = $('#searchInput').val().toLowerCase(),
                productList = APP.entities.productsList.getProguctsList(),
                searchReslt;

            if ($searchVal) {
                searchReslt = _.filter(productList, function(product) {
                  return product.Name.toLowerCase().indexOf($searchVal) > -1;
                });
                table.renderTable(searchReslt);
            } else {
                table.renderTable(productList);
            }
        });
    }

    function sortHandler() {
        var field = $(this).attr('id') === 'tableName' ? 'Name' : 'Price';
        if ($(this).attr('id') === 'tableName') {
            table.sortTable($('#tablePrice'), $('#tableName'), field, products.productsList);
        } else {
            table.sortTable($('#tableName'), $('#tablePrice'), field, products.productsList);
        }
    }



    return {
        init: init,
    };
})(window.APP);
