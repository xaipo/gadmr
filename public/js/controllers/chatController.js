/**
 * Created by xavier.moreno on 23/04/2015.
 */

'use strict';
var app= angular.module('chatApp', ['btford.socket-io']);

app.controller('chatController',["$scope","mySocket","$timeout",function($scope,mySocket,$timeout){
    //Load Style sheets

    head.load(AppConfigSettings.Assets.cssIndex, function () {
        //Pages Loaded
    });
    $scope.nicknames=[];
    $scope.messages=[];
    //var socket=io.connect();
    $scope.nicknameSucessful=false;
    $scope.setNickname= function(){
        mySocket.emit('nickname',$scope.nickname,function(data){
            if(data){
                console.log('Nickname set successfully!');
                $scope.nicknameSucessful=true;
            }
            else{
                $scope.errorNickname="Sorry - that nickname is already taken.";
            }

        });
    };
    $scope.sendMessage= function(){
        mySocket.emit('user message',$scope.message);
    };
    mySocket.on('nicknames',function(data){
        if(data){
            $scope.nicknames=data;
        }
    });
    mySocket.on('user message',function(data){
        if(data){
            $scope.messages.push(data);
        }
    });
    $scope.pageLoad = function () {
        $timeout(function () {
            $scope.pageLoading = false;
        }, 1000);
    }
    $scope.pageLoad();
}]);

app.factory('mySocket', function (socketFactory) {
    return socketFactory();
});