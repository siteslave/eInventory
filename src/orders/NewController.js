;(function (window, angular) {

    'use strict';

    var _ = require('lodash'),
        moment = require('moment');

    angular.module('app.orders.NewController', [])
        .controller('NewController', function ($scope, $window, NewService) {

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
                        confirmButtonText: 'ตกลง',
                        timer: 2000
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

            // Clear order
            $scope.clearOrder = function () {
                $scope.items = [];
                $scope.orderCode = '';
                $scope.orderDate = null;
                $scope.supplier = null;
            };
            // clear order
            $scope.saveOrder = function () {

                var year = $window.sessionStorage.getItem('year');

                NewService.checkClosed(year)
                    .then(function (resp) {
                        if (resp) {
                            swal({
                                title: 'เกิดข้อผิดพลาด',
                                text: 'ปีงบประมาณนี้ได้ถูกปิดไปแล้ว ' + '['+ year +']',
                                type: 'warning',
                                confirmButtonText: 'ตกลง'
                            });
                        } else {
                            if (_.size($scope.items) && $scope.orderDate && $scope.supplier && $scope.orderCode) {
                                var data = {
                                    supplier_code: $scope.supplier,
                                    order_code: $scope.orderCode,
                                    order_date: moment($scope.orderDate).format('YYYY-MM-DD'),
                                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                                };

                                NewService.checkDuplicated(data.order_code)
                                .then(function (isDuplicated) {
                                    if (isDuplicated) {
                                        swal({
                                            title: 'ข้อมูลซ้ำ',
                                            text: 'เนื่องจากเลขที่ใบเบิกนี้ได้เคยบันทึกเข้าระบบแล้ว ไม่สามารถบันทึกซ้ำได้อีก กรุณาตรวจสอบ' ,
                                            type: 'warning',
                                            confirmButtonText: 'ตกลง',
                                            confirmButtonColor: "#DD6B55",
                                            timer: 2000
                                        });
                                    } else {
                                        NewService.saveOrder(data)
                                        .then(function (orderId) {
                                            // save order detail
                                            var items = [];
                                            _.forEach($scope.items, function (v) {
                                                var item = {
                                                    icode: v.icode,
                                                    order_id: orderId,
                                                    price: v.price,
                                                    qty: v.qty
                                                };

                                                items.push(item);
                                            });

                                            NewService.saveOrderDetail(items)
                                            .then(function () {
                                                $scope.items = [];
                                                $scope.orderDate = null;
                                                $scope.orderCode = null;
                                                $scope.supplier = null;

                                                swal({
                                                    title: 'สำเร็จ',
                                                    text: 'บันทึกข้อมูลการเบิกเวชภัณฑ์เสร็จเรียบร้อยแล้ว',
                                                    type: 'success',
                                                    confirmButtonText: 'ตกลง',
                                                    timer: 2000
                                                });

                                            }, function (err) {
                                                console.log(err);
                                                swal({
                                                    title: 'เกิดข้อผิดพลาด',
                                                    text: 'เกิดข้อผิดพลาดในการบันทึกรายการ',
                                                    type: 'warning',
                                                    confirmButtonText: 'ตกลง',
                                                    confirmButtonColor: "#DD6B55",
                                                    timer: 2000
                                                });
                                            });

                                        }, function (err) {
                                            console.log(err);
                                        });
                                    }

                                }, function (err) {
                                    console.log(err);
                                    swal({
                                        title: 'เกิดข้อผิดพลาด',
                                        text: 'เกิดข้อผิดพลาดในการบันทึกรายการ',
                                        type: 'warning',
                                        confirmButtonText: 'ตกลง',
                                        confirmButtonColor: "#DD6B55",
                                        timer: 2000
                                    });
                                });

                            } else {
                                swal({
                                    title: 'เกิดข้อผิดพลาด',
                                    text: 'ไม่พบรายการเวชภัณฑ์ที่ต้องการเบิก',
                                    type: 'warning',
                                    confirmButtonText: 'ตกลง',
                                    confirmButtonColor: "#DD6B55",
                                    timer: 2000
                                });
                            }
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };


        });

})(window, window.angular);
