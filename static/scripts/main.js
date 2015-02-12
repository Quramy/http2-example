$(function () {
  $('#clear').click(function () {
    $('ul.image-list').empty();
  });

  $('#run').click(function () {
    var i = 0, l = parseInt($('#length').val()), ts = new Date() - 0;
    $('ul.image-list').empty();
    for(i = 0; i < l; i++){
      if(i % 3 !== 0) {
        $('ul.image-list').append($('<img>').attr('src', 'assets/images/ok.png?n=' + i + '&ts=' + ts));
      }else{
        $('ul.image-list').append($('<img>').attr('src', 'assets/images/ng.png?n=' + i + '&ts=' + ts));
      }
    }
  });
});
