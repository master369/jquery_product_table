'use strict';
window.APP.entities.deliveryList = (function(APP) {
    var deliveryList;

    deliveryList = {
        select: {
            0: 'None',
            1: 'Country',
            2: 'City'
        },
        country: {
            0: 'Russia',
            1: 'USA',
            2: 'Japan'
        },
        cityRus: {
            0: 'SelectAll',
            1: 'Moscow',
            2: 'StPeterburg',
            3: 'Saratov',
        },
        cityUsa: {
            0: 'SelectAll',
            1: 'Washington',
            2: 'LA',
            3: 'NY',
        },
        cityJap: {
            0: 'SelectAll',
            1: 'Tokyo',
            2: 'Kyoto',
            3: 'Osaka',
        }};

    function getDeliveryList() {
        return deliveryList;
    };

    return {
        getDeliveryList: getDeliveryList,
    };
})(window.APP);
