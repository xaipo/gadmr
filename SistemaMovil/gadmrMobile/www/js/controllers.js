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
          $scope.frmUserPost.category = $scope.categories[0];

        }
      });
    }
    $scope.pageLoad = function () {

      $scope.username = 'UsuarioMovil';
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
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        alert(imageData);

      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

    $scope.createPost = function (picture) {
      //primero subir imagen, despues guardar registro, al finzalizar mostrar mesnaje pequnpo y requesar apnatallla de posts.
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
          alert('se anadio el post =)')
          //MoviModals.mostrarModal($scope.modalCreatePost);
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
