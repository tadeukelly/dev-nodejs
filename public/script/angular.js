var app = angular.module('myApp', []);

app.controller('TextController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  
  $http.get('/user/isloggedin')
      .success(function(response) {
            if (response.status.trim().toLowerCase() == "success"){
              $scope.GetMenuApi();
              $scope.usuarioLogado = true;
            }
            else
              $scope.usuarioLogado = false;
      });
  $scope.signIn = false;
	
  $scope.Login = function() {
      $http.post('/user/login', {
          username: $scope.username,
          password: $scope.password,
        }).success(function(response) {
            if (response.status.trim().toLowerCase() == "success") {              
              $scope.GetMenuApi();
              $scope.usuarioLogado = true;
            } else {
              $scope.usuarioLogado = false;              
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


