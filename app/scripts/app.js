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

var datasetStatus = {0: false, 1: true};

function toggleDataset(i, on) {
  datasetStatus[i] = on;
  var cards = document.querySelectorAll("chart-card");
  Array.prototype.forEach.call(cards, function(card) {
    if (card.myChart) {
      card.myChart.config.data.datasets[i].hidden = on;
      card.myChart.render()
    }
  });
  return on;
}


function showBig(server) {
  document.querySelector("#big-card").server = server;
  document.querySelector("#big-card").loadChart();
  document.querySelector("#big-card").style.display = "block";
  document.querySelector("#main").style.display = "none";
}


(function(document) {
  'use strict';



  var cards = [];
  window.addEventListener('WebComponentsReady', function(e) {
    document.querySelector("#cpu").addEventListener("change", function(e) {
      toggleDataset(1, !e.target.checked);
    });

    document.querySelector("#network").addEventListener("change", function(e) {
      toggleDataset(0, !e.target.checked);
    });

    var main = document.querySelector("#main");
    get("?servers", function(response) {
      Array.prototype.forEach.call(response.servers, function(server) {
        var cc = document.createElement('chart-card');
        cc.server = server
        cards.push(cc);
        main.appendChild(cc);
      });
      onScroll();
      document.querySelector("#mainContainer").addEventListener("scroll", onScroll);
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
       if (card.autoload && isInLoadableArea(card)) {
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




})(document);
