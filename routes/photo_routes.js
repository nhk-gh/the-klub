/**
 * Created with JetBrains WebStorm.
 * User: Naum
 * Date: 3/30/13
 * Time: 2:26 PM
 * To change this template use File | Settings | File Templates.
 */

var fs = require("fs");
var async = require("async");
var routes = require('../routes/routes');
var photodb = routes.getdb();
var ObjectID = require('mongodb').ObjectID;
var klbLib = require('./lib/klbLib');
var im = require('imagemagick');

im.identify.path = '/usr/bin/identify';
im.convert.path = '/usr/bin/convert';

exports.addPhoto = function(req, res){
    photodb.collection('genres', function(err, collection){
        if (err)
            console.log('Add photo: can not open \'genres\' collection');
        else{
            collection.find({}, {sort: "name"}).toArray(function(err, items){
                var info;
                var arrGenre = [];

                switch(req.method.toLowerCase()){
                    case "get":
                        info = "Select (up to ten photos allowed)";
                        //res.render("addphoto", {title:"Add photo", genre: items, loggedUser: req.session.user, info:info});
                        res.send({genre: items, loggedUser: req.session.user, info:info});
                        break;

                    case "post":
                        if (typeof(req.files.photo) === 'object') {
                            var arrPhotos = [];

                            // fill photo array
                            if (klbLib.klbIsArray(req.files.photo)){
                                arrPhotos = req.files.photo.filter(function(ph){
                                    if (req.body[ph.name] !== undefined)  // it's hidden object that stores tags
                                        return ph;
                                });
                            }
                            else{
                                arrPhotos.push(req.files.photo);
                            }

                            async.each(arrPhotos, function(photo, eachIteratorCallback){
                                // for each photo selected for upload
                                var tmp_path = photo.path; //the temporary location of the photo
                                var target_dir = '/home/ubuntu/klub-imgs';//'./public/images/photo_heap';
                                var target_path = target_dir + "/" + photo.name;
                                var target_path_small = klbLib.klbThumbPath(target_path);
                                //var link_path = '/images/photo_heap/' + photo.name;
                                var link_path = photo.name;
                                var p = photo;

                                async.series([
                                    //check if photo already exists
                                    function(callback){
                                        photodb.collection("photos", function(err, collection){
                                            if (err)
                                            {
                                                console.log("Add photo (1) "+ err);
                                                callback(err);
                                            }
                                            else{
                                                var usr = req.session.user;
                                                //var gns = [];

                                                collection.findOne({link: link_path, author:req.session.user.name},
                                                    function(err, result){
                                                        if(result != null) {
                                                            console.log('Photo already exists');
                                                            callback(new Error("Photo '" + p.name + "' already exists"));
                                                        }
                                                        else
                                                            callback(null);
                                                    }
                                                );
                                            }
                                        });
                                    },

                                    //check for target folder and create it if not exists
                                    function (callback) {
                                        fs.stat(target_dir, function (err, stat) {
                                            if (err || !stat.isDirectory()) {
                                                //folder do not exists, create it
                                                fs.mkdir(target_dir, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        callback(err);
                                                    }
                                                    else
                                                        callback(null);
                                                });
                                            }
                                            else
                                                callback(null);
                                        });
                                    },

                                    // folder exists (or created successfully):
                                    // move the photo from the temporary location to the intended location
                                    function(callback){
                                        fs.rename(tmp_path, target_path, function(err) {
                                            if (err) {
                                                console.log(err);
                                                callback(err);
                                            }
                                            else
                                                callback(null);
                                        });
                                    },

                                    //create small img
                                    function(callback){
                                        im.convert([target_path, '-resize', '120x120', target_path_small],
                                            function(err){
                                                callback(err);
                                            });
                                    },

                                    //add data about photo to DB
                                    function(callback){
                                        photodb.collection("photos", function(err, collection){
                                            if (err)
                                            {
                                                console.log("Add photo: can not open 'genres' collection");
                                                callback(err);
                                            }
                                            else{
                                                var usr = req.session.user;
                                                var gns = [];

                                                //console.log(klbIsArray(req.body.genres));
                                                /*
                                                if (klbLib.klbIsArray(req.body.genres)){
                                                    req.body.genres.forEach(function(g){
                                                        gns.push({name:g});
                                                    });
                                                }
                                                else{
                                                    gns.push({name:req.body.genres});
                                                }
                                                */
                                                if (req.body[p.name].trim() != ""){
                                                    var temp = req.body[p.name].split(',');
                                                    for(var k=0; k < temp.length; k++){
                                                        gns.push({name:temp[k]});
                                                    }
                                                }
                                                var short = req.body['short-'+ p.name];
                                                //var name =req.body.shortname == "" ? req.files.photo.name : req.body.shortname;
                                                collection.insert(
                                                    {
                                                        photoname: short,//req.body.shortname == "" ? p.name : req.body.shortname,
                                                        addeddate: Date.now(),
                                                        author:  usr.name,   //usr.username,//
                                                        link: link_path,
                                                        ratingavr: 0,
                                                        ratingqtty: 0,
                                                        genres: gns
                                                    },
                                                    {w:1},
                                                    function (err, inserted) {
                                                        callback(err);
                                                });
                                            }
                                        });
                                    }
                                ],

                                function(err){
                                    /*
                                    if (!err){
                                        info ="Done! You may continue to add photos:";
                                    }
                                    else{
                                        info = err;
                                        console.log(info);
                                    }
                                    res.render("addphoto", {title:"Add photo", genre: items, loggedUser: req.session.user, info:info});
                                    */
                                    if (!err){
                                        eachIteratorCallback();
                                    }
                                    else{
                                        info = err;
                                        console.log(err);
                                        eachIteratorCallback(err);

                                    }
                                })
                            },
                            //error function (the third param.) of async.each
                            function(err){
                                if (!err){
                                    info ="Done! You may continue to add photos:";
                                }
                                else{
                                    info = err.message;
                                    console.log(err);
                                }
                                //res.render("addphoto", {title:"Add photo", genre: items, loggedUser: req.session.user, info:info});
                                res.send({title:"Add photo", genre: items, loggedUser: req.session.user, info:info});
                            });
                        }

                        break;
                }
            });
        }
    });
};

exports.editPhoto = function(req, res){
    photodb.collection("genres", function(err, collection){
        if (err)
            console.log("Edit photo (1): can not open 'genres' collection");
        else{
            collection.find({}, {sort: "name"}).toArray(function(err, items){
                var info;
                var arrGenre = [];

                switch(req.method.toLowerCase()){
                    case "get":
                        photodb.collection("photos", function(err, phCollection){
                            if (err){
                                console.log("Edit photo (2): " + err);
                            }
                            else{
                                // check if photo exists...
                                phCollection.findOne({_id: new ObjectID(req.query.editphotoid)}, function(err, result){
                                    if (err){
                                        console.log("Edit photo (3): " + err);
                                    }
                                    else if(result == null){
                                        console.log("Edit photo (4): photo not found");
                                    }
                                    else{
                                        result.link2thumb = klbLib.klbThumbPath(result.link);
                                        info = "Edit photo";
                                        req.session.return = req.query.return;
                                        req.session.idd = req.query.editphotoid;
                                        //res.render("editphoto", {title:"Edit photo", genre: items, loggedUser: req.session.user, info:info, photo:result});
                                        res.send( {genre: items, info:info, photo:result});
                                    }
                                });
                            }
                        });

                        break;

                    case "post":
                        async.series([
                            function(callback){
                                // update data about photo
                                photodb.collection("photos", function(err, collection){
                                    if (err)
                                    {
                                        console.log("Edit photo (5): can not open 'photo' collection");
                                        callback(err);
                                    }
                                    else{
                                        var usr = req.session.user;
                                        var gns = [];

                                        //console.log(klbIsArray(req.body.genres));
                                        /*
                                        if (klbLib.klbIsArray(req.body.genres)){
                                            req.body.genres.forEach(function(g){
                                                gns.push({name:g});
                                                console.log(g);
                                            });
                                        }
                                        else{
                                            gns.push({name:req.body.genres});
                                        }
                                        */
                                        if (req.body.genres != ""){
                                            var temp = req.body.genres.split(',');
                                            for(var k=0; k < temp.length; k++){
                                                gns.push({name:temp[k]});
                                            }
                                        }
                                        collection.update({_id: new ObjectID(req.body.updateid)}, {$set:
                                            {
                                                photoname: req.body.shortname == "" ? req.files.photo.name : req.body.shortname,
                                                genres: gns
                                            }},
                                            {w:1},
                                            function (err, updated) {
                                                if (err){
                                                    console.log("Edit photo (6): " + err);
                                                    callback(err);
                                                }
                                                else if(updated != 1){
                                                    console.log("Edit photo (7): failed to update");
                                                    callback(new Error("Edit photo (7): failed to update"));
                                                }
                                                else{
                                                    callback(null);
                                                 }
                                            });
                                    }
                                });
                            }
                        ],

                        function(err, results){
                            if (!err){
                                info ="";//"Updated! You may continue to view photos:";
                            }
                            else{
                                info = "Update failed!";
                                console.log(info);
                            }
                            /*res.render("editphoto", {title:"Edit photo", genre: items,
                                loggedUser: req.session.user, info:info, photo:results.result});*/
                            var rend = req.session.return+"&id="+req.session.idd;
                            //res.redirect(rend);
                            res.send( {info:info});
                        });
                }
            });
        }
    });
};

exports.newGenre = function(req, res){
    photodb.collection("genres", function(err, collection){
        if (err)
            console.log("New genre: can not open 'genres' collection");
        else{
            collection.findOne({name: req.query.genre}, function(err, result){
                if (err)
                    console.log("New genre: " + err);
                else if (result == null)
                    // genre do not exist and can be added
                    collection.insert({name:req.query.genre, qtty:0}, {w:1}, function(err){
                        if (err)
                            res.send({error:403});
                        else
                            res.send({error:200});
                    });
            });
        }
    });
};