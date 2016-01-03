$(document).ready(function() {
  var labels = $('#labels').val();
  labels = labels.split(',');

  var data = $('#data').val();
  data = data.split(',');

  var total = 0;
  data.forEach(function(item) {
    var x = parseInt(item);
    total += x;
  });

  if (total === 1) {
    $('#total').text(total + ' vote casted');
  } else {
    $('#total').text(total + ' votes casted');
  }  

  var chartData = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(151,187,205,0.5)",
        strokeColor: "rgba(151,187,205,0.8)",
        highlightFill: "rgba(151,187,205,0.75)",
        highlightStroke: "rgba(151,187,205,1)",
        data: data
      }
    ]
  };

  var ctx = $('#myChart').get(0).getContext('2d');
  var barChart = new Chart(ctx).Bar(chartData, {responsive: true});
});
