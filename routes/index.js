var express = require('express');
var router = express.Router();
var conString = "";
var obj = "1";
var fs = require('fs');


let sliderType = convertResult('./public/data')
console.log(sliderType)
function convertResult(tmpResult){
    let result = {};
    if(is_dir(tmpResult)){
        let children = walkfolders(tmpResult);
        if(is_dir(tmpResult+'/'+children[0])){

            for(let i=0;i<children.length;i++){
                result[children[i]] = convertResult(tmpResult+'/'+children[i])
            }
        }
        else{
            result = children
        }

    }
    else{
        result = tmpResult.split('/').pop()
    }

    return result
}

function walkfolders(dir) {

    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = filelist || [];
    files.forEach(function (file) {
        filelist.push(file.split('.csv')[0]);
    });
    return filelist;
}

function is_dir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

router.get('/viewLogsum', function(req, res, next) {
    res.render('indexLogsum', { title: "Compare Accessibility"});
});

router.get('/viewAccessibility', function(req, res, next) {
    res.render('indexAccessibility', { title: "Compare Accessibility"});
});


router.get('/', function(req, res, next) {
    res.render('selection', { title: "Compare Accessibility",sliderType:sliderType});
});



module.exports = router;
