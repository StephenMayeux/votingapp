$(document).ready(function() {
  var labels = $('#labels').val();
  labels = labels.split(',');
  var data = $('#data').val();
  data = data.split(',');

  var chartData = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: data
      }
    ]
  };

  var ctx = $('#myChart').get(0).getContext('2d');
  var barChart = new Chart(ctx).Bar(chartData, {responsive: true});
});
