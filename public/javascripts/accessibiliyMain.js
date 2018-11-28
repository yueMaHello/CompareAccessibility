/*
This script is used to show the accessibility of two dataset. The accessibility means logsum of logsum.
The maps will be static ones. The user can't interact with maps, but there is a toggle button on the left corner of each map.
Toggle button is unchecked: 'Origin to Destination', and is checked: 'Destination to Origin'
 */

//selection.js stored the dataset name info in the url and pass it to this script
var url = window.location.href.split('#');//selection.js stored the dataset name info in the url and pass it to this script
var q = d3.queue();
var sort = [];//store the left map's zone[101] sorted data as legend reference
var difference = false;//Record 'See Difference' button status
var mapProperties = {
    'map':null,
    'csvFileName':null,
    'dataMatrix': null,
    'reverseDataMatrix':null,
    'check':false,
    'hoverZone':null,
    'mapDivId':null,
    'interactButtonId':null,
    'travelZoneLayer':null,
    'lrtFeatureLayer':null,
    'renderer':null
};

//create two 'MapProperties' objects with seperate initialization
var leftMapProperties = JSON.parse(JSON.stringify(mapProperties));
leftMapProperties.csvFileName = url[1];
leftMapProperties.mapDivId='map';
leftMapProperties.interactButtonId = 'interact';

var rightMapProperties = JSON.parse(JSON.stringify(mapProperties));
rightMapProperties.csvFileName = url[2];
rightMapProperties.mapDivId='map2';
rightMapProperties.interactButtonId = 'interact2';

$('#wait').show();//Show loading gif
//if datasets are different
if(leftMapProperties.csvFileName!==rightMapProperties.csvFileName ){ //if datasets are different
    q.defer(d3.csv,leftMapProperties.csvFileName)
        .defer(d3.csv,rightMapProperties.csvFileName )
        .await(brushMap);
}
else{//if datasets are the same
    q.defer(d3.csv,leftMapProperties.csvFileName)
        .await(brushMap);
}
//main function
function brushMap(error,csvFile1,csvFile2){
    let leftName = decodeURI(leftMapProperties.csvFileName).replace('./data/','').replace('.csv','').split("/").join(", ");
    let rightName = decodeURI(rightMapProperties.csvFileName).replace('./data/','').replace('.csv','').split("/").join(", ");
    $('#title1').text(leftName);
    $('#title2').text(rightName);

    //if two datasets are different
    if(typeof(csvFile2)==='undefined'){
        var result = buildMatrixLookup(csvFile1);
        leftMapProperties.dataMatrix = rightMapProperties.dataMatrix = result[0];
        leftMapProperties.reverseDataMatrix = rightMapProperties.reverseDataMatrix = result[1];
    }
    //if two datasets are same
    else{
        var result1 = buildMatrixLookup(csvFile1);
        leftMapProperties.dataMatrix = result1[0];
        leftMapProperties.reverseDataMatrix = result1[1];

        var result2 = buildMatrixLookup(csvFile2);
        rightMapProperties.dataMatrix = result2[0];
        rightMapProperties.reverseDataMatrix = result2[1]
    }

    $('#wait').hide();//finish loading datasets
    require([
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "dojo/dom-construct",
        "esri/tasks/query",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "dojo/dom-class",
        "esri/map", "esri/layers/FeatureLayer",
        "esri/InfoTemplate", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol","esri/layers/GraphicsLayer", "esri/graphic",
        "esri/renderers/ClassBreaksRenderer",
        "esri/Color","dojo/domReady!"
    ], function(Polyline,
                Extent,domConstruct,
                Query,Popup, PopupTemplate,domClass,Map, FeatureLayer,
                InfoTemplate, SimpleFillSymbol,SimpleLineSymbol,GraphicsLayer, Graphic,
                ClassBreaksRenderer,
                Color
    ) {



        plotMap(leftMapProperties);
        plotMap(rightMapProperties);

        //add color to the map
        function plotMap(mapProperties){
            var popup = new Popup({
                fillSymbol:
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 2)
            }, domConstruct.create("div"));

            mapProperties.map = new Map(mapProperties.mapDivId, {
                basemap: "dark-gray-vector",
                center: [-113.4909, 53.5444],
                zoom: 9,
                minZoom:6,
                infoWindow: popup,
                slider: false
            });
            mapProperties.map.setInfoWindowOnClick(true);
            //travelZonelayer
            mapProperties.travelZoneLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0",{
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["TAZ_New"],
                infoTemplate: new InfoTemplate()

            });
            //LRT layer
            mapProperties.lrtFeatureLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/LRT/FeatureServer/0",{
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],
            });
            //click on travelZoneLayer event
            mapProperties.travelZoneLayer.on('click',function(evt){
                var query = new Query();
                query.geometry = pointToExtent(mapProperties.map, event.mapPoint, 10);

            });

             sort =  Object.values(leftMapProperties.dataMatrix).sort(function(a, b){return a - b});

            var symbol = new SimpleFillSymbol();
            mapProperties.renderer = new ClassBreaksRenderer(symbol, function(feature){
                if(mapProperties.check === false){
                    return mapProperties.dataMatrix[feature.attributes.TAZ_New];
                }
                else{
                    return mapProperties.reverseDataMatrix[feature.attributes.TAZ_New];
                }
            });

            mapProperties.renderer=changeRender(mapProperties.renderer);
            mapProperties.travelZoneLayer.setRenderer(mapProperties.renderer);
            //legend
            mapProperties.map.on('load',function(){
                mapProperties.map.addLayer(mapProperties.travelZoneLayer);
                mapProperties.map.addLayer(mapProperties.lrtFeatureLayer);
                mapProperties.travelZoneLayer.redraw();
            });


            function pointToExtent (map, point, toleranceInPixel) {
                var pixelWidth = map.extent.getWidth() / map.width;
                var toleranceInMapCoords = toleranceInPixel * pixelWidth;
                return new Extent(point.x - toleranceInMapCoords,
                    point.y - toleranceInMapCoords,
                    point.x + toleranceInMapCoords,
                    point.y + toleranceInMapCoords,
                    map.spatialReference);
            }

            //'origin to destination' or 'destination to origin
            $("#"+mapProperties.interactButtonId).click(function(e, parameters) {
                if($("#"+mapProperties.interactButtonId).is(':checked')){
                    mapProperties.check= true;
                    mapProperties.travelZoneLayer.redraw();
                }
                else{
                    mapProperties.check= false;
                    mapProperties.travelZoneLayer.redraw();
                }
            });
        }
        //Apply render to the map. If you want to change legend scale or legend color, this part of code needs to be modified
        function changeRender(renderer){
            var chunkZones = 89;
            renderer.addBreak(-Infinity, sort[chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
            renderer.addBreak(sort[chunkZones], sort[2*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	249, 238, 237,0.90])));
            renderer.addBreak(sort[2*chunkZones], sort[3*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([243, 224, 219,0.90])));
            renderer.addBreak(sort[3*chunkZones], sort[4*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([237, 214, 202,0.90])));
            renderer.addBreak(sort[4*chunkZones], sort[5*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([225, 200, 170,0.90])));
            renderer.addBreak(sort[5*chunkZones],  sort[6*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([213, 196, 141,0.90])));
            renderer.addBreak(sort[6*chunkZones],  sort[7*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([207, 197, 127,0.90])));
            renderer.addBreak(sort[7*chunkZones], sort[8*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([201, 199, 113,0.90])));
            renderer.addBreak(sort[8*chunkZones], sort[9*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([185, 195, 101,0.90])));
            renderer.addBreak(sort[9*chunkZones], sort[10*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([168, 189, 88,0.90])));
            renderer.addBreak(sort[10*chunkZones], sort[11*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([149, 183, 77,0.90])));
            renderer.addBreak(sort[11*chunkZones], sort[12*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([129, 177, 66,0.90])));
            renderer.addBreak(sort[12*chunkZones], sort[13*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([109, 171, 55,0.90])));
            renderer.addBreak(sort[13*chunkZones], sort[14*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([87, 165, 45,0.90])));
            renderer.addBreak(sort[14*chunkZones], sort[15*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	66, 159, 36,0.90])));
            renderer.addBreak(sort[15*chunkZones], sort[16*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([44, 153, 27,0.90])));
            renderer.addBreak(sort[16*chunkZones], sort[17*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	37, 121, 24,0.90])));
            renderer.addBreak(sort[17*chunkZones], sort[18*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([11, 106, 18,0.90])));
            renderer.addBreak(sort[18*chunkZones], Infinity, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([5, 80, 15,0.90])));
            return renderer;
        }
        subtractMap();
        //after clicking the 'see difference button', the left matrix will subtract the right matrix.
        //The subtraction matrix will be plotted show on the map.
        function subtractMap(){
            $('#subtractButton').on('click',function() {
                rightMapProperties.map.centerAt([-114,53.5444]);
                $('#subtractButton').hide();
                $('#'+rightMapProperties.mapDivId).height('100%');
                $('#title').text('Compare Accessibility: '+' '+$('#title1').text()+' - '+$('#title2').text());
                $('#title2').hide();
                $('#section1').hide();
                $('#section2').width("100%");
                $('#section2').height("95%");

                difference = true;
                var list = {};
                for(var k in leftMapProperties.dataMatrix){
                    list[k] = leftMapProperties.dataMatrix[k]-rightMapProperties.dataMatrix[k]
                }
                sort =  Object.values(list).sort(function(a, b){return a - b});
                var symbol = new SimpleFillSymbol();
                rightMapProperties.renderer = new ClassBreaksRenderer(symbol, function(feature){
                    if(rightMapProperties.check === false){
                        return leftMapProperties.dataMatrix[feature.attributes.TAZ_New]-rightMapProperties.dataMatrix[feature.attributes.TAZ_New];
                    }
                    else{
                        return leftMapProperties.reverseDataMatrix[feature.attributes.TAZ_New]-rightMapProperties.reverseDataMatrix[feature.attributes.TAZ_New];
                    }
                });
                rightMapProperties.renderer=changeRender(rightMapProperties.renderer);
                rightMapProperties.travelZoneLayer.setRenderer(rightMapProperties.renderer);
                rightMapProperties.travelZoneLayer.redraw();
            });
        }
    });
}

//calculate 1d accessibility array based on a 2d matrix.
function buildMatrixLookup(arr) {
    var lookup = {};
    var logsumOfLogsum = {};
    var reverseLogsumOfLogsum={};
    var index = arr.columns;
    var verbal = index[0];
    for(var i =0; i<arr.length;i++){
        var k = arr[i][verbal];
        delete arr[i][verbal];
        lookup[parseInt(k)] = Object.keys(arr[i]).reduce((obj, key) => (obj[parseInt(key)] = Number(arr[i][key]),obj), {});
    }
    for(var i in lookup){
        var total = 0;
        var reverseTotal = 0
        for(var j in lookup[i]){
            total += Math.exp(lookup[i][j]);
            reverseTotal += Math.exp(lookup[j][i]);
        }
        logsumOfLogsum[i] =  getBaseLog(2.718,total);
        reverseLogsumOfLogsum[i] = getBaseLog(2.718,reverseTotal);
    }
    return [logsumOfLogsum,reverseLogsumOfLogsum];
}
//log
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

// //prevent back button
// if( window.history && window.history.pushState ){
//     history.pushState( "nohb", null, "" );
//     $(window).on( "popstate", function(event){
//         if( !event.originalEvent.state ){
//             history.pushState( "nohb", null, "" );
//             return;
//         }
//     });
// }
