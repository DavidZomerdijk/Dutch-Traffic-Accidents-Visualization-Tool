var chart;


function sortAccidentsOnAccidents(a,b) {
    if (a.values.accidents > b.values.accidents)
        return -1;
    if (a.values.accidents < b.values.accidents)
        return 1;
    return 0;
}

function sortAccidentsOnCapita(a,b) {
    if (a.values.per_capita > b.values.per_capita)
        return -1;
    if (a.values.per_capita < b.values.per_capita)
        return 1;
    return 0;
}


function updateBarChart(showPerProvince){

    xAxisCategories = [];
    seriesData = [];
    subtitle = 'per capita per province';
    yAxisName = 'Percentage %'

    if(!showPerProvince)
    {
        sortedAccidentsData.sort(sortAccidentsOnCapita);
        sortedAccidentsData.forEach(function(province) {
        xAxisCategories.push(province.provinceName);
        seriesData.push(province.values.per_capita);
        });
    }
    else
    {
        sortedAccidentsData.sort(sortAccidentsOnAccidents);
        sortedAccidentsData.forEach(function(province) {
        xAxisCategories.push(province.provinceName);
        seriesData.push(province.values.accidents);
        });
        subtitle = 'per province';
        yAxisName = '#accidents'

    }


    Highcharts.setOptions({
        colors: ['#079edf']
    });
     chart = Highcharts.chart('container', {

        title: {
            text: 'Accidents'
        },

        subtitle: {
            text: subtitle
        },

        xAxis: {
            categories: xAxisCategories
        },

        yAxis: {
      	    title: {
        	    text: yAxisName
            }
        },


        series: [{
            type: 'bar',
            //colorByPoint: true,
            data: seriesData,
            showInLegend: false
        }],
         chart:{
             inverted:true,
             backgroundColor: '#FAFAFA'
        },

         navigation: {
            buttonOptions: {
                enabled: false
            }
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

    var showPerProvince = false;
    $('#perProvince').click(function () {
        updateBarChart(true);

    });

    $('#perCapita').click(function () {
        updateBarChart(false);
    });
}