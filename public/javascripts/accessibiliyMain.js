var url = window.location.href.split('#');
var map;
var csvFileName = '../data/'+url[1].split('&')[0]+'/'+url[1].split('&')[1];
var dataMatrix;
var reverseDataMatrix;
var q = d3.queue();
var check = false;
var hoverZone; //mouse-over zone
var sort = [];
var map2;
var csvFileName2 = '../data/'+url[2].split('&')[0]+'/'+url[2].split('&')[1];
var dataMatrix2;
var reverseDataMatrix2;
var check2 = false;
var hoverZone2; //mouse-over zone
var difference = false;

$('#wait').show();
if(csvFileName!==csvFileName2){
    q.defer(d3.csv,csvFileName)
     .defer(d3.csv,csvFileName2)
     .await(brushMap);

}
else{
    q.defer(d3.csv,csvFileName)
        .await(brushMap);
}
function brushMap(error,csvFile1,csvFile2){
    $('#title1').text(url[1].split('&')[0]+' '+url[1].split('&')[1].split('.')[0].split('Logsum')[1]);
    $('#title2').text(url[2].split('&')[0]+' '+url[2].split('&')[1].split('.')[0].split('Logsum')[1]);
    if(typeof(csvFile2)==='undefined'){
        var result = buildMatrixLookup(csvFile1);
        dataMatrix2 = dataMatrix = result[0];
        reverseDataMatrix = reverseDataMatrix = result[1];
    }
    else{
        var result1 = buildMatrixLookup(csvFile1);
        dataMatrix = result1[0];
        reverseDataMatrix = result1[1];

        var result2 = buildMatrixLookup(csvFile2);
        dataMatrix2 = result2[0];
        reverseDataMatrix2 = result2[1]
    }

    $('#wait').hide();
    require([
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "dojo/dom-construct",
        "esri/tasks/query",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "dojo/dom-class",
        "esri/map", "esri/layers/FeatureLayer",
        "esri/InfoTemplate", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/renderers/ClassBreaksRenderer",
        "esri/Color","dojo/domReady!"
    ], function(Polyline,
                Extent,domConstruct,
                Query,Popup, PopupTemplate,domClass,Map, FeatureLayer,
                InfoTemplate, SimpleFillSymbol,SimpleLineSymbol,
                ClassBreaksRenderer,
                Color
    ) {
        leftMap();
        rightMap();

        function leftMap(){
            var popup = new Popup({
                fillSymbol:
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 2)
            }, domConstruct.create("div"));

            map = new Map("map", {
                basemap: "dark-gray-vector",
                center: [-113.4909, 53.5444],
                zoom: 9,
                minZoom:6,
                infoWindow: popup,
                slider: false
            });
            map.setInfoWindowOnClick(true);


            //travelZonelayer
            var travelZoneLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0",{
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],

            });
            //LRT layer
            var lrtFeatureLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/LRT/FeatureServer/0",{
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],
            });
            //click on travelZoneLayer event
            travelZoneLayer.on('click',function(evt){
                var query = new Query();
                query.geometry = pointToExtent(map, event.mapPoint, 10);
                var deferred = travelZoneLayer.selectFeatures(query,
                    travelZoneLayer.SELECTION_NEW);
                map.infoWindow.setFeatures([deferred]);
                map.infoWindow.show(event.mapPoint);
            })
            //mouse over event
            travelZoneLayer.on('mouse-over',function(evt){
                var graphic = evt.graphic;
                hoverZone = graphic.attributes.TAZ_New;
                var access;
                if(check === false){
                    access = dataMatrix[hoverZone];
                }
                else{
                    access = reverseDataMatrix[hoverZone];
                }

                map.infoWindow.setTitle("<b>Zone Number: </b>"+hoverZone);
                if(typeof(access)!=='undefined'){
                    map.infoWindow.setContent("<b><font size=\"3\"> Value:</font> </b>"+ "<font size=\"4\">"+access.toFixed(2)+"</font>");
                }
                else{
                    map.infoWindow.setContent("<b><font size=\"3\"> Value:</font> </b>"+ "<font size=\"4\">"+'undefined'+"</font>");
                }
                map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
            });

            sort =  Object.values(dataMatrix).sort(function(a, b){return a - b});



            var symbol = new SimpleFillSymbol();
            var renderer = new ClassBreaksRenderer(symbol, function(feature){
                if(check === false){
                    return dataMatrix[feature.attributes.TAZ_New];
                }
                else{
                    return reverseDataMatrix[feature.attributes.TAZ_New];
                }
            });
            //legend. If you want to change legend scale or legend color, this part of code needs to be modified
            changeRender(renderer);
            travelZoneLayer.setRenderer(renderer);
            //legend


            map.on('load',function(){
                map.addLayer(travelZoneLayer);
                map.addLayer(lrtFeatureLayer);
                travelZoneLayer.redraw();
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
            $("#interact").click(function(e, parameters) {
                if($("#interact").is(':checked')){
                    check= true;
                    travelZoneLayer.redraw();
                }
                else{
                    check= false;
                    travelZoneLayer.redraw();

                }
            });


        }

        function rightMap(){



            var popup2 = new Popup({
                fillSymbol:
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 2)
            }, domConstruct.create("div"));

            map2 = new Map("map2", {
                basemap: "dark-gray-vector",
                center: [-113.4909, 53.5444],
                zoom: 9,
                minZoom:6,
                infoWindow: popup2,
                slider: false
            });
            map2.setInfoWindowOnClick(true);

            //travelZonelayer
            var travelZoneLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0",{
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],

            });
            //LRT layer
            var lrtFeatureLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/LRT/FeatureServer/0",{
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],
            });
            //click on travelZoneLayer event
            travelZoneLayer.on('click',function(evt){

                var query = new Query();
                query.geometry = pointToExtent(map2, event.mapPoint, 10);
                var deferred = travelZoneLayer.selectFeatures(query,
                    travelZoneLayer.SELECTION_NEW);
                map2.infoWindow.setFeatures([deferred]);
                map2.infoWindow.show(event.mapPoint);

            });
            //mouse over event
            travelZoneLayer.on('mouse-over',function(evt){
                var graphic = evt.graphic;
                hoverZone2 = graphic.attributes.TAZ_New;
                var access;
                if(check2 === false){
                    if(difference===false){
                        access = dataMatrix2[hoverZone2];

                    }
                    else{
                        access = dataMatrix[hoverZone2]-dataMatrix2[hoverZone2]
                    }
                }
                else{
                    if(difference===false){
                        access = reverseDataMatrix2[hoverZone2];

                    }
                    else{
                        access = reverseDataMatrix[hoverZone2]-reverseDataMatrix2[hoverZone2]
                    }
                }

                map2.infoWindow.setTitle("<b>Zone Number: </b>"+hoverZone2);
                if(typeof(access)!=='undefined'){
                    map2.infoWindow.setContent("<b><font size=\"3\"> Value:</font> </b>"+ "<font size=\"4\">"+access.toFixed(2)+"</font>");
                }
                else{
                    map2.infoWindow.setContent("<b><font size=\"3\"> Value:</font> </b>"+ "<font size=\"4\">"+'undefined'+"</font>");
                }
                map2.infoWindow.show(evt.screenPoint,map2.getInfoWindowAnchor(evt.screenPoint));
            });

            var symbol = new SimpleFillSymbol();
            var renderer = new ClassBreaksRenderer(symbol, function(feature){
                if(check2 === false){
                    return dataMatrix2[feature.attributes.TAZ_New];
                }
                else{
                    return reverseDataMatrix2[feature.attributes.TAZ_New];
                }
            });
            //legend. If you want to change legend scale or legend color, this part of code needs to be modified
            changeRender(renderer);
            travelZoneLayer.setRenderer(renderer);
            //legend


            map2.on('load',function(){
                map2.addLayer(travelZoneLayer);
                map2.addLayer(lrtFeatureLayer);
                travelZoneLayer.redraw();
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
            $("#interact2").click(function(e, parameters) {
                if($("#interact2").is(':checked')){
                    check2 = true;
                    travelZoneLayer.redraw();
                }
                else{
                    check2 = false;
                    travelZoneLayer.redraw();

                }
            });

            subtractMap();
            function subtractMap(){

                $('#subtractButton').on('click',function() {
                    map2.centerAt([-114,53.5444]);
                    $('#subtractButton').hide();
                    $('#map2').height('100%');
                    $('#title').text('Compare Accessibility: '+' '+$('#title1').text()+' - '+$('#title2').text());
                    $('#title2').hide();
                    $('#section1').hide();
                    $('#section2').width("100%");
                    $('#section2').height("95%");

                    difference = true;
                    var list = {};
                    for(var k in dataMatrix){
                        list[k] = dataMatrix[k]-dataMatrix2[k]

                    }
                    sort =  Object.values(list).sort(function(a, b){return a - b});

                    var symbol = new SimpleFillSymbol();
                    var renderer = new ClassBreaksRenderer(symbol, function(feature){
                        if(check2 === false){
                            return dataMatrix[feature.attributes.TAZ_New]-dataMatrix2[feature.attributes.TAZ_New];
                        }
                        else{
                            return reverseDataMatrix[feature.attributes.TAZ_New]-reverseDataMatrix2[feature.attributes.TAZ_New];
                        }
                    });
                    changeRender(renderer);
                    travelZoneLayer.setRenderer(renderer);
                    travelZoneLayer.redraw();
                    travelZoneLayer.redraw();

                });
            }

        }

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
    });

}

//convert csv array into good format(zone-to-zone).
//read csv file into a 2d matrix
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

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}


if( window.history && window.history.pushState ){

    history.pushState( "nohb", null, "" );
    $(window).on( "popstate", function(event){
        if( !event.originalEvent.state ){
            history.pushState( "nohb", null, "" );
            return;
        }
    });
}