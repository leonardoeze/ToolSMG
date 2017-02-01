
//var IncidenteModule = angular.module('IncidenteModule', ['ngMaterial', 'ngMessages']);
var AbmIncidenteModule = angular.module('AbmIncidenteModule');

//IncidenteModule.controller('ToastCtrl', ['$scope',' $mdToast',ToastCtrl]);
AbmIncidenteModule.controller('IncidenteController',['$scope','$http','$filter',IncidenteController])
.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow
    /*$mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('blue')
      .dark();

    $mdThemingProvider.theme('docs-light', 'default')
        .primaryPalette('')
        .dark();*/

  });

 function IncidenteController($scope,$http,$filter) {

    $scope._id = null;
    $scope.generadoPor = '';
    $scope.fecha = '';
    $scope.estado = '';
    $scope.prioridad = '';
    $scope.descripcion = '';
	  $scope.cauTexto = '';
	  $scope.numero ;


    $scope.estadosIncidente = ('1 - Recibido ;2 - En proceso ;3 - En pausa ;4 - Fix en otro INC ;5 - Envio Pre ;6 - Envio Pro ;7 - Re Abierto ;8 - Cerrado ;9 - Derivado ;10 - Requiere OK SMG ;11 - Verifica y Cierra ;12 - Portal No autorizado ;13 - En sector QA - STK')
    .split(';').map(function(estado){
        return {est: estado};
      });

    $scope.estadosPrioridad =('1-Critical;2-High;3-Medium;4-Low')
    .split(';').map(function(estado){
        return {est: estado};
    });

    var meses = ("JAN;FEB;MAR;APR;MAY;JUN;JUL;AUGUST;SEP;OCT;NOV;DEC")
    .split(';').map(function(mes){
        return {mes: mes}
    });

    $scope.incidentes = [];

    $scope.guardar = function() {

    var incidente = new Incidente ($scope.generadoPor,$scope.fecha,$scope.estado,$scope.prioridad,$scope.descripcion,$scope.numero);

      if(validar(incidente)){

        var incidenteEcontrado = $filter('filter')($scope.incidentes,{numero: $scope.numero} ,true);

      if(incidenteEcontrado.length){
        var index = $scope.incidentes.indexOf(incidenteEcontrado[0])
            $scope.incidentes[index] = incidente;
      }else{
            $scope.incidentes.push(incidente);
          }

			$http({

				method:'GET',
				//url:'http://192.168.0.30:8080/insert',
        url:'http://localhost:8080'
				//data: incidente,
        //headers: {'Content-Type': 'application/json'}
				//contentType: "application/json"
				})
				.then(function successCallback(response){

          //  alert(response.value);

						});
        $scope.limpiarDatos();
      }
    };

    $scope.recuperar = function(index) {
        $scope._id = index;
        $scope.generadoPor = $scope.incidentes[index].generadoPor;
        $scope.fecha = $scope.incidentes[index].fecha_registro;
        $scope.estado = $scope.incidentes[index].estado;
        $scope.prioridad = $scope.incidentes[index].prioridad;
        $scope.descripcion = $scope.incidentes[index].descripcion;
		    $scope.numero = $scope.incidentes[index].numero;
    };

    $scope.eliminar = function(indice) {
        var incidentes_actualizado = [];
        for (var i = 0; i < $scope.incidentes.length; i++) {
            if (i != indice) {
                incidentes_actualizado.push($scope.incidentes[i]);
            }
        }
        $scope.incidentes = incidentes_actualizado;
    };

    $scope.limpiarDatos = function() {
        $scope._id = null;
        $scope.generadoPor = '';
		      $scope.fecha = '';
        $scope.estado = '';
        $scope.prioridad = '';
        $scope.descripcion = '';
		      $scope.numero = '';
		        $scope.cauTexto = '';
    };

	$scope.cargar = function(){

		if($scope.cauTexto != ''){
			var inicioTexto        = $scope.cauTexto.search("El caso ha sido reportado por");
			var findex             = 30+inicioTexto;
			var eindex             = $scope.cauTexto.search(" bajo el No.:") - findex ;
			$scope.generadoPor     = $scope.cauTexto.substr(findex, eindex) || '';
			findex  				       = eindex;
			findex 					       = $scope.cauTexto.search(" bajo el No.:");

			$scope.numero 		 = parseInt($scope.cauTexto.substr(findex+14,6)) ;

			var textoBusquedaFecha = " con Fecha de apertura: ";
			findex 					       = $scope.cauTexto.search(textoBusquedaFecha);
			var fecha              = $scope.cauTexto.substr(findex+textoBusquedaFecha.length,19)|| '';

      var palabraFechas      = fecha.split(' ').map(function(palabra){
        return palabra;
      });

      if(palabraFechas.length){
        var mesNumero =  $filter('filter')(fecha,{mes: palabraFechas[0]} ,true);
        var diaNumero = palabraFechas[1];
        var añoNumero = palabraFechas[2];

        $scope.fecha = new Date(añoNumero,mesNumero,diaNumero);
    }


      var textoBusquedaDescr = "siguiente Descripción: ";
			findex 					       = $scope.cauTexto.search(textoBusquedaDescr);
			$scope.descripcion		 = $scope.cauTexto.substr(findex+textoBusquedaDescr.length,$scope.cauTexto.length)|| '';
		}
	};

$scope.cargarIncidentes = function (){
  $http({
    method:'GET',
    url:'http://localhost:8080/getAll',
      //url:'http://servicio-incidente.herokuapp.com/getall',
    dataType: "application/json"
    })
    .then(function successCallback(response){
      var log = [];
      var fechaConvertida;
      $scope.incidentes = [];
      $scope.params.total = response.data.length;

      angular.forEach(response.data, function(value, key) {


        var palabraFechas      = value[2].split('/').map(function(palabra){
          return palabra;
        });

        if(palabraFechas.length){
          var diaNumero = palabraFechas[0];
          var mesNumero = palabraFechas[1]
          var añoNumero = palabraFechas[2];

          fechaConvertida = new Date(añoNumero,mesNumero,diaNumero);
        }


      var incidente = new Incidente(parseInt(value[0]),value[1],fechaConvertida,value[3],value[4],value[5],value[6],value[7],value[8],value[9],value[10],"generadoPor");
          $scope.incidentes.push(incidente);

      }, log);

    });


  };

  function validar(incidente){
    if(incidente.numero == -1){
        return false;
    }
    if(incidente.generadoPor == ''){
        return false;
    }
    if(incidente.fecha == ''){
        return false;
    }
    if(incidente.estado == ''){
        return false;
    }
    if(incidente.prioridad == ''){
        return false;
    }
    if(incidente.detalle == ''){
        return false;
    }
    return true;
  }
};
