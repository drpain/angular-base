var app = angular.module("app", ['ngRoute', 'api', 'routing', 'ng-fastclick']);

    app.config(function ($httpProvider) {
      $httpProvider.defaults.headers.post = {};
      $httpProvider.defaults.headers.get = {};
      $httpProvider.defaults.withCredentials = true;
    });

    // Index Controller
    app.controller("indexCtrl", [
        "$scope", "$route", "shows", "serviceStorage", "$location",
        function($scope, $route, shows, serviceStorage, $location) {

        $scope.search = "";
        $scope.state = "Continuing";
        $scope.data = {};
        $scope.loaded = false;
        $scope.titleLength = 13;
        $scope.perpage = 60;
        $scope.page = 1;
        $scope.paging = $scope.perpage * $scope.page;
        $scope.scrollToTop = false;

        // Clear an input
        $scope.clear = function(input) {
            $scope[input] = "";
        };

        $scope.scrollToTheTop = function() {
            window.scrollTo(0, 0);
        };

        $scope.pageUp = function() {
            $scope.page++;
            $scope.paging = $scope.perpage * $scope.page;
        };

        $scope.listContext = function(state) {
            switch(state) {
                case 'ended':
                    $scope.state = 'Ended';
                    break;
                case 'all':
                    $scope.state = false;
                    break;
                case 'continuing':
                default:
                    $scope.state = 'Continuing';
                    break;        
            }
        };

        // Detail specific context
        $scope.setDetail = function(data) {
            serviceStorage.set('series', data);
        };

        $scope.location = $route.current;

        // Load the content from the API
        shows.get({}, function(series){
            $scope.data = series.data;
            console.log($scope.data);

            if ($scope.showId) {
                $scope.data = $scope.data.series;
            }

            $scope.loaded = true;
            localStorage.setItem('series', JSON.stringify(series));

        // Failure
        }, function(response){
            switch (response.status) {
                case 400:
                case 401:
                    $location.path("/login");
                    break;
                default:
                    $location.path("/failure");
                    break;
            }
        });
    }]);
