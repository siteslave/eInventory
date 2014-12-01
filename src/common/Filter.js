;(function (window, angular) {

    'use strict';

    var moment = require('moment');

    angular.module('app.filters.Main', [])
        .filter('toThaiDate', function () {
            return function (date) {
                if (!date) {
                    return '';
                } else {
                    var oldDate = moment(date),
                        thaiYear = parseInt(oldDate.get('year')) + 543;

                    return oldDate.get('date') + '/' + (oldDate.get('month')+1) + '/' + thaiYear;
                }
            };
        })
        .filter('toSex', function () {
            return function (sex) {
                if (!sex) {
                    return '';
                } else {
                    return sex == '1' ? 'ชาย' : 'หญิง';
                }
            };
        })
        .filter('toFullAge', function () {
            /**
             * Date format is yyyy-mm-dd (MySQL Date)
             */
            return function (date) {
                if (date)
                {
                    var birthDate = moment(date);
                    var dd = birthDate.get('date'),
                        mm = birthDate.get('month'),
                        yy = birthDate.get('year');

                    var currentDate = moment(),
                        c_dd = currentDate.get('date'),
                        c_mm = currentDate.get('month') + 1,
                        c_yy = currentDate.get('year');

                    var age_d, age_m, age_y;

                    //get date
                    if (c_dd >= dd)
                    {
                        age_d = c_dd - dd;
                    }
                    else
                    {
                        c_mm = c_mm -1;
                        c_dd = c_dd + 30;
                        age_d = c_dd - dd;
                    }

                    //get month
                    if (c_mm >= mm)
                    {
                        age_m = c_mm - mm;
                    }
                    else
                    {
                        c_yy = c_yy - 1;
                        c_mm = c_mm + 12;
                        age_m = c_mm - mm;
                    }

                    age_y = c_yy - yy;

                    return age_y + '-' + age_m + '-' + age_d;
                }
                else
                {
                    return '0-0-0';
                }
            };
        });
})(window, window.angular);