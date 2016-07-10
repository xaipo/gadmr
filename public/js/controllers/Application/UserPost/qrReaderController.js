app.controller('qrCrtl', ['$scope','$window','$resource', function ($scope,$window,$resource) {
    $scope.onSuccess = function (data) {
        if (!$scope.postExist) {
            console.log(data);
            $scope.getUserPost(data);
        }
        //$window.location.href = data;
    };
    $scope.onError = function (error) {
        console.log(error);
    };
    $scope.onVideoError = function (error) {
        console.log(error);
    };
    $scope.getUserPost = function (idPost) {
        var url = "/api/userPosts/"+idPost;
        var res = $resource('', {}, {
            Invocar: {
                url: url,
                method: 'GET',
                isArray: false
            }
        });
        res.Invocar({}, function (resOk) {
            if (resOk) {
                $scope.userPost = resOk;
                $scope.postExist= true;
                console.log($scope.userPost);
            }
        });
    }
}]);