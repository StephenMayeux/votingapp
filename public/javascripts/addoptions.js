$(document).ready(function() {
  var numOptions = 2;
  var htmlTag = '';
  $('#newoption').on('click', function() {
    numOptions++;
    htmlTag = 'option' + numOptions;
    $('#newoption').before('<div class="form-group"><label>New Option</label><input type="text" class="form-control" name="options" placeholder="Additional Option"></div>');
  });
});
