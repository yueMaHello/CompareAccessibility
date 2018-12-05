/*store short name and full name in this dictionary
full name is used to display on the browser. Short name is used to figure out the csv file's full address
*/


let leftRecord = {
    filePath:null
};
let rightRecord = {
    filePath:null
};
let pleaseSelect = 'Please Select';
let maxDepth = checkDepth(sliderType);

for(let i=1;i<maxDepth+1;i++){
    $('#leftSelection').append('<div class="selection" id="left'+i+'"></div>');
    $('#rightSelection').append('<div class="selection" id="right'+i+'"></div>');
    leftRecord[i] = null;
    rightRecord[i] = null;
}
//recursive function. Automatically generate buttons based on the data structure.
function setHalfSelection(side,halfSideRecord,num,tmpSliderType){
    if(checkDepth(tmpSliderType)>1) {
        $('#' + side + num).append("<select id = '" + side + num+"Selection' class='form-control'></select>");
        $('#' + side + num+'Selection').append('<option>'+pleaseSelect+'</option>');
        for (let k in tmpSliderType) {
            $('#' + side + num+'Selection').append('<option>' + k + '</option>')
        }
        $('#' + side + num+'Selection').on('change', function () {
            halfSideRecord[num] = this.value;
            console.log(this.value);
            halfSideRecord.filePath = null;
            emptyOtherSelection(num,maxDepth,side);
            if(this.value!==pleaseSelect){
                setHalfSelection(side,halfSideRecord,num+1,tmpSliderType[halfSideRecord[num]]);
            }

        });
    }
    else {
        $('#' + side + num).append("<select id = '" + side + num+"Selection' class='form-control'></select>");
        $('#' + side + num+'Selection').append('<option>'+pleaseSelect+'</option>');

        for (let k=0;k<tmpSliderType.length;k++) {
            $('#' + side + num + 'Selection').append('<option>' + tmpSliderType[k] + '</option>');
        }
        $('#' + side + num + 'Selection').on('change', function () {
            halfSideRecord[num] = this.value;
            halfSideRecord.filePath = generateFilePath(num,halfSideRecord);
        })
    }
}
//set left selection
setHalfSelection('left',leftRecord,1,sliderType);
//set right selection
setHalfSelection('right',rightRecord,1,sliderType);

function emptyOtherSelection(num,maxValue,side){
    for(let i=num+1;i<maxValue+1;i++){
        $('#'+side+i).empty();
    }
}
function generateFilePath(num,halfSideRecord){
    result = './data';
    for(let i=1;i<num;i++){
        result = result + '/'+halfSideRecord[i]
    }
    result+='/'+halfSideRecord[num]+'.csv';
    return result

}


//add clicking event to submit button
//the user will be asked to choose which view he wants
//if he choose accessibility, then the accessibilitymain.js will be called, and vice versa.
$('#SubmitButton').on('click',function(){

    if(leftRecord.filePath!==null&&rightRecord.filePath!==null
        &&leftRecord.filePath.indexOf(pleaseSelect)===-1&&rightRecord.filePath.indexOf(pleaseSelect)===-1){
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
//get the maximum depth of an object
function checkDepth(object){
    var level = 1;
    var key;
    for(key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if(typeof(object[key])=== 'object'){
            var depth = checkDepth(object[key]) + 1;
            level = Math.max(depth, level);
        }
    }
    return level;

}

