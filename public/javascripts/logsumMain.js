var url = window.location.href.split('#');
var map;
var csvFileName = '../data/'+url[1].split('&')[0]+'/'+url[1].split('&')[1];
var dataMatrix;
var q = d3.queue();
var check = false;
var largestIndividualArray = [];
var selectZone = '101'; //default selectZone when you open the browser.
var hoverZone; //mouse-over zone
var sort = [];
var map2;
var csvFileName2 = '../data/'+url[2].split('&')[0]+'/'+url[2].split('&')[1];
var dataMatrix2;
var check2 = false;
// var largestIndividualArray2 = [];
var selectZone2 = '101'; //default selectZone when you open the browser.
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
        dataMatrix2 = dataMatrix = buildMatrixLookup(csvFile1);
    }
    else{
        dataMatrix = buildMatrixLookup(csvFile1);
        dataMatrix2 = buildMatrixLookup(csvFile2);
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
                var graphic = evt.graphic;
                selectZone= graphic.attributes.TAZ_New;
                var query = new Query();
                query.geometry = pointToExtent(map, event.mapPoint, 10);
                var deferred = travelZoneLayer.selectFeatures(query,
                    travelZoneLayer.SELECTION_NEW);
                map.infoWindow.setFeatures([deferred]);
                map.infoWindow.show(event.mapPoint);
                travelZoneLayer.redraw();
            })
            //mouse over event
            travelZoneLayer.on('mouse-over',function(evt){
                var graphic = evt.graphic;
                hoverZone = graphic.attributes.TAZ_New;
                var access;
                if(check === false){
                    access = dataMatrix[selectZone][hoverZone];
                }
                else{
                    access = dataMatrix[hoverZone][selectZone];
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
            //adjust the legend range dynamically based on current matrix
            largestIndividualArray = findRangeForIndividualCalcultion();
            sort = Object.values(largestIndividualArray).sort((prev,next)=>prev-next); //from smallest to largest
            sort = sort.map(x =>x.toFixed(2)); //make legend to 2 decimal numbers.

            var symbol = new SimpleFillSymbol();
            var renderer = new ClassBreaksRenderer(symbol, function(feature){
                if(check === false){
                    return dataMatrix[selectZone][feature.attributes.TAZ_New];
                }
                else{
                    return dataMatrix[feature.attributes.TAZ_New][selectZone];
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
                var graphic = evt.graphic;
                selectZone2 = graphic.attributes.TAZ_New;
                var query = new Query();
                query.geometry = pointToExtent(map2, event.mapPoint, 10);
                var deferred = travelZoneLayer.selectFeatures(query,
                    travelZoneLayer.SELECTION_NEW);
                map2.infoWindow.setFeatures([deferred]);
                map2.infoWindow.show(event.mapPoint);
                travelZoneLayer.redraw();
            })
            //mouse over event
            travelZoneLayer.on('mouse-over',function(evt){
                var graphic = evt.graphic;
                hoverZone2 = graphic.attributes.TAZ_New;
                var access;
                if(check2 === false){
                    if(difference===false){
                        access = dataMatrix2[selectZone2][hoverZone2];

                    }
                    else{
                        access = dataMatrix[selectZone2][hoverZone2]-dataMatrix2[selectZone2][hoverZone2]
                    }
                }
                else{
                    if(difference===false){
                        access = dataMatrix2[hoverZone2][selectZone2];

                    }
                    else{
                        access = dataMatrix[hoverZone2][selectZone2]-dataMatrix2[hoverZone2][selectZone2]
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
                    return dataMatrix2[selectZone2][feature.attributes.TAZ_New];
                }
                else{
                    return dataMatrix2[feature.attributes.TAZ_New][selectZone2];
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
                    $('#title').text('Compare Accessibility: '+' '+$('#title1').text()+' - '+$('#title2').text());
                    $('#title2').hide();
                    $('#section1').hide();
                    $('#section2').width("100%");
                    $('#section2').height("95%");


                    $('#map2').height('100%');
                    $('#subtractButton').hide();
                    difference = true;
                    largestIndividualArray = findRangeForIndividualCalcultion();
                    sort = Object.values(largestIndividualArray).sort((prev,next)=>prev-next); //from smallest to largest
                    sort = sort.map(x =>x.toFixed(2)); //make legend to 2 decimal numbers.
                    var symbol = new SimpleFillSymbol();
                    var renderer = new ClassBreaksRenderer(symbol, function(feature){
                        if(check2 === false){
                            return dataMatrix[selectZone2][feature.attributes.TAZ_New]-dataMatrix2[selectZone2][feature.attributes.TAZ_New];
                        }
                        else{
                            return dataMatrix[feature.attributes.TAZ_New][selectZone2]-dataMatrix2[feature.attributes.TAZ_New][selectZone2];
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
function buildMatrixLookup(arr) {
    var lookup = {};
    var index = arr.columns;
    var verbal = index[0];
    for(var i =0; i<arr.length;i++){
        var k = arr[i][verbal];
        delete arr[i][verbal];
        lookup[parseInt(k)] = Object.keys(arr[i]).reduce((obj, key) => (obj[parseInt(key)] = Number(arr[i][key]),obj), {});
    }

    return lookup;
}
//the legend range is based on the data for zone101
//you can change it to other algorithm
function findRangeForIndividualCalcultion(){
    if(difference){
        console.log(1111);
        var list = {};
        for(var k in dataMatrix['101']){
            list[k] = dataMatrix['101'][k]-dataMatrix2['101'][k]

        }
        return list
    }
    return dataMatrix['101'];
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