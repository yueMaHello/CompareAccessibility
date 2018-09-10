var express = require('express');
var router = express.Router();
var conString = "";
var obj = "1";
var fs = require('fs');

function walkfolders(dir) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = [];
    files.forEach(function(file) {
            filelist.push(file);
    });
    return filelist;
}
var csvFileList = walkfolders('./public/data');


router.get('/viewLogsum', function(req, res, next) {
    res.render('indexLogsum', { title: "Compare Accessibility"});
});

router.get('/viewAccessibility', function(req, res, next) {
    res.render('indexAccessibility', { title: "Compare Accessibility"});
});


router.get('/', function(req, res, next) {
    res.render('selection', { title: "Compare Accessibility"});
});



module.exports = router;
