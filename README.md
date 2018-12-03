# Compare Accessibility
This is a Nodejs web application using Arcgis Javascript API. It can display two sets of data side by side at the same time. The user can also see a subtraction result of the two sets of data.
## Set Up
#### From Github:
1. If you haven't set up Nodejs on your computer, you need to download it and add it into PATH.
2. Download this folder
3. Browse to the root of the folder
4. Open the terminal/cmd and go to the root of the App './compareAccessibility'. 
5. Type 'npm install'
6. Type 'npm install express --save'
7. Type 'npm install http-errors --save'
8. Type 'npm install fs --save'
9. Put your csv data into './public/data' folder. Cherry can help with the data source. Finally, './data' folder should consist five other folders: './data/GS', './data/Other', './data/Otherpurpose', './data/PSE', and './data/Work'
10. Each CSV file must have the same format as the example data located in './public/dataExample/LosumElem_Ins.csv'. For element in row[0]column[0], it can be empty or some text.
11. The dataset of this App is exactly the same as the one used in AccessibilityLogsum App. 
#### From Lab Computer I
1. Browse to the root of the folder
2. Open the terminal/cmd and go to the root of the App './compareAccessibility'. 
3. In the './public/data/' folder, all the data source is provided.

## Run
1. Use terminal/cmd to go to the root of the App './compareAccessibility'. 
2. Type 'npm start'
2. Browse 'http://localhost:3040' or 'http://162.106.202.155:3040'

## Basic Functionalities
1. The user needs to select two set of data he wants to view.
2. The user is asked to choose the visualization type. One is logsum (zone to zone), and the other one is logsum of logsum (accessibility).
3. The app will show two maps side by side.
4. There is a button 'See Difference' on the bottom. If the button is clicked, the App will show a single map to show a subtraction result.

## Tips:
#### If you want to update the dataset:
All the logsum data set is provided by Cherry. If you just want to simply renew the dataset without changing the structure or name, you can replace csv files into new ones one by one. If you want to change the data structure, it's totally fine since the application will detect your data structure and update the UI.
#### If you want to update the TravelZoneLayer shape file:
 1. The map layer is not stored in localhost. It is stored in the arcgis online server.
 2. In './public/javascript/accessbilityMain.js' and './public/javascript/logsumMain.js', you can find the current travel zone layer: 'https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0'. If you want to change it to another layer, you can create you own arcgis online account and upload the layer to the arcgis server. You need to replace the url into a new one. You can also ask Sandeep to access Yue Ma's arcgis account.
#### If you want to change the legend:
1. Open './public/javascripts/test.js' file, search 'readerer.addBreak' to show that part of code.
2. Right now, the break points all are calculated dynamically. After the user choosing two sets of data, App will choose the left dataset as a threshold to decide the break points of the gradient map. It means your left map always looks very good and your right map may not be that good since it still follow the left map's legend. If you want to change the break points or color, you could just manually change 'renderer.addBreak' to some specific value. 
      For exampe:
      * renderer.addBreak(0, 70, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
      * renderer.addBreak(70, 150, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([249, 238, 237,0.90])));      
#### Woops, the App can't run after changing a new dataset:
 1. You need to restart the server from terminal/cmd (Rerun 'npm start').
 2. If it still runs into error, you may need to compare the new dataset and the old dataset. Make sure everything is the same, except numbers.

