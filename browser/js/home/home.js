app.config(function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/:category',
		templateUrl: 'js/home/home.html',
		controller: 'HomeCtrl',
		resolve: {
			pics: function (ImgurFactory, $stateParams) {
				var category = $stateParams.category

				//prevents results loading from /r/porn 
				if (!category) category = 'earth'
				return ImgurFactory.getImages(category.toString())
			}
		}
	});
});

app.controller('HomeCtrl', function ($scope, pics, $interval, ImgurFactory) {

	$scope.categories = ImgurFactory.categories;
	//initial set retrieval
	$scope.pics = pics.data;



	if ($scope.pics.length == 0) {
		console.log('oops')
		$scope.showError = true;
	}

	//limits to images that fit well on the screen
	$scope.landscapesOnly = $scope.pics.filter(function (elem) {
		return (elem.width > elem.height) && (elem.animated == false);
	})

	var randIndex = function () {
		return _.random(0, $scope.landscapesOnly.length)
	}

	//set initial pic for interval
	$scope.picOfTheHour = $scope.landscapesOnly[randIndex()]

	$scope.date = new Date

	//change every so often. this doesn't persist yet. future plans to stick it in the session
	$interval(function () {
		$scope.picOfTheHour = $scope.landscapesOnly[randIndex()]
	}, 3600000)

	$interval(function () {
		$scope.date = new Date
			// console.log($scope.date)
	}, 60000)

	$scope.newImage = function () {
		$scope.picOfTheHour = $scope.landscapesOnly[randIndex()] || $scope.landscapesOnly[1]
			// console.log($scope.picOfTheHour)
	}


	//loading screen, thanks Stefan Henze
	$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.resolve) {
			$scope.showSpinner();
		}
	});
	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		if (toState.resolve) {
			$scope.hideSpinner();
		}
	});

	$scope.loading = false;

	$scope.showSpinner = function () {
		console.log("hey!!")
		$scope.loading = true;
	}

	$scope.hideSpinner = function () {
		$scope.loading = false;
	}

})