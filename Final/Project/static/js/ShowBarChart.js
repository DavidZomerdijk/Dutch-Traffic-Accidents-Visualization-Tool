var chart;
function updateBarChart(){

    xAxisCategories = [];
    seriesData = [];

    sortedAccidentsData.forEach(function(province) {
        xAxisCategories.push(province.provinceName);
        seriesData.push(province.values.accidents);
    });

     chart = Highcharts.chart('container', {

        title: {
            text: 'Accidents'
        },

        subtitle: {
            text: 'per province'
        },

        xAxis: {
            categories: xAxisCategories
        },

        series: [{
            type: 'bar',
            //colorByPoint: true,
            data: seriesData,
            showInLegend: false
        }],
         chart:{
             inverted:true,
             backgroundColor: '#dddddd'
         },

         navigation: {
            buttonOptions: {
                enabled: false
            }
        }

    });

    Highcharts.setOptions({
        colors: ['#058DC7']
    });

    $('#plain').click(function () {
        chart.update({
            chart: {
                inverted: false,
                polar: false
            },
            subtitle: {
                text: 'Plain'
            }
        });
    });

    $('#inverted').click(function () {
        chart.update({
            chart: {
                inverted: true,
                polar: false
            },
            subtitle: {
                text: 'Inverted'
            }
        });
    });

    $('#polar').click(function () {
        chart.update({
            chart: {
                inverted: false,
                polar: true
            },
            subtitle: {
                text: 'Polar'
            }
        });
    });
}