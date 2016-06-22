/**
 * Created by PatricioXavier on 9/25/2015.
 */


//inject angular file upload directives and services.


app.controller('createPostCtrl', ['$scope', 'Upload', '$timeout', '$log', '$resource', '$window', 'MoviModals', function ($scope, Upload, $timeout, $log, $resource, $window, MoviModals) {

    //$upload.upload({
    //    url: 'api/user/uploads',
    //    method: 'POST',
    //    data: data // Any data needed to be submitted along with the files
    //    file: files
    //});
    $scope.map = {
        center: {latitude: -0.18189495786972482, longitude: -78.4675376734192},
        zoom: 8
    };


    //$scope.options = {scrollwheel: false};
    $scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;

    $scope.marker = {
        id: 0,
        coords: {
            latitude: 40.1451,
            longitude: -99.6680
        },
        options: {draggable: true},
        events: {
            dragend: function (marker, eventName, args) {
                $log.log('marker dragend');
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                $log.log(lat);
                $log.log(lon);

                $scope.marker.options = {
                    draggable: true,
                    labelContent: "lat: " + $scope.marker.coords.latitude + '<br/>' + 'lon: ' + $scope.marker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };

    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
        if (_.isEqual(newVal, oldVal))
            return;
        $scope.coordsUpdates++;
    });

    $scope.createPost = function (picture) {
        picture.upload = Upload.upload({
            url: 'api/user/uploads',
            data: {
                title: $scope.frmUserPost.postTitle,
                file: picture,
                detail: $scope.frmUserPost.postDetail,
                location: $scope.marker.coords,
                time: new Date(),
                username: $scope.username ? $scope.username : "xavivacio",
                category: $scope.frmUserPost.category.category,
                likes: 0,
                state: 'Pendiente',
                evidence: ''
            }
        });

        picture.upload.then(function (response) {
            $timeout(function () {
                picture.result = response.data;
            });
            if (response.data.message == 'Post Added') {
                MoviModals.mostrarModal($scope.modalCreatePost);
            }

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        picture.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            picture.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    $scope.getCurrentLocation = function () {
        //temporal
        $scope.map = {
            center: {latitude: -0.03332492883901059, longitude: -78.45309874582216},
            zoom: 15
        };

        $timeout(function () {
            $scope.marker.coords = {
                latitude: -0.03332492883901059,//position.coords.latitude,
                longitude: -78.45309874582216//position.coords.longitude
            };
            $scope.dynamicMoveCtr++;
        }, 1000);
        return;
        //original
        navigator.geolocation.getCurrentPosition(function (position) {

            $scope.map = {
                center: {latitude: position.coords.latitude, longitude: position.coords.longitude},
                zoom: 15
            };

            $timeout(function () {
                $scope.marker.coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                $scope.dynamicMoveCtr++;
            }, 1000);

        });
    };

    $scope.getCategories = function () {
        var url = "/api/categories";
        var res = $resource('', {}, {
            Invocar: {
                url: url,
                method: 'GET',
                isArray: true
            }
        });
        res.Invocar({}, function (resOk) {
            if (resOk) {
                $scope.categories = resOk;
                $scope.frmUserPost.category = $scope.categories[0];

            }
        });
    }

    $scope.Regresar = function () {
        $window.location.href = '/retoMovi';
    }

    $scope.cargarModales = function () {
        $scope.modalCreatePost = {
            idModal: 'PostCreation',
            aceptar: 'RedirectPosts',
            titulo: 'Estimado Usuario.',
            mensaje: 'Su  post se ha creado correctamente.',
            bloquearCerrar: true
        }
        $scope.modalCreatePost.botones = [
            {
                tipo: 'aceptar',
                lbl: 'Aceptar',
                click: "botonesModal.Aceptar('" + $scope.modalCreatePost.idModal + $scope.modalCreatePost.aceptar + "')"
            }
        ]
        $scope.$on($scope.modalCreatePost.idModal + $scope.modalCreatePost.aceptar, function (context, params) {
            $window.location.href = '/retoMovi';
        })

    }
    $scope.pageLoad = function () {
        $scope.cargarModales();

        $scope.username = $window.localStorage.getItem('user');
        $scope.getCurrentLocation();
        $scope.getCategories();

    }
    $scope.pageLoad();


}])
;