'use strict';

angular.module('fccStocksApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.stocks = [];

    $http.get('/api/stocks').success(function(stocks) {
      $scope.stocks = stocks;
      socket.syncUpdates('stock', $scope.stocks);
    });

    $scope.$watch('stocks', function(newVal, oldVal) {
      $scope.chartConfig.series = [];
      newVal.forEach(function(stock) {
        $scope.chartConfig.series.push({
          name: stock.symbol,
          data: stock.history
        });
        $scope.pending = false;
      });
    }, true);

    $scope.addStock = function() {
      if($scope.newStock === '') {
        return;
      }
      $scope.pending = true;
      $http.post('/api/stocks', { symbol: $scope.newStock.toUpperCase() });
      $scope.newStock = '';
    };

    $scope.deleteStock = function(stock) {
      $http.delete('/api/stocks/' + stock._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('stock');
    });

    $scope.chartConfig = {
      options: {
        chart: {
          zoomType: 'x'
        },
        rangeSelector: {
          enabled: true
        },
        navigator: {
          enabled: true
        }
      },
      series: [],
      title: {
        text: 'Daily Close'
      },
      useHighStocks: true
    };

});
