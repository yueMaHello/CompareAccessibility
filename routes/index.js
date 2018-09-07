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


router.get('/viewmap', function(req, res, next) {
    res.render('index', { title: "Compare Accessibility"});
});

router.get('/', function(req, res, next) {
    res.render('selection', { title: "Compare Accessibility"});
});



module.exports = router;
