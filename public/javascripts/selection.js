/*store short name and full name in this dictionary
full name is used to display on the browser. Short name is used to figure out the csv file's full address
*/


let leftRecord = {
    filePath:null
};
let rightRecord = {
    filePath:null
};

let maxDepth = checkDepth(sliderType);
console.log(maxDepth);

for(let i=1;i<maxDepth;i++){
    leftRecord[i] = null;
    rightRecord[i] = null;
}

function setHalfSelection(side,halfSideRecord,num,tmpSliderType){
    if(checkDepth(tmpSliderType)>1) {
        $('#' + side + num).append("<select id = '" + side + num+"Selection' class='form-control'></select>");
        $('#' + side + num+'Selection').append('<option>Please Select</option>');
        for (let k in tmpSliderType) {
            $('#' + side + num+'Selection').append('<option>' + k + '</option>')
        }
        $('#' + side + num+'Selection').on('change', function () {
            halfSideRecord[num] = this.value;
            halfSideRecord.filePath = null;
            emptyOtherSelection(num,maxDepth,side);
            setHalfSelection(side,halfSideRecord,num+1,tmpSliderType[halfSideRecord[num]]);
        });
    }
    else {
        $('#' + side + num).append("<select id = '" + side + num+"Selection' class='form-control'></select>");
        $('#' + side + num+'Selection').append('<option>Please Select</option>');
        for (let k in tmpSliderType) {
            $('#' + side + num + 'Selection').append('<option>' + tmpSliderType[k] + '</option>');
        }
        $('#' + side + num + 'Selection').on('change', function () {
            halfSideRecord[num+1] = this.value;
            halfSideRecord.filePath = null;
            halfSideRecord.filePath = generateFilePath(num,halfSideRecord);
            console.log( halfSideRecord.filePath)
        })
    }
}
setHalfSelection('left',leftRecord,1,sliderType);
setHalfSelection('right',rightRecord,1,sliderType);

function emptyOtherSelection(num,maxValue,side){
    for(let i=num+1;i<maxValue;i++){
        $('#'+side+i).empty();
    }
}
function generateFilePath(num,halfSideRecord){
    result = './data';
    for(let i=1;i<num;i++){
        result = result + '/'+halfSideRecord[i]
    }
    result+='/'+halfSideRecord[num+1]+'.csv';
    return result

}
//Divs object stores the Div ids for UI elements

//add clicking event to submit button
//the user will be asked to choose which view he wants
//if he choose accessibility, then the accessibilitymain.js will be called, and vice versa.
$('#SubmitButton').on('click',function(){
    if(leftRecord.filePath!==null&&rightRecord.filePath!==null){
        BootstrapDialog.show({
            title:'Choose View',
            message: 'Please select a view type!',
            buttons: [{
                label: 'Logsum',
                // no title as it is optional
                action: function(){
                    window.location.href = '/viewLogsum?#'+leftRecord.filePath+'#'+rightRecord.filePath;}
            },  {
                label: 'Accessibility',
                action: function(){
                    window.location.href = '/viewAccessibility?#'+leftRecord.filePath+'#'+rightRecord.filePath;
                }
            }, {
                label: 'Close',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });

    }
    else{
        alert('Incomplete Selection!')

    }
});

function checkDepth(object){
    var level = 1;
    var key;
    for(key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if(typeof object[key] == 'object'){
            var depth = checkDepth(object[key]) + 1;
            level = Math.max(depth, level);
        }
    }
    return level;

}

/*
$('#SubmitButton').on('click',function(){
    var leftCSV = checkAndReturnValue(leftselection);
    var rightCSV=checkAndReturnValue(rightselection);
    if(typeof(leftCSV)!=='undefined'&&typeof(rightCSV)!=='undefined'){
        BootstrapDialog.show({
            title:'Choose View',
            message: 'Please select a view type!',
            buttons: [{
                label: 'Logsum',
                // no title as it is optional
                action: function(){
                    window.location.href = '/viewLogsum?#'+nameDictionary[leftselection['Selecting']]+'&'+leftCSV+'#'+nameDictionary[rightselection['Selecting']]+'&'+rightCSV;
                }
            },  {
                label: 'Accessibility',
                action: function(){
                    window.location.href = '/viewAccessibility?#'+nameDictionary[leftselection['Selecting']]+'&'+leftCSV+'#'+nameDictionary[rightselection['Selecting']]+'&'+rightCSV;
                }
            }, {
                label: 'Close',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });

    }

});
 */