'use strict';

$(function () {
  $('#create').click(function () {
    var createTaskRequest = function() {
      return $.ajax({
        url: '/task'
      }).pipe(function (data) {
        $('#tasklist').append($('<li>').attr('id', data.id).text('id: ' + data.id + ': Running...'));
        return data;
      });
    };

    var recieveResult = function(data) {
      return $.ajax({
        url: '/task/' + data.id + '/result'
      }).then(function (){
        $('#' + data.id).text('id: ' + data.id + ': Done!');
      });
    };

    createTaskRequest().then(function (data) {
      setTimeout(function () {
        recieveResult(data);
      }, 0);
    });

  });
});
