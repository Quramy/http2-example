'use strict';

/*
navigator.serviceWorker.ready.then(function (registration) {
  registration.pushRegistratoinManager.register('/scripts/worker.js').then(function (pushRegistration) {
    console.log(pushRegistration);
  }, function (err) {
    console.log(err);
  });
}, function (err) {
  console.log(err);
});
*/

navigator.serviceWorker.register('/scripts/worker.js').then(function (reg) {
  console.log('regist', reg);
});
