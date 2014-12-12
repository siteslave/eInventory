/* Edit product controller */
(function (window, angular) {

    'use strict';

    var _ = require('lodash'),
        moment = require('moment');

    angular.module('app.orders.EditController', ['app.orders.NewService', 'app.orders.EditService'])
        .controller('EditController', function ($scope, $routeParams, $timeout, NewService, EditService) {

            $scope.orderId = $routeParams.id;

            $scope.suppliers = []; // all suppliers
            $scope.drugs = []; // all drugs
            $scope.isAdd = false;

            // new product detail
            $scope.items = []; // all new items
            // new itme
            $scope.itemCode = null;
            $scope.itemName = null;
            $scope.itemPrice = 0;
            $scope.itemQty = 0;
            $scope.itemUnit = null;
            $scope.itemTotal = $scope.itemQty * $scope.itemPrice;

            $scope.select2Options = {
                allowClear: true
            };

            // Get supplier
            NewService.getSuppliers()
            .then(function (rows) {
                $scope.suppliers = rows;
            }, function (err) {
                console.log(err);
                alert('Error: View console to see log');
            });

            NewService.getDrugs()
            .then(function (rows) {
                $scope.drugs = rows;
            }, function (err) {
                console.log(err);
            });

            // Get order
            EditService.getOrder($scope.orderId)
                .then(function (data) {
                    $scope.orderDate = data.order_date;
                    $scope.orderCode = data.order_code;
                    $scope.supplier = data.supplier_code;
                }, function (err) {
                    console.log(err);
                });

            // Get order detail
            EditService.getOrderDetail($scope.orderId)
                .then(function (rows) {

                    _.forEach(rows, function (v) {
                        var item = {
                            icode: v.icode,
                            name: v.name,
                            qty: v.qty,
                            price: v.price,
                            unit: v.unit
                        };

                        $scope.items.push(item);
                    });

                }, function (err) {
                    console.log(err);
                });

            $scope.toggleAdd = function () {
                $scope.isAdd = $scope.isAdd ? false : true;
            };

            // product lis change
            $scope.getProductDetail = function () {
                var data = _.find($scope.drugs, {icode: $scope.drug});

                if (_.size(data)) {
                    $scope.itemCode = data.icode;
                    $scope.itemName = data.name;
                    $scope.itemQty = 1;
                    $scope.itemPrice = data.cost;
                    $scope.itemUnit = data.units;
                }
            };

            // clear form
            $scope.clearForm = function () {
                // clear data
                $scope.isAdd = false;
                $scope.itemCode = null;
                $scope.itemName = null;
                $scope.itemQty = 0;
                $scope.itemPrice = 0;
                $scope.itemUnit = null;
            };

            $scope.addProduct = function () {
                if ($scope.itemName && $scope.itemPrice && $scope.itemQty) {

                    // check duplicated
                    var item = _.find($scope.items, {icode: $scope.itemCode});

                    if (_.size(item)) {
                        //remove old data and update qty
                        var newItem = {
                            icode: item.icode,
                            name: item.name,
                            qty: $scope.itemQty + item.qty, // update qty
                            price: item.price,
                            unit: item.unit
                        };
                        //remove old data
                        _.remove($scope.items, {icode: item.icode});
                        $scope.items.push(newItem);
                    } else {
                        // insert new record
                        $scope.items.push({
                            icode: $scope.itemCode,
                            name: $scope.itemName,
                            qty: $scope.itemQty,
                            price: $scope.itemPrice,
                            unit: $scope.itemUnit
                        });

                    }

                    $scope.clearForm();

                } else {
                    swal({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'กรุณากรอกข้อมูลให้ครบ',
                        type: 'warning',
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: 'ตกลง'
                    });
                }
            };

            // Get total price
            $scope.getTotalPrice = function () {
                var total = 0;
                _.forEach($scope.items, function (v) {
                    total += v.qty * v.price;
                });

                return total;
            };

            // Remove item
            $scope.removeItem = function (icode) {
                _.remove($scope.items, {icode: icode});
            };

            // clear order
            $scope.saveOrder = function () {

                if (_.size($scope.items) && $scope.orderDate && $scope.supplier && $scope.orderCode) {
                    var data = {
                        supplierCode: $scope.supplier,
                        orderId: $scope.orderId,
                        orderDate: moment($scope.orderDate).format('YYYY-MM-DD'),
                        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
                    };

                    EditService.saveOrder(data)
                    .then(function () {

                        // remove order detail
                        EditService.removeOrderDetail($scope.orderId)
                            .then(function () {
                                // save order detail
                                var items = [];

                                _.forEach($scope.items, function (v) {
                                    var item = {
                                        icode: v.icode,
                                        order_id: $scope.orderId,
                                        price: v.price,
                                        qty: v.qty
                                    };

                                    items.push(item);
                                });

                                EditService.saveOrderDetail(items)
                                .then(function () {
                                    swal({
                                        title: 'สำเร็จ',
                                        text: 'บันทึกข้อมูลการเบิกเวชภัณฑ์เสร็จเรียบร้อยแล้ว',
                                        type: 'success',
                                        confirmButtonText: 'ตกลง',
                                        timer: 1000
                                    });

                                    $timeout(function () {
                                        location.href = 'Orders.html';
                                    }, 1500);

                                }, function (err) {
                                    console.log(err);
                                    swal({
                                        title: 'เกิดข้อผิดพลาด',
                                        text: 'เกิดข้อผิดพลาดในการบันทึกรายการ',
                                        type: 'warning',
                                        confirmButtonText: 'ตกลง',
                                        confirmButtonColor: "#DD6B55"
                                    });
                                });

                            }, function (err) {
                                console.log(err);
                            });

                    }, function (err) {
                        console.log(err);
                        swal({
                            title: 'เกิดข้อผิดพลาด',
                            text: 'เกิดข้อผิดพลาดในการบันทึกรายการ',
                            type: 'warning',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: "#DD6B55"
                        });
                    });

                } else {
                    swal({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่พบรายการเวชภัณฑ์ที่ต้องการเบิก',
                        type: 'warning',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: "#DD6B55"
                    });
                }

            };

            $scope.removeOrder = function () {
                swal({
                    title: "Are you sure?",
                    text: "คุณต้องการลบรายการนี้ใช่หรือไม่?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "ใช่, ฉันต้องการลบ!",
                    cancelButtonText: 'ยกเลิก',
                    closeOnConfirm: false
                }, function () {

                    // do remove order
                    EditService.removeOrder($scope.orderId)
                        .then(function () {
                            // Remove order detail
                            EditService.removeOrderDetail($scope.orderId)
                                .then(function () {
                                    swal("ลบเสร็จเรียบร้อยแล้ว!", "ข้อมูลในรายการเบิก ได้ถูกลบออกจากระบบไปแล้ว.", "success");
                                    $timeout(function () {
                                        location.href = 'Orders.html';
                                    }, 1500);
                                }, function (err) {
                                    console.log(err);
                                });

                        }, function (err) {
                            console.log(err);
                        });

                });
            };

        });

})(window, window.angular);
