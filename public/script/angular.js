var app = angular.module('myApp', ['ui.router',"highcharts-ng"]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        
        .state('login', {
            url: '/login',
            templateUrl: '../partials/partial-login.html',
            controller: 'LoginController'
        })
        
        .state('signin', {
            url: '/signin',
            templateUrl: '../partials/partial-signin.html',
            controller: 'LoginController'
        })

        .state('app', {
            url: '/app',
            templateUrl: '../partials/partial-main.html',
            controller: 'MainController'
        })  

        .state('app.organizacao', {
            url: '/organizacao',
            templateUrl: '../partials/partial-main-organizacao.html',
            controller: 'MainController'        
        }) 

        .state('app.chat', {
            url: '/chat',
            templateUrl: '../partials/partial-main-socket.html',
            controller: 'ChatController'        
        });

        //$locationProvider.html5Mode(true);      
        
});



app.controller('LoginController', ['$scope', '$http', '$timeout', '$state', '$rootScope', function($scope, $http, $timeout, $state, $rootScope) {
// enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/login'];

  // check if current location matches route  
  var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        return _.str.startsWith(route, noAuthRoute);
      });
  };

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if route requires auth and user is not logged in
    if (!routeClean($location.url())) 
    {
      console.log("aqui");
      $http.get('/user/isloggedin')
          .success(function(response) {        
                if (response.status.trim().toLowerCase() == "success"){              
                  $state.go('app');                  
                }            
      });            
    }
  });
  
  $scope.Login = function() {
      $http.post('/user/login', {
          username: $scope.username,
          password: $scope.password,
        }).success(function(response) {
            if (response.status.trim().toLowerCase() == "success") {
              $state.go('app');
            } else {
              showAlert('warning', 'Oooops!', response.message.trim());
            } 
          })
          .error(function(response, err) {            
              showAlert('danger', 'Ohhhhh!', 'Erro de processamento. Por favor, contate o administrador do sistema e informe o erro ['+err+' - '+response+']');
          });
    };    

  $scope.SignUp = function() {

      $http.post('/user/signup',  {
          username: $scope.username,
          password: $scope.password,
        }).success(function(response) {              
              $scope.username='';
              $scope.password='';              
              showAlert('success', 'Obaaaaa!', 'Usuário criado com sucesso!');
          })
          .error(function(response, err) {            
              $scope.username='';
              $scope.password='';
              if (err === 401)
                  showAlert('info', 'Opa!', 'Este usuário já existe, por favor, escolha um outro nome.', 5000);
              else  
                  showAlert('danger', 'Ohhhhh!', 'Erro de processamento. Por favor, contate o administrador do sistema e informe o erro ['+err+' - '+response+']');
          });
  };

  var alertTimeout;
  function showAlert(type, title, message, timeout) {
      $scope.alert = {
        hasBeenShown: true,
        show: true,
        type: type,
        message: message,
        title: title
      };
      $timeout.cancel(alertTimeout);
      alertTimeout = $timeout(function() {
        $scope.alert.show = false;
      }, timeout || 3000);
    }

  }
]);  


app.controller('MainController', ['$scope', '$http', '$timeout', '$state', function($scope, $http, $timeout, $state) {
  
  $http.get('/user/isloggedin')
      .success(function(response) {
            if (response.status.trim().toLowerCase() != "success"){              
              $state.go('login');
            }            
      });      
	
  $scope.GetMenuApi = function() {          
      $http.get("/api/menu").
      success(function(response, status, headers, config) {
        $scope.menu = response;
      }).
      error(function(response, status, headers, config) {
        showAlert('danger', 'Ohhhhh!', 'Erro de processamento. Por favor, contate o administrador do sistema e informe o erro ['+response+']');       
      });
  };

  $scope.ConsultaBusOrg = function() {
      $scope.wheel='glyphicon glyphicon-refresh glyphicon-refresh-animate';
      $http.get("/api/org/" + $scope.bus_org_name).
      success(function(response, status, headers, config) {
        $scope.organizacao = response;
        $scope.wheel='';
      }).
      error(function(response, status, headers, config) {
        showAlert('danger', 'Ohhhhh!', 'Erro de processamento. Por favor, contate o administrador do sistema e informe o erro ['+response+']');       
        $scope.wheel='';
      });
  };

  var alertTimeout;
  function showAlert(type, title, message, timeout) {
      $scope.alert = {
        hasBeenShown: true,
        show: true,
        type: type,
        message: message,
        title: title
      };
      $timeout.cancel(alertTimeout);
      alertTimeout = $timeout(function() {
        $scope.alert.show = false;
      }, timeout || 3000);
    }

  }
]); 


app.controller('ChatController', ['$scope', function($scope) {  
  $scope.messages=[];  
  $scope.xAxisCategories=[];
  $scope.dataSeries=[];

  $scope.chartConfig = {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Temperature'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
                categories: $scope.xAxisCategories                
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Nivel do Solo',
            data: $scope.dataSeries
        }]
    };


  var socket = io.connect();
  $scope.SendMsg = function() {      
      socket.emit('chat message', $scope.msg.from, $scope.msg.text);      
  };
  socket.on('chat message', function(data){
      $scope.messages.push(data);
      $scope.$apply();
  });
  socket.on('visitas', function(data){
      $scope.visitas = data;
      $scope.$apply();
  });
  socket.on('mqtt', function(data){
      $scope.messages.push(data);
      addPoint(parseInt(data, 10));
      $scope.$apply();
  });

  function addPoint(data) {
        moment().zone('BRST');        
        var x = moment().format('ddd DD-MMM HH[h]mm');
        var y = data;      
        $scope.dataSeries.push(y)
        $scope.xAxisCategories.push(x)                  
  }

  $scope.addPoints = function () {
        moment().zone('BRST');        
        var x = moment().format('ddd DD-MMM HH[h]mm');
        var y = Math.floor(Math.random()*15);      
        $scope.dataSeries.push(y)
        $scope.xAxisCategories.push(x)        
    };
  
}]);    



