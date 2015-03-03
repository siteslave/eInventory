(function (window, angular) {

    angular.module('app.customer.CustomerController', [])
        .controller('CustomerController', function ($scope, CustomerService) {

            $scope.customers = [];
            $scope.isUpdate = false;
            $scope.tab = 0;
            // Get customer list
            $scope.getCustomerList = function () {
                CustomerService.getList()
                    .then(function (rows) {
                        $scope.customers = rows;
                    }, function (err) {
                        console.log(err);
                    });
            };

            //
            $scope.getCustomerList();

            $scope.setTab = function (tab) {
                $scope.tab = tab;

                if (tab === 0) $scope.isUpdate = false;

                if(!$scope.isUpdate) $scope.customerName = null;
            };

            // save customer
            $scope.doSave = function () {
                // is edited
                if ($scope.isUpdate) {
                    // update
                    CustomerService.doUpdate($scope.customerId, $scope.customerName)
                        .then(function () {

                            $scope.getCustomerList();

                            swal({
                                title: 'สำเร็จ',
                                text: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                type: 'success',
                                confirmButtonText: 'ตกลง',
                                timer: 1500
                            });

                            $scope.customerName = null;
                            $scope.customerId = null;
                            $scope.setTab(0);

                        }, function (err) {
                            console.log(err);
                        });
                } else {
                    // new
                    // check duplicated
                    CustomerService.isDuplicated($scope.customerName)
                        .then(function (res) {
                            if (res) {
                                swal({
                                    title: 'ซ้ำ',
                                    text: 'ข้อมูลซ้ำ',
                                    type: 'error',
                                    confirmButtonText: 'ตกลง',
                                    timer: 1500
                                });
                            } else {
                                // save
                                CustomerService.doSave($scope.customerName)
                                    .then(function () {

                                        $scope.getCustomerList();

                                        swal({
                                            title: 'สำเร็จ',
                                            text: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                            type: 'success',
                                            confirmButtonText: 'ตกลง',
                                            timer: 1500
                                        });

                                        $scope.customerName = null;
                                        $scope.setTab(0);

                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        });
                }

            };

            // set edit
            $scope.setEdit = function (id, name) {
                $scope.customerName = name;
                $scope.customerId = id;
                $scope.isUpdate = true;
                $scope.setTab(1);
            };


            // do remove
            $scope.doRemove = function (id) {

                swal({
                    title: "Are you sure?",
                    text: "คุณต้องการลบรายการนี้ใช่หรือไม่!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                }, function () {
                    CustomerService.doRemove(id)
                        .then(function () {
                            swal("Deleted!", "รายการถูกลบเสร็จเรียบร้อยแล้ว.", "success");
                            $scope.getCustomerList();
                        }, function (err) {
                            console.log(err);
                        });
                });

            };

        });

})(window, window.angular);
