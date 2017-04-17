'use strict';
window.APP.modules.tableWritter = (function(APP) {
    var products = APP.entities.productsList,
        productRowHtml = $('#tableRowTemplate').html(),
        tmp = _.template(productRowHtml),
        click = 0;

    function generateTemplateWithProduct(obj) {
        return tmp({ product: obj, format: {
            currency: function (price) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
            });
            return formatter.format(price);
            }
        } });
    }

    function renderTable(productsList) {
        var html1 = [];

        _.each(productsList, function addTmpl(objProduct) {
            var productHtml = generateTemplateWithProduct(objProduct);

            html1.push(productHtml);
        });

        $('#tableBody').html(html1.join(''));
    }

    function sortTable($hideElem, $showElem, fieldSort, productsList) {
        $hideElem.next().css('opacity', '0');
        $showElem.next().css('opacity', '1');
        if (click) {
            $showElem.next().removeClass('glyphicon-triangle-bottom');
            $showElem.next().addClass('glyphicon-triangle-top');
            click = 0;
            productsList = sortAscending(productsList, fieldSort);
        }
        else {
            $showElem.next().removeClass('glyphicon-triangle-top');
            $showElem.next().addClass('glyphicon-triangle-bottom');
            click = 1;
            productsList = sortDiscending(productsList, fieldSort);
        }
        renderTable(productsList);
    }

    function sortAscending(array, prop) {
        return _.sortBy(array, prop);
    }


    function sortDiscending(array, prop) {
        return _.sortBy(array, prop).reverse();
    }



    return {
        generateTemplateWithProduct: generateTemplateWithProduct,
        renderTable: renderTable,
        sortTable: sortTable,
    };
})(window.APP);
