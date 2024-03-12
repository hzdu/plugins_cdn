global.wcSettings = {
    adminUrl: 'https://vagrant.local/wp/wp-admin/',
    countries: [],
    currency: {
        code: 'USD',
        precision: 2,
        symbol: '$',
        symbolPosition: 'left',
        decimalSeparator: '.',
        priceFormat: '%1$s%2$s',
        thousandSeparator: ',',
    },
    defaultDateRange: 'period=month&compare=previous_year',
    date: {
        dow: 0,
    },
    locale: {
        siteLocale: 'en_US',
        userLocale: 'en_US',
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
    },
    admin: {
        orderStatuses: {
            pending: 'Pending payment',
            processing: 'Processing',
            'on-hold': 'On hold',
            completed: 'Completed',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
            failed: 'Failed',
        },
        wcAdminSettings: {
            woocommerce_actionable_order_statuses: [],
            woocommerce_excluded_report_order_statuses: [],
        },
        dataEndpoints: {
            performanceIndicators: [
                {
                    chart: 'total_sales',
                    label: 'Total sales',
                    stat: 'revenue/total_sales',
                },
                {
                    chart: 'net_revenue',
                    label: 'Net sales',
                    stat: 'revenue/net_revenue',
                },
                {
                    chart: 'orders_count',
                    label: 'Orders',
                    stat: 'orders/orders_count',
                },
                {
                    chart: 'items_sold',
                    label: 'Items sold',
                    stat: 'products/items_sold',
                },
            ],
        },
    },
};
