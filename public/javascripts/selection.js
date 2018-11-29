/*store short name and full name in this dictionary
full name is used to display on the browser. Short name is used to figure out the csv file's full address
*/

// var sliderType = {
//     'Work':{
//         'High':['Insuff Car','No Car','Suff Car','Need Car At Work'],
//         'Low':['Insuff Car','No Car','Suff Car','Need Car At Work'],
//         'Medium':['Insuff Car','No Car','Suff Car','Need Car At Work'],
//     },
//     'PSE':['Insuff Car','No Car','Suff Car'],
//
//     'GS':{
//         'Elementary School':['Insuff Car','No Car','Suff Car'],
//         'Junior High':['Insuff Car','No Car','Suff Car'],
//         'Preschool':['Insuff Car','No Car','Suff Car'],
//         'SHS With License':['Insuff Car','No Car','Suff Car'],
//         'SHS Without License':['Insuff Car','No Car','Suff Car'],
//     },
//     'Other': ['Insuff Car','No Car','Suff Car'],
//     'Otherpurpose':{
//         'Eat':['Insuff Car','No Car','Suff Car'],
//         'PB':['Insuff Car','No Car','Suff Car'],
//         'PUDO':['Insuff Car','No Car','Suff Car'],
//         'QS':['Insuff Car','No Car','Suff Car'],
//         'Rec':['Insuff Car','No Car','Suff Car'],
//         'Shop':['Insuff Car','No Car','Suff Car'],
//         'Soc':['Insuff Car','No Car','Suff Car'],
//         'test':{
//             'test1':['No Car'],
//             'test2':['Suff Car']
//         }
//     }
// };

let leftRecord = {
    levelOne:null,
    levelTwo:null,
    levelThree:null,
    levelFour:null,
    filePath:null

};


let rightRecord = {
    levelOne:null,
    levelTwo:null,
    levelThree:null,
    levelFour:null,
    filePath:null

};



function setHalfSelection(side,halfSideRecord){
    $('#'+side+'LevelOne').append("<select id = '"+side+"LevelOneSelection' class='form-control'></select>");
    $('#'+side+'LevelOneSelection').append('<option>Please Select</option>');
    for(let k in sliderType){
        $('#'+side+'LevelOneSelection').append('<option>'+k+'</option>')
    }

    $('#'+side+'LevelOneSelection').on('change',function(){
        halfSideRecord.levelOne = this.value;
        halfSideRecord.filePath = null;
        $('#'+side+'LevelTwo').empty();
        $('#'+side+'LevelThree').empty();
        $('#'+side+'LevelFour').empty();

        if(checkDepth(sliderType[halfSideRecord.levelOne])>1){
            $('#'+side+'LevelTwo').append("<select id = '"+side+"LevelTwoSelection' class='form-control'></select>");
            $('#'+side+'LevelTwoSelection').append('<option>Please Select</option>');
            for(let k in sliderType[halfSideRecord.levelOne]){
                $('#'+side+'LevelTwoSelection').append('<option>'+k+'</option>')
            }
            $('#'+side+'LevelTwoSelection').on('change',function(){
                halfSideRecord.levelTwo= this.value;
                halfSideRecord.filePath = null;
                $('#'+side+'LevelThree').empty();
                $('#'+side+'LevelFour').empty();
                if(checkDepth(sliderType[halfSideRecord.levelOne][halfSideRecord.levelTwo])>1){
                    $('#'+side+'LevelThree').append("<select id = '"+side+"LevelThreeSelection' class='form-control'></select>");
                    $('#'+side+'LevelThreeSelection').append('<option>Please Select</option>');
                    for(let k in sliderType[halfSideRecord.levelOne][halfSideRecord.levelTwo]){
                        $('#'+side+'LevelThreeSelection').append('<option>'+k+'</option>');
                    }
                    $('#'+side+'LevelThreeSelection').on('change',function(){
                        halfSideRecord.levelThree = this.value;
                        halfSideRecord.filePath = null;
                        $('#'+side+'LevelFour').empty();
                        if(checkDepth(sliderType[halfSideRecord.levelOne][halfSideRecord.levelTwo][halfSideRecord.levelThree])>1){
                            alert('The App could not handle so complex data structure!')
                        }
                        else{
                            $('#'+side+'LevelFour').append("<select id = '"+side+"LevelFourSelection' class='form-control'></select>");
                            $('#'+side+'LevelFourSelection').append('<option>Please Select</option>');
                            for(let k in sliderType[halfSideRecord.levelOne][halfSideRecord.levelTwo][halfSideRecord.levelThree]){
                                $('#'+side+'LevelFourSelection').append('<option>'+sliderType[halfSideRecord.levelOne][halfSideRecord.levelTwo][halfSideRecord.levelThree][k]+'</option>');
                            }
                            $('#'+side+'LevelFourSelection').on('change',function(){
                                halfSideRecord.levelFour = this.value;
                                halfSideRecord.filePath = null;
                                halfSideRecord.filePath ='./data/'+halfSideRecord.levelOne+'/'+halfSideRecord.levelTwo+'/'+halfSideRecord.levelThree+'/'+halfSideRecord.levelFour+'.csv';
                            })

                        }
                    })
                }
                else{
                    $('#'+side+'LevelThree').append("<select id = '"+side+"LevelThreeSelection' class='form-control'></select>");
                    $('#'+side+'LevelThreeSelection').append('<option>Please Select</option>');
                    for(let k in sliderType[halfSideRecord.levelOne][halfSideRecord.levelTwo]){
                        $('#'+side+'LevelThreeSelection').append('<option>'+sliderType[halfSideRecord.levelOne][halfSideRecord.levelTwo][k]+'</option>');
                    }
                    $('#'+side+'LevelThreeSelection').on('change',function(){
                        halfSideRecord.levelThree = this.value;
                        halfSideRecord.filePath = null;
                        halfSideRecord.filePath='./data/'+halfSideRecord.levelOne+'/'+halfSideRecord.levelTwo+'/'+halfSideRecord.levelThree+'.csv';
                    })
                }
            })
        }
        else{
            $('#'+side+'LevelTwo').append("<select id = '"+side+"LevelTwoSelection' class='form-control'></select>");
            $('#'+side+'LevelTwoSelection').append('<option>Please Select</option>');
            for(let k in sliderType[halfSideRecord.levelOne]){
                $('#'+side+'LevelTwoSelection').append('<option>'+sliderType[halfSideRecord.levelOne][k]+'</option>');
            }
            $('#'+side+'LevelTwoSelection').on('change',function(){
                halfSideRecord.levelTwo = this.value;
                halfSideRecord.filePath = null;
                halfSideRecord.filePath ='./data/'+halfSideRecord.levelOne+'/'+halfSideRecord.levelTwo+'.csv';
            })
        }
    });

}
setHalfSelection('left',leftRecord);
setHalfSelection('right',rightRecord);


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