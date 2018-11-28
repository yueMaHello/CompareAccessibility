/*store short name and full name in this dictionary
full name is used to display on the browser. Short name is used to figure out the csv file's full address
*/
var nameDictionary = {
    'Work':'Work',
    'Post Secondary Education':'PSE',
    'Other (All)':'Other',
    'Other (By Purpose)':'Otherpurpose',
    'High':'Hi',
    'Medium':'Med',
    'Low':'Lo',
    'Insufficient Car':'Ins',
    'Sufficient Car':'Suff',
    'Need Car At Work':'NCAW',
    'No Car': 'No',
    'Eat':"Eat",
    'PB':'PB',
    'PUDO':"PUDO",
    'QS':'QS',
    'Rec':'Rec',
    'Shop':'Shop',
    'Soc':'Soc',
};
//a selection object is used to store user's selection
var selection = {
    'Selecting':null,
    'Work':{
        'Income':null,
        'Car':null,
    },
    'Post Secondary Education':{
        'Car':null
    },
    'Other (All)':{
        'Car':null
    },
    'Other (By Purpose)':{
        'Purpose':null,
        'Car':null
    },
};

var leftselection =JSON.parse(JSON.stringify(selection));
var rightselection =JSON.parse(JSON.stringify(selection));
//Divs object stores the Div ids for UI elements
var leftDivs={
    'PurposeDiv':'leftPurpose',
    'DynamicDiv':'leftDynamic',
    'WorkIncomeDiv':'leftWorkIncome',
    'WorkCar':'leftWorkCar',
    'PSECar':'leftPSECar',
    'OtherAllCar':'leftOtherAllCar',
    'OtherPurpose':'leftOtherPurpose',
    'OtherCar':'leftOtherCar'
};
var rightDivs={
    'PurposeDiv':'rightPurpose',
    'DynamicDiv':'rightDynamic',
    'WorkIncomeDiv':'rightWorkIncome',
    'WorkCar':'rightWorkCar',
    'PSECar':'rightPSECar',
    'OtherAllCar':'rightOtherAllCar',
    'OtherPurpose':'rightOtherPurpose',
    'OtherCar':'rightOtherCar'
};
//When the user selects a travel purpose, the webpage will dynamically change the selection divs
generateHalfUI(leftselection, leftDivs);
generateHalfUI(rightselection, rightDivs);
function generateHalfUI(selectionObject, divObject){
    $('#'+divObject.PurposeDiv).on('change',function(){
        $('#'+divObject.DynamicDiv).empty();//empty the div
        selectionObject['Selecting'] = this.value;
        if(this.value === 'Work'){
            $('#'+divObject.DynamicDiv).append("<label for='"+divObject.WorkIncomeDiv+"'> Select Income Level:\n</label><select id = '"+divObject.WorkIncomeDiv+"' class='form-control'>" +
                "<option>Please Select</option>" +
                "<option>High</option>" +
                "<option>Medium</option>" +
                "<option>Low</option>" +
                "</select>");
            $('#'+divObject.DynamicDiv).append("<label for='"+divObject.WorkCar+"'> Select Auto Ownership:\n</label><select id = '"+divObject.WorkCar+"' class='form-control'>" +
                "<option>Please Select</option>" +
                "<option>Sufficient Car</option>" +
                "<option>Insufficient Car</option>" +
                "<option>No Car</option>" +
                "<option>Need Car At Work</option>" +
                "</select>");
            //add a listener on the new created DIVs. Record user's selections
            $('#'+divObject.WorkIncomeDiv).on('change',function(){
                selectionObject['Work']['Income'] = nameDictionary[this.value];
            });
            $('#'+divObject.WorkCar).on('change',function(){
                selectionObject['Work']['Car'] = nameDictionary[this.value];
            })

        }
        else if(this.value === "Post Secondary Education"){
            $('#'+divObject.DynamicDiv).append("<label for='"+divObject.PSECar+"'> Select Auto Ownership:\n</label><select id = '"+divObject.PSECar+"' class='form-control'>" +
                "<option>Please Select</option>" +
                "<option>Sufficient Car</option>" +
                "<option>Insufficient Car</option>" +
                "<option>No Car</option>" +
                "</select>");
            $('#'+divObject.PSECar).on('change',function(){
                selectionObject['Post Secondary Education']['Car'] = nameDictionary[this.value];
            })
        }
        else if(this.value ==='Other (All)'){
            $('#'+divObject.DynamicDiv).append("<label for='"+divObject.OtherAllCar+"'> Select Auto Ownership:\n</label><select id = '"+divObject.OtherAllCar+"' class='form-control'>" +
                "<option>Please Select</option>" +
                "<option>Sufficient Car</option>" +
                "<option>Insufficient Car</option>" +
                "<option>No Car</option>" +
                "</select>");
            $('#'+divObject.OtherAllCar).on('change',function(){
                selectionObject['Other (All)']['Car'] = nameDictionary[this.value];

            })
        }
        else if(this.value ==='Other (By Purpose)'){
            $('#'+divObject.DynamicDiv).append("<label for='"+divObject.OtherPurpose+"'> Select Purpose:\n</label><select id = '"+divObject.OtherPurpose+"' class='form-control'>" +
                "<option>Please Select</option>" +
                "<option>Eat</option>" +
                "<option>PB</option>" +
                "<option>PUDO</option>" +
                "<option>QS</option>" +
                "<option>Rec</option>" +
                "<option>Shop</option>" +
                "<option>Soc</option>" +
                "</select>");
            $('#'+divObject.DynamicDiv).append("<label for='"+divObject.OtherCar+"'> Select Auto Ownership:\n</label><select id = '"+divObject.OtherCar+"' class='form-control'>" +
                "<option>Please Select</option>" +
                "<option>Sufficient Car</option>" +
                "<option>Insufficient Car</option>" +
                "<option>No Car</option>" +
                "</select>");
            $('#'+divObject.OtherPurpose).on('change',function(){
                selectionObject['Other (By Purpose)']['Purpose'] = nameDictionary[this.value];

            });
            $('#'+divObject.OtherCar).on('change',function(){
                selectionObject['Other (By Purpose)']['Car'] = nameDictionary[this.value];

            })
        }
    });
}
//add clicking event to submit button
//the user will be asked to choose which view he wants
//if he choose accessibility, then the accessibilitymain.js will be called, and vice versa.
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
//get the csv file's name based on the user's selections
function checkAndReturnValue(s){
    if(s['Selecting'] === null || s['Selecting']==='Please Select'){

        alert('Please select a travel purpose');
        return;
    }
    for(var k in s[s['Selecting']]){
        if(s[s['Selecting']][k] === null||typeof(s[s['Selecting']][k]) === 'undefined'){
            alert('Please fill the selection');
            return;
        }
    }
    if(s['Selecting'] === 'Work'){
        return 'Logsum'+s['Work']['Income']+'_'+s['Work']['Car']+'.csv'
    }
    else if(s['Selecting'] === 'Post Secondary Education'){
        return 'Logsum'+s['Post Secondary Education']['Car']+'.csv'
    }
    else if(s['Selecting'] === 'Other (All)'){
        return 'Logsum'+s['Other (All)']['Car']+'.csv'
    }
    else if(s['Selecting'] === 'Other (By Purpose)'){
        return 'Logsum'+s['Other (By Purpose)']['Purpose']+'_'+s['Other (By Purpose)']['Car']+'.csv'
    }
}

