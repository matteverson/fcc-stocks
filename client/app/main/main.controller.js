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
        var quotes = stock.history.quote.map(function(quote) {
          return [new Date(quote.Date).getTime(), parseFloat(quote.Close)];
        }).sort();
        $scope.chartConfig.series.push({
          id: stock.symbol,
          data: quotes
        });
      });
    }, true);

    $scope.addStock = function() {
      if($scope.newStock === '') {
        return;
      }
      $http.post('/api/stocks', { symbol: $scope.newStock });
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
        text: 'Hello'
      },
      useHighStocks: true
    };

});
