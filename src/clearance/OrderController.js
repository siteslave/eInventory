(function (window, angular) {
    'use strict';

    var _ = require('lodash'),
        moment = require('moment');

    angular.module('app.clearance.OrderController', [])
        .controller('OrderController', function ($scope, $window, OrderService) {

            $scope.orders = [];
            // Get order list
            OrderService.getOrders()
                .then(function (rows) {
                    $scope.orders = rows;
                }, function (err) {
                    console.log(err);
                });

            $scope.doImport = function (orderId, orderDate, orderCode, supplierName) {

                var year = $window.sessionStorage.getItem('year');

                OrderService.checkClosed(year)
                    .then(function (resp) {
                        if (resp) {
                            swal({
                                title: 'เกิดข้อผิดพลาด',
                                text: 'ปีงบประมาณนี้ได้ถูกปิดไปแล้ว ไม่สามารถปิดได้อีก ' + '['+ year +']',
                                type: 'warning',
                                confirmButtonText: 'ตกลง'
                            });
                        } else {
                            OrderService.getDrugItems(orderId)
                            .then(function (rows) {

                                var newOrderDate = moment(orderDate).format('YYYY-MM-DD'),
                                importedDate = moment().format('YYYY-MM-DD HH:mm:ss');

                                _.forEach(rows, function (v) {

                                    OrderService.saveStockCard(v.icode, v.qty, orderCode, newOrderDate, supplierName)
                                    .then(function () {
                                        return OrderService.updateQty(v.icode, v.qty);
                                    })
                                    .then(function () {
                                        return OrderService.updateOrderDetail(v.icode, orderId, importedDate);
                                    })
                                    .then(function () {
                                        return OrderService.updateOrderStatus(orderId, importedDate);
                                    })
                                    .then(function () {
                                        // success
                                    }, function (err) {
                                        console.log(err);
                                    });

                                });

                                // remove order
                                _.remove($scope.orders, {id: orderId});

                                swal({
                                    title: 'สำเร็จ',
                                    text: 'ปรับปรุง Stock เสร็จเรียบร้อยแล้ว',
                                    type: 'success',
                                    confirmButtonText: 'ตกลง',
                                    timer: 2000
                                });

                            }, function (err) {
                                console.log(err);
                            });
                        }
                    }, function (err) {
                        console.log(err);
                    });

            };

        });

})(window, window.angular);
