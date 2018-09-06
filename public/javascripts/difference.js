function onInitFs(fs) {

    fs.root.getFile('log2.txt', {}, function(fileEntry) {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                var txtArea = document.createElement('textarea');
                txtArea.value = this.result;
                document.body.appendChild(txtArea);
            };

            reader.readAsText(file);
        }, errorHandler);

    }, errorHandler);


}
function errorHandler(){
    alert('failed')
}
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
require([
  "esri/geometry/Polyline",
  "esri/geometry/Extent",
  "dojo/dom-construct",
  "esri/dijit/Popup",
  "esri/tasks/query",
  "esri/dijit/PopupTemplate",
  "dojo/dom-class",
  "esri/dijit/BasemapToggle",
  "esri/dijit/Legend",
    "esri/map", "esri/layers/FeatureLayer",
    "esri/InfoTemplate", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/renderers/ClassBreaksRenderer","esri/renderers/HeatmapRenderer",
    "esri/Color", "dojo/dom-style", "dojo/domReady!"
], function(Polyline,
  Extent,domConstruct,Popup, Query,PopupTemplate,domClass,BasemapToggle,Legend,Map, FeatureLayer,
    InfoTemplate, SimpleFillSymbol,SimpleLineSymbol,
    ClassBreaksRenderer,HeatmapRenderer,
    Color, domStyle
) {
  
  

  
  
  
});
