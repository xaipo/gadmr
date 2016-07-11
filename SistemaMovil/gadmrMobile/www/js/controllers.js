angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('ChatsCtrl', function ($scope, $resource, ExpressService) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.detalle;

    $scope.$on('$ionicView.enter', function (e) {
      $scope.getUserPosts();
    });

    $scope.getUserPosts = function () {
      var url = ExpressService.getUrl("/api/userPosts");
      var res = $resource('', {}, {
        Invocar: {
          url: url,
          method: 'GET',
          isArray: true
        }
      });
      res.Invocar({}, function (resOk) {
        if (resOk) {
          $scope.userPosts = resOk.reverse();
          //$scope.getPostsLocation();
        }
      });
    }
    $scope.getPostImage=function (image) {

      return ExpressService.getUrl(image);
    }

    $scope.gotoCreatePost = function () {
      $window.location.href = '#/tab/chats/1';
    }
    $scope.openMaps = function (userPost) {
      window.open('http://maps.google.com/maps?z=17&t=m&q=loc:' + userPost.location.latitude + '+' + userPost.location.longitude + "'", '_system', 'location=yes');
    }
    $scope.updatePostList = function () {
      $scope.getUserPosts();
    }

    $scope.updateLikes = function (post) {
      var body;
      if (post.userLike) {
        body = {removeLike: true};
        post.userLike = undefined;
      }
      else {
        body = {addLike: true};
        post.userLike = true;
      }
      var url = ExpressService.getUrl("/api/userPosts/:id");
      var res = $resource('', {}, {
        Invocar: {
          url: url,
          method: 'PUT'
        }
      });
      res.Invocar({id: post._id}, body, function (resOk) {
        if (resOk) {
          if (body.addLike) {
            post.likes = resOk.likes - 1
          }
          else {
            post.likes = resOk.likes
          }
          post.textoApoyo = post.textoApoyo ? post.textoApoyo = undefined : post.textoApoyo = 'T\u00FA y '
        }
      });
    }
    // $scope.chats = Chats.all();
    // $scope.remove = function (chat) {
    //   Chats.remove(chat);
    // };
  })

  .controller('ChatDetailCtrl', function ($scope, $cordovaCamera, $resource, $stateParams, ExpressService) {
    $scope.getCategories = function () {
      var url = ExpressService.getUrl("/api/categories");
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
          //$scope.frmUserPost.category = $scope.categories[0];

        }
      });
    }
    $scope.pageLoad = function () {

      $scope.username = 'UsuarioMovil';
      $scope.frmUserPost={};
      $scope.marker = {
        id: 0,
        coords: {
          latitude: -1.664156,
          longitude: -78.654493
        }
      };
      $scope.getCategories();


    }

    $scope.pageLoad();
    $scope.takePicture = function() {
      var options = {
        quality : 75,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 999,
        targetHeight: 667,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

    $scope.createPost = function () {
      //primero subir imagen, despues guardar registro, al finzalizar mostrar mesnaje pequnpo y requesar apnatallla de posts.
      //alert("este"+$scope.frmUserPost.postTitle);

      var url = ExpressService.getUrl("/api/userPosts");
      var res = $resource('', {}, {
        Invocar: {
          url: url,
          method: 'POST',
          //isArray: true
        }
      });
      var data={
        title: $scope.frmUserPost.postTitle,
        //file: undefined,
        detail: $scope.frmUserPost.postDetail,
        location: $scope.marker.coords,
        time: new Date(),
        username: $scope.username ? $scope.username : "xavivacio",
        category: $scope.frmUserPost.category.category,
        likes: 0,
        state: 'Pendiente',
        evidence: '',
        mobilePic: $scope.imgURI
      }
      //alert(url);
      res.Invocar(data, function (resOk) {
        //alert(resOk);
        if (resOk) {
          alert("Publicacion Creada");
        }
      });
    }
    //$scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope, $resource, $cordovaBarcodeScanner, ExpressService) {
    $scope.scanBarcode = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
        // alert(imageData.text);
        $scope.getUserPost(imageData.text);
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
      }, function (error) {
        console.log("An error happened -> " + error);
      });
    };

    // $scope.onSuccess = function (data) {
    //   if (!$scope.postExist) {
    //     console.log(data);
    //     $scope.getUserPost(data);
    //   }
    //   //$window.location.href = data;
    // };
    // $scope.onError = function (error) {
    //   console.log(error);
    // };
    // $scope.onVideoError = function (error) {
    //   console.log(error);
    // };
    $scope.getUserPost = function (idPost) {
      var url = ExpressService.getUrl("/api/userPosts/" + idPost);
      var res = $resource('', {}, {
        Invocar: {
          url: url,
          method: 'GET',
          isArray: false
        }
      });
      res.Invocar({}, function (resOk) {
        if (resOk) {
          //alert('entro' + imageData.text);
          $scope.userPost = resOk;
          $scope.userPostPicture=ExpressService.getUrl($scope.userPost.picture);
          $scope.userPostEvidence=ExpressService.getUrl($scope.userPost.evidence);
          $scope.postExist = true;
          console.log($scope.userPost);
        }

      });
    }
    $scope.settings = {
      enableFriends: true
    };

    $scope.shwoDetalle= function(){

      alert($scope.detalle);
      console.log($scope.detalle);
    }
  });
