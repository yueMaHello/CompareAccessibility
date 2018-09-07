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
var leftselection = {
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
var rightselection = {
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


$('#leftPurpose').on('change',function(){
    $('#leftDynamic').empty();
    leftselection['Selecting'] = this.value;
    if(this.value === 'Work'){

        $('#leftDynamic').append("<label for='leftWorkIncome'> Select Income Level:\n</label><select id = 'leftWorkIncome' class='form-control'>" +
            "<option>Please Select</option>" +

            "<option>High</option>" +
            "<option>Medium</option>" +
            "<option>Low</option>" +
            "</select>");
        $('#leftDynamic').append("<label for='leftWorkCar'> Select Auto Ownership:\n</label><select id = 'leftWorkCar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "<option>Need Car At Work</option>" +
            "</select>");


        $('#leftWorkIncome').on('change',function(){
            leftselection['Work']['Income'] = nameDictionary[this.value];

        });
        $('#leftWorkCar').on('change',function(){
            leftselection['Work']['Car'] = nameDictionary[this.value];

        })

    }
    else if(this.value === "Post Secondary Education"){

        $('#leftDynamic').append("<label for='leftPSECar'> Select Auto Ownership:\n</label><select id = 'leftPSECar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "</select>");
        $('#leftPSECar').on('change',function(){
            leftselection['Post Secondary Education']['Car'] = nameDictionary[this.value];

        })
    }
    else if(this.value ==='Other (All)'){
        $('#leftDynamic').append("<label for='leftOtherAllCar'> Select Auto Ownership:\n</label><select id = 'leftOtherAllCar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "</select>");
        $('#leftOtherAllCar').on('change',function(){
            leftselection['Other (All)']['Car'] = nameDictionary[this.value];

        })

    }
    else if(this.value ==='Other (By Purpose)'){
        $('#leftDynamic').append("<label for='leftOtherPurpose'> Select Purpose:\n</label><select id = 'leftOtherPurpose' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Eat</option>" +
            "<option>PB</option>" +
            "<option>PUDO</option>" +
            "<option>QS</option>" +

            "<option>Rec</option>" +

            "<option>Shop</option>" +
            "<option>Soc</option>" +


            "</select>");
        $('#leftDynamic').append("<label for='leftOtherCar'> Select Auto Ownership:\n</label><select id = 'leftOtherCar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "</select>");
        $('#leftOtherPurpose').on('change',function(){
            leftselection['Other (By Purpose)']['Purpose'] = nameDictionary[this.value];

        })
        $('#leftOtherCar').on('change',function(){
            leftselection['Other (By Purpose)']['Car'] = nameDictionary[this.value];

        })

    }

});


$('#rightPurpose').on('change',function(){
    $('#rightDynamic').empty();
    rightselection['Selecting'] = this.value;

    if(this.value === 'Work'){

        $('#rightDynamic').append("<label for='rightWorkIncome'> Select Income Level:\n</label><select id = 'rightWorkIncome' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>High</option>" +
            "<option>Medium</option>" +
            "<option>Low</option>" +
            "</select>");



        $('#rightDynamic').append("<label for='rightWorkCar'> Select Auto Ownership:\n</label><select id = 'rightWorkCar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "<option>Need Car At Work</option>" +
            "</select>");
        $('#rightWorkIncome').on('change',function(){
            rightselection['Work']['Income'] = nameDictionary[this.value];

        });
        $('#rightWorkCar').on('change',function(){
            rightselection['Work']['Car'] = nameDictionary[this.value];

        })
    }
    else if(this.value === "Post Secondary Education"){

        $('#rightDynamic').append("<label for='rightPSECar'> Select Auto Ownership:\n</label><select id = 'rightPSECar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "</select>");
        $('#rightPSECar').on('change',function(){
            rightselection['Post Secondary Education']['Car'] = nameDictionary[this.value];

        })
    }
    else if(this.value ==='Other (All)'){
        $('#rightDynamic').append("<label for='rightOtherAllCar'> Select Auto Ownership:\n</label><select id = 'rightOtherAllCar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "</select>");
        $('#rightOtherAllCar').on('change',function(){
            rightselection['Other (All)']['Car'] = nameDictionary[this.value];

        })

    }
    else if(this.value ==='Other (By Purpose)'){
        $('#rightDynamic').append("<label for='rightOtherPurpose'> Select Purpose:\n</label><select id = 'rightOtherPurpose' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Eat</option>" +
            "<option>PB</option>" +
            "<option>PUDO</option>" +
            "<option>QS</option>" +

            "<option>Rec</option>" +

            "<option>Shop</option>" +
            "<option>Soc</option>" +


            "</select>");
        $('#rightDynamic').append("<label for='rightOtherCar'> Select Auto Ownership:\n</label><select id = 'rightOtherCar' class='form-control'>" +
            "<option>Please Select</option>" +
            "<option>Sufficient Car</option>" +
            "<option>Insufficient Car</option>" +
            "<option>No Car</option>" +
            "</select>");
        $('#rightOtherPurpose').on('change',function(){
            rightselection['Other (By Purpose)']['Purpose'] = nameDictionary[this.value];

        })
        $('#rightOtherCar').on('change',function(){
            rightselection['Other (By Purpose)']['Car'] = nameDictionary[this.value];

        })

    }

});
$('#SubmitButton').on('click',function(){
    var leftCSV = checkAndReturnValue(leftselection);
    var rightCSV=checkAndReturnValue(rightselection);
    if(typeof(leftCSV)!=='undefined'&&typeof(rightCSV)!=='undefined'){
        window.location.href = '/viewmap?#'+nameDictionary[leftselection['Selecting']]+'&'+leftCSV+'#'+nameDictionary[rightselection['Selecting']]+'&'+rightCSV;

    }


});
function checkAndReturnValue(s){
    console.log(s)
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

