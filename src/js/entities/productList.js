'use strict';
window.APP.entities.productsList = (function(APP) {
    var productsList;

    productsList = [{
        Id: 1,
        Name: 'Молоко',
        Price: 120,
        Email: 'milkFactory@moloko.com',
        Count: '100',
        Delivery: {
            Country: 'Russia',
            City: []
        },
    },
    {
        Id: 2,
        Name: 'Творог',
        Price: 40,
        Email: 'milkFactory@moloko.com',
        Count: 5,
        Delivery: {
            Country: 'Russia',
            City: []
        },
    },
    {
        Id: 3,
        Name: 'Сметана',
        Price: 60,
        Email: 'milkFactory@moloko.com',
        Count: 15,
        Delivery: {
            Country: 'Russia',
            City: []
        },
    },
    {
        Id: 4,
        Name: 'Кофе',
        Price: 340000,
        Email: 'coffee@coffee.com',
        Count: 200,
        Delivery: {
            City: ['Saratov', 'Moscov']
        }
    },
    {
        Id: 5,
        Name: 'Сыыыр',
        Price: 140,
        Email: 'milkFactory@moloko.com',
        Count: 35,
        Delivery: {
            Country: 'USA',
            City: []
        },
    }
    ];

    function getProguctsList() {
        return productsList;
    };

    return {
        getProguctsList: getProguctsList,
        productsList: productsList,
    };
})(window.APP);
