exports.main = function() {

  var contextMenu = require("context-menu");
  var pageMod = require("page-mod");
  var data = require("self").data;
    var Request = require("request").Request;

/* SAMPLE DATA */
var image = {
    name: 'hipstermoz.png',
    data: ''
};


  contextMenu.Item({
    label: "Hipsterize! Or, whatever...",
    context: contextMenu.SelectorContext("img"),
    contentScriptFile: [ data.url("jquery.min.js"), data.url("filtr.js") ],
    contentScript: 
        "self.on(\"click\", function (node, data) {\
        node.id=\"hipstermoz\";\
          filtrr.img(node.id, function(filtr) {\
        			filtr.core.grayScale().tint([60,60,30], [210, 210, 210]); \
          filtr.put(); \
                    self.postMessage(filtr.canvas().toDataURL(\"image/png\")); \
	     })});",
    onMessage: function(msg){
      image.data = msg;
      Request({
        url: 'http://imm.io/store/',
        contentType: "multipart/form-data",
        content: {
            name: image.name,
            image: image.data
        },
        onComplete: function (response) {
            let clipboard = require("clipboard");
            clipboard.set(response.json.payload.uri);
        }
      }).post();
    	}
  });
};
