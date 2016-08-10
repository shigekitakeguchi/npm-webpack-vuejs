var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter);

var appComponent = Vue.extend(require('../components/app.vue'));

var App = Vue.extend({});
var router = new VueRouter();

//ajaxをDeferred化
//呼び出し方：$.ajaxDeferred(URL, 'json')
$.extend({
  ajaxDeferred: function(URL, dataType){
    var defer = $.Deferred();
    $.ajax({
      url: URL,
      type: 'GET',
      crossDomain: true,
      dataType: dataType,
      timeout: 3000,
      success: defer.resolve,
      error: defer.reject
    });
    return defer.promise();
  }
});

router.map({
  '/': { component: appComponent}
})

router.start(App, '#app');
