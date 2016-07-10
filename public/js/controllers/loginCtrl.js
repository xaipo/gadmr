/**
 * Created by PatricioXavier on 9/25/2015.
 */

'use strict';

var app = angular.module('MoviApp', ['AppServices', 'AppModals', 'ngResource', 'ngFileUpload', 'mgcrea.ngStrap', 'reCAPTCHA', 'uiGmapgoogle-maps']);
app.config(function (reCAPTCHAProvider) {

    //set Google API Public Key
    //Local
    reCAPTCHAProvider.setPublicKey('6Lf8CA4TAAAAAKnPbfIO5nCkDVgnFh6BJT_9r-p1');

    // optional: gets passed into the Recaptcha.create call
    reCAPTCHAProvider.setOptions({
        theme: 'blackglass'
    });
})
    .factory('Recaptcha', function ($resource) {
        return $resource(
            '/validateCaptcha',
            {id: '@id'},
            {
                send: {
                    url: '/validateCaptcha',
                    method: 'POST'
                }
            }
        )
    })

app.controller('loginController', ["$scope", "$timeout", "$resource", "$window", "GlobalSvc", "Recaptcha", function ($scope, $timeout, $resource, $window, GlobalSvc, Recaptcha) {

    //Load Style sheets

    //head.load(AppConfigSettings.Assets.cssIndex, function () {
    //    //Pages Loaded
    //});

    //$scope.username = 'xavier';

    $scope.Login = function () {
        var url = "/api/authenticate/:username/:password";
        var res = $resource('', {}, {
            Invocar: {
                url: url,
                method: 'GET'
                //isArray: true
                //headers: myHeaders
                //timeout: timeout.promise
            }
        });
        res.Invocar({username: $scope.username, password: $scope.password}, function (resOk) {
            if (resOk.autenticate) {
                $window.localStorage.setItem('user', $scope.username);

                $window.location.href = '/retoMovi';
                //$location.path("/");
                //$location.replace("/");
            } else {
                $scope.failLogin = true;
            }
        });

    };

    $scope.createAccount = function () {
        $scope.frmModo = "cuenta";
        $scope.clearData();
        //$window.location.href = '/CreateAccount';
    }

    $scope.Regresar = function () {
        $scope.frmModo = "login";
        $scope.clearData();
        //$window.location.href = '/CreateAccount';
    }

    $scope.Registrar = function () {
        $scope.invalidCaptcha = false ;
        $scope.procesando = true;
        Recaptcha.send($scope.captchaValidate).$promise
            .then(function (resp) {
                if (resp && resp.code == 0) {
                    var url = "/api/users";
                    var res = $resource('', {}, {
                        Invocar: {
                            url: url,
                            method: 'POST'
                            //isArray: true
                            //headers: myHeaders
                            //timeout: timeout.promise
                        }
                    });
                    var user = {
                        "username": $scope.newusername,
                        "name": $scope.name,
                        "lastName": $scope.lastname,
                        "birthday": $scope.birthday,
                        "cellphone": $scope.cellphone,
                        "sex": $scope.sex.value,
                        "email": $scope.email,
                        "password": $scope.passwordnew
                    };
                    res.Invocar(user, function (resOk) {
                        $scope.procesando = false;
                        if (resOk.message && resOk.message == "User Added") {
                            GlobalSvc.muestraMensaje('Estimado Usuario.', "Su  cuenta se ha creado correctamente");
                            $scope.frmModo = "login";
                        } else {
                            GlobalSvc.muestraMensaje('Estimado Usuario.', "Ha ocurrido problemas. Intentelo mas tarde");
                        }
                        $scope.clearData();
                    });
                }
                else {
                    $scope.procesando = false;
                    $scope.invalidCaptcha = true;
                }
            });
        return;

    }
    $scope.clearData = function () {
        $scope.procesando = false;
        $scope.newusername = undefined;
        $scope.name = undefined;
        $scope.lastname = undefined;
        $scope.birthday = null;
        $scope.cellphone = undefined;
        $scope.sex = undefined;
        $scope.email = null;
        $scope.passwordnew = undefined;
        $scope.repeatPasswordnew = undefined;
        $scope.username = undefined;
        $scope.password = undefined;
        $scope.captchaValidate = undefined;
    }

    $scope.pageLoad = function () {
        $scope.frmModo = "login";
        //var url = "http://localhost:3001/api/getUsers";
        //var res = $resource('', {}, {
        //    Invocar: {
        //        url: url,
        //        method: 'GET',
        //        isArray: true
        //        //headers: myHeaders
        //        //timeout: timeout.promise
        //    }
        //});
        //res.Invocar({}, function (resOk) {
        //    $scope.username = resOk[0].username;
        //});

        $timeout(function () {
            $scope.pageLoading = false;
        }, 1000);
    };
    $scope.pageLoad();
}]);

