var chart;
function updateBarChart(){

    console.log(sortedAccidentsData.length);
    xAxisCategories = [];
    seriesData = [];

    /*for (var i = 0; i < sortedAccidentsData.length; i++) {
     alert('hello');
     //xAxisCategories.push(sortedAccidentsData[i].provinceName);
     //seriesData.push(sortedAccidentsData[i].values.accidents);

     }*/

    sortedAccidentsData.forEach(function(province) {
        xAxisCategories.push(province.provinceName);
        seriesData.push(province.values.accidents);
    });

    console.log(xAxisCategories);
    console.log(seriesData);

     chart = Highcharts.chart('container', {

        title: {
            text: 'Accidents'
        },

        subtitle: {
            text: 'per province'
        },

        xAxis: {
            categories: xAxisCategories//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            type: 'column',
            colorByPoint: true,
            data: seriesData,//[29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            showInLegend: false
        }],
         chart:{
             inverted:true
         }



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
        console.log("test");
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