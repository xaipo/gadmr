app.controller('qrCrtl', ['$scope','$window', function ($scope,$window) {
    $scope.onSuccess = function (data) {
        console.log(data);
        $window.location.href = data;
    };
    $scope.onError = function (error) {
        console.log(error);
    };
    $scope.onVideoError = function (error) {
        console.log(error);
    };
}]);