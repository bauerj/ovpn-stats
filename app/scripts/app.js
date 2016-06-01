function get(query, then, error) {
  if (!error) {
    error = function(status, description) {
      console.log(status, description);
    }
  }
  var endpoint = "http://bauerj.eu/ovpn-stats/" + query;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4)
      return;
    if (xhr.status != 200)
      return error(xhr.status, xhr.responseText);
    var response = JSON.parse(xhr.responseText);
    if (!response["success"])
      return error(200, response["error"]);
    then(response);
  }
}

(function(document) {
  'use strict';
  var cards = [];
  window.addEventListener('WebComponentsReady', function(e) {
    var main = document.querySelector("#main");
    get("?servers", function(response) {
      Array.prototype.forEach.call(response.servers, function(server) {
        var cc = document.createElement('chart-card');
        cc.server = server
        cards.push(cc);
        main.appendChild(cc);
      });
      onScroll();
    })
  });

  function isInLoadableArea(element) {
            var elementBound = element.getBoundingClientRect(),
                threshold    = 500;
            var loadable =  // check if element is in loadable area from top
                           ((window.innerHeight + threshold) > elementBound.top) &&
                           // check if element is even in loadable are from bottom
                           (-threshold < elementBound.bottom);
           return loadable;
   }

   var maxScroll = 0;
   function onScroll() {
     if (window.scrollY < maxScroll)
      return;
    maxScroll = window.scrollY;
     if (cards.length == 0)
      window.removeEventListener("scroll", onScroll);
      var remove = [];
     for (var i=0; i< cards.length; i++)  {
       var card = cards[i];
       if (isInLoadableArea(card)) {
         remove.push(card.server);
         card.loadChart();
       }
     }
     for (var i=0; i< remove.length; i++)  {
       var server = remove[i];
       for (var j=0; j<cards.length; j++) {
         if (cards[j].server == server)
          cards.splice(j, 1);
       }

     }
   }

   window.addEventListener("scroll", onScroll);



})(document);
