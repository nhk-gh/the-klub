/**
 * Created with JetBrains WebStorm.
 * User: Naum
 * Date: 2/16/13
 * Time: 7:56 PM
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs");
var path = require("path");
var mongo = require("mongodb");
var async = require("async");
var klbLib = require('./lib/klbLib');

var im = require('imagemagick');
im.identify.path = '/usr/bin/identify';
im.convert.path = '/usr/bin/convert';

var ObjectID = mongo.ObjectID;
var db = mongo.Db;
var dbserver = mongo.Server;
var dbport = mongo.Connection.DEFAULT_PORT;

var photodb;
//var collectionType = "genres";// initial value; can be 'genres' or 'authors'
//var genreName; // genre name for 'genres' or author name for 'authors'
var count=3;

var populateCollection = function(collection_name, d) {
    var items;
    var toCreate = true;

    d.collection(collection_name, function(err, collection){
        collection.find().toArray(function(err, docs){
            if (docs.length == 0){
                switch (collection_name){
                    case "authors":
                        items = [
                            {
                                password: "46e0bfdedb9a7dc40bf6e756957650c6",     /*password*/
                                username: "nhk",
                                logged: false,
                                firstname: "Naum",
                                lastname: "Krivoruk",
                                name: "Naum Krivoruk",
                                country: "Israel",
                                email: "naum.krivoruk@gmail.com"
                            }
                        ];
                        break;

                    case "genres":
                        items = [
                            {name: "Birds", qtty: 0},
                            {name: "Funny", qtty: 0},
                            {name: "Family", qtty: 0},
                            {name: "People", qtty: 0},
                            {name: "Friends", qtty: 0},
                            {name: "Flowers", qtty: 0},
                            {name: "Art", qtty: 0},
                            {name: "Animals", qtty: 0},
                            {name: "Nature", qtty: 0},
                            {name: "Places", qtty: 0},
                            {name: "Plants", qtty: 0},
                            {name: "Trips", qtty: 0},
                            {name: "Misc", qtty: 0}
                        ];
                        break;

                    case "comments":
                        items = [
                            {
                                author: "nhk", // username
                                date: Date.now(),
                                photoid: "5166b0748b60c16016000001",
                                text:"Hi"
                            }
                        ];
                        break;

                    case "photos":
                        items = [
                            {
                                photoname: "Photographer",
                                addeddate:"17.2.2013",
                                author: "Naum Krivoruk",
                                username: "nhk",
                                link: "/images/IMG_2310.JPG",
                                ratingavr: 4.5,
                                ratingqtty: 5,
                                genres:[
                                    {name:"Funny"},
                                    {name:"Family"}
                                ]
                            },
                            {
                                photoname: "Devil's sunset",
                                addeddate:"17.2.2013",
                                author: "Naum Krivoruk",
                                link: "/images/P1012185.JPG",
                                ratingavr: 4.5,
                                ratingqtty: 5,
                                genres:[
                                    {name:"Funny"},
                                    {name:"Art"}
                                ]
                            }
                        ];
                        break;

                    default:
                        toCreate = false;
                        break;
                }
            }
            else{
                toCreate = false;
                count--;
            }

            if (toCreate === true)
                collection.save(items, {safe:true}, function() {
                    count--;
                });
            /*if (count == 0)
                photodb.close();*/
        });

    });
};

var initDB = function(){
    if (photodb === undefined){
        photodb = new db("photodb", new dbserver('localhost', dbport, {auto_reconnect: true,socketOptions: {keepAlive:null}}));

        photodb.open(function(err, d){
            if(!err) {
                console.log("Connected to 'photodb' database (localhost:" + dbport + ")");

                populateCollection("authors",d) ;
                populateCollection("genres",d);
                populateCollection("photos", d);
                populateCollection("comments", d);
            }
        });
    }
};
exports.initDB = initDB;

exports.getdb = function(){
    if (photodb === undefined)
        initDB();

    return photodb;
};

/////////////////////////////////////////////////////////

exports.index = function(req, res){
    //if (req.session.user == undefined)
        req.session.user = null;

    req.session.collectionType = 'genres';

    res.render('layout', {title:"The Klub°", loggedUser:req.session.user, returnTo:'1'});
};

exports.viewmode = function(req){
    // need for proper reaction on browser's refresh
    req.session.collectionType = req.query.mode;
};

exports.genre = function(req, res){
    if (req.query.gallery)
        req.session.gallery = req.query.gallery;   //stores genre.name for genres or author.name for authors
    else
        req.session.gallery = req.query.genre;

    req.session.collectionType = req.query.selectionMode; //by genres or by authors
    if (!req.session.genre || (req.session.genre !== req.query.genre)){
        req.session.genre = req.query.genre;

        req.session.pagenumber = 1; // show first page when new genre/author selected
    }
    if (req.session.user == undefined)
        req.session.user = null;

    res.render("thumbs", {title:req.session.gallery});
};

exports.thumbs = function(req,res){
    var colName = "photos";
    var pages; // total pages
    var query, options={};

    if (req.session.collectionType == "genres")
        query = {'genres.name':req.session.gallery};
    else
        query = {'author':req.session.gallery};

    if (req.query.pagenumber){
        // request by prev/next page
        options = {skip: 20*(req.query.pagenumber-1), limit:20, sort: {addeddate:-1}};
        req.session.pagenumber = req.query.pagenumber;
    }
    else{
        // request after refresh:
        options = {skip: 20*(req.session.pagenumber-1), limit:20, sort: {addeddate:-1}};
    }

    photodb.collection(colName, function(err, collection){
        if (err)
            console.log("Thumbs error (1): "+ err);
        else {
            collection.find(query).count(function(err, cnt){
                if (err)
                    console.log("Thumbs error (2): " + err);
                else{
                    pages = Math.ceil(cnt/20);
                    collection.find(query, options).toArray(function (err, items) {
                        if (err)
                            console.log("Thumbs error (3): " + err);
                        else{
                            //console.log(req.session.user);
                            items.forEach(function(itm){
                                itm.link2thumb = klbLib.klbThumbPath(itm.link);
                            })
                            res.send({thumbs:items, page: req.session.pagenumber, pages:pages, loggedUser:req.session.user});
                            //res.json({thumbs:items});
                        }
                    });
                }
            });
        }
    });
};

exports.thumbs1 = function(req, res){

  if (req.query.gallery)
        req.session.gallery = req.query.gallery;   //stores genre.name for genres or author.name for authors
    else
        req.session.gallery = req.query.genre;

    req.session.collectionType = req.query.selectionMode; //by genres or by authors
    if (!req.session.genre || (req.session.genre !== req.query.genre)){
        req.session.genre = req.query.genre;

        req.session.pagenumber = 1; // show first page when new genre/author selected
    }
    if (req.session.user == undefined)
        req.session.user = null;


    var colName = "photos";
    var pages; // total pages
    var query, options={};

    if (req.session.collectionType == "genres")
        query = {'genres.name':req.session.gallery};
    else
        query = {'author':req.session.gallery};

    if (req.query.pagenumber){
        // request by prev/next page
        options = {skip: 20*(req.query.pagenumber-1), limit:20, sort: {addeddate:-1}};
        req.session.pagenumber = req.query.pagenumber;
    }
    else{
        // request after refresh:
        options = {skip: 20*(req.session.pagenumber-1), limit:20, sort: {addeddate:-1}};
    }

    photodb.collection(colName, function(err, collection){
        if (err)
            console.log("Thumbs error (1): "+ err);
        else {
            collection.find(query).count(function(err, cnt){
                if (err)
                    console.log("Thumbs error (2): " + err);
                else{
                    pages = Math.ceil(cnt/20);
                    collection.find(query, options).toArray(function (err, items) {
                        if (err)
                            console.log("Thumbs error (3): " + err);
                        else{
                            //console.log(req.session.user);
                            items.forEach(function(itm){
                                itm.link2thumb = klbLib.klbThumbPath(itm.link);
                            });
                            res.send({gallery: req.session.gallery, thumbs:items, page: req.session.pagenumber, pages:pages, loggedUser:req.session.user});
                            //res.json({thumbs:items});
                        }
                    });
                }
            });
        }
    });
}

exports.sidebar = function(req,res){

    var sidemenu = {};
    sidemenu.viewMode = req.session.collectionType;

    async.series([
        // get total photo qtty
        function(callback){
            photodb.collection('photos', function(err, collection){
                if (err){
                    console.log("Side bar (0): " + err);
                    callback(err);
                }
                else {
                    collection.find().count(function(err, photoQtty){
                        if (err){
                            console.log("Side bar 0a): " + err);
                            callback(err);
                        }
                        else{
                            //totalPhotos = photoQtty;
                            callback(null, photoQtty);
                        }
                    });
                }
            });
        },

        // get total authors qtty
        function(callback){
            photodb.collection('authors', function(err, collection){
                if (err){
                    console.log("Side bar (0b): " + err);
                    callback(err);
                }
                else {
                    collection.find().count(function(err, authorsQtty){
                        if (err){
                            console.log("Side bar 0c): " + err);
                            callback(err);
                        }
                        else{
                            //totalAuthors = authorsQtty;
                            callback(null, authorsQtty);
                        }
                    });
                }
            });
        },

        // get list of all genres
        function(callback){
            photodb.collection("genres", function(err, collection){
                if (err){
                    console.log("Sidebar (1): " + err);
                    callback(err);
                }
                else{
                    collection.find({},{sort:'name'}).toArray(function(err, items){
                        if (err){
                            console.log("Error");
                            callback(err);
                        }
                        else{
                            sidemenu.genres = items;
                            callback(null);
                        }
                    });
                }
            })
        },

        // get number of photos per genre
        function(callback){
            photodb.collection("photos", function(err, collection){
                if (err){
                    console.log("Sidebar (2): " + err);
                    callback(err);
                }
                else{
                    async.eachSeries(sidemenu.genres,
                        function(item, icallback){
                            var cursor = collection.find({'genres.name':item.name}).count(function(err, count){
                                if(err){
                                    console.log("Sidebar (3): " + err);
                                    icallback(err);
                                }
                                else{
                                    item.qtty = count;
                                    icallback();
                                }
                            });
                        },

                        function(err){
                            if(err){
                                console.log("Sidebar (3a): " + err);
                                callback(err);
                            }
                            else
                                callback(null);
                        }
                    );
                }
            });
        },

        // get list of all authors
        function(callback){
            photodb.collection("authors", function(err, collection){
                if (err){
                    console.log("Sidebar (4): " + err);
                    callback(err);
                }
                else{
                    collection.find({},{sort:'name'}).toArray(function(err, items){
                        if (err){
                            console.log("Sidebar (5): " + err);
                            callback(err);
                        }
                        else{
                            sidemenu.authors = items;
                            callback(null);
                        }
                    });
                }
            })
        },

        // get number of photos per author
        function(callback){
            photodb.collection("photos", function(err, collection){
                if (err){
                    console.log("Sidebar (6): " + err);
                    callback(err);
                }
                else{
                    async.eachSeries(sidemenu.authors,
                        function(item, icallback){
                            var cursor = collection.find({'author':item.name}).count(function(err, count){
                                if(err){
                                    console.log("Sidebar (7): " + err);
                                    icallback(err);
                                }
                                else{
                                    item.qtty = count;
                                    icallback();
                                }
                            });
                        },

                        function(err){
                            if(err){
                                console.log("Sidebar (7a): " + err);
                                callback(err);
                            }
                            else
                                callback(null);
                        }
                    );
                }
            });
        }
    ],

    function(err, results){
        if (err == null)
            res.send({sidemenu:sidemenu, allPhotos: results[0], allAuthors: results[1]});
    });
};

exports.randomPhoto = function(req, res){
    var query, options={};
    var triad = [];

    if (req.session.collectionType == "genres")
        query = {'genres.name':req.session.gallery};
    else
        query = {'author':req.session.gallery};

    photodb.collection("photos", function(err, collection){
        if (err){
            console.log("Random photo (1): " + err);
            callback(err);
        }
        else {
            collection.find().count(function(err, qtty){
                if (err){
                    console.log("Random photo (2): " + err);
                } else {
                    options = {skip: Math.floor(Math.random()*qtty), limit:1};

                    collection.find({}, options).toArray(function (err, items) {
                        if (err){
                            console.log("Random photo (3): " + err);
                            callback(err);
                        }
                        else{
                            if (items.length <= 0){
                                console.log("Random photo (4): documents not found");
                                res.send({photo:items[0]});
                            }
                            else{
                                res.send({photo:items[0]});
                            }
                        }
                    });
                }
            });
        }
    });
};

exports.singlephoto = function(req, res){
    var colName = "photos"; // req.query.selectionMode;
    var query, options={};
    var triad = [];

    if (req.session.collectionType == "genres")
        query = {'genres.name':req.session.gallery};
    else
        query = {'author':req.session.gallery};

    options = {sort:{addeddate: -1}};

    async.parallel([
        function(callback){
            photodb.collection(colName, function(err, collection){
                if (err){
                    console.log(req.query.viewphoto + "photo (1): " + err);
                    callback(err);
                }
                else {
                    collection.find(query, options).toArray(function (err, items) {
                        if (err){
                            console.log(req.query.viewphoto + "photo (2): " + err);
                            callback(err);
                        }
                        else{
                            if (items.length <= 0){
                                console.log(req.query.viewphoto + "photo (3): documents not found");
                                //triad[0] = triad[1] = triad[2] = null;
                                callback(new Error(req.query.viewphoto + "photo (3): documents not found"));
                            }
                            else{
                                var ind = -1;

                                for (var i=0; i<items.length; i++){
                                    if (items[i]._id.id === new ObjectID(req.query.id).id){
                                        ind = i;
                                        break;
                                    }
                                }

                                if (ind == -1){
                                    console.log(req.query.viewphoto + "photo (4): photo not found");
                                    callback(new Error(req.query.viewphoto + "photo (4): photo not found"));
                                }
                                else{
                                    if (items[ind-1] === undefined){
                                        triad[0] = items[ind];//({_id:0, link: "empty"});
                                    }
                                    else{
                                        triad[0] = items[ind-1];
                                    }

                                    triad[1] = items[ind];

                                    if (items[ind+1] === undefined){
                                        triad[2]=items[ind];//({_id:0, link: "empty"}
                                    }
                                    else{
                                        triad[2] = items[ind+1];
                                    }

                                    callback(null, req.query.viewphoto.toLowerCase());
                                }
                            }
                        }
                    });
                }
            });
        },

        function(callback){
            photodb.collection("comments", function(err, c){
                if (err){
                    console.log(req.query.viewphoto + "photo (5): " + err);
                    callback(err);
                }
                else {
                    c.find({'photoid': req.query.id}, {sort:{date: -1}}).toArray(function (err, items) {
                        if (err){
                            console.log(req.query.viewphoto + "photo (6): " + err);
                            callback(err);
                        }
                        else{
                            var comments= [];
                            if (items.length <= 0){
                                /*comments.push({
                                    author: null,
                                    date: null,
                                    photoid: null,
                                    text:""
                                });*/
                            }
                            else{
                                comments = items.slice();
                            }
                            callback(null, comments);
                        }
                    });
                }
            });
        }
    ],
    // optional callback
    function(err, results){
        // the results array will equal ['one','two'] even though
        // the second function had a shorter timeout.
        if (err){
          $log.warn(err);
            //res.render('singlephoto', {title: "", triad: triad, comments:results[1], loggedUser:req.session.user});
        }
        else{
            switch (results[0]){
                case 'prev':
                    res.json({newPhoto:triad[2], comments:results[1]});
                    break;
                case 'next':
                    res.send({newPhoto:triad[0], comments:results[1]});
                    break;
                default:
                    res.render('singlephoto', {title: triad[1].link, triad: triad, comments:results[1], loggedUser:req.session.user});
                    break;
            }
        }
    });
};

exports.singlePhoto1 = function(req, res){
    var colName = "photos"; // req.query.selectionMode;
    var query, options={};
    var phID, curPhoto, totalPhotos;

    if (req.session.collectionType == "genres")
        query = {'genres.name':req.session.gallery };
    else
        query = {'author':req.session.gallery};

    options = {sort:{addeddate: -1}};

    async.series([
        function(callback){
            photodb.collection(colName, function(err, collection){
                if (err){
                    console.log(req.query.viewphoto + "photo (1): " + err);
                    callback(err);
                }
                else {
                    /*
                    collection.findOne({_id : new ObjectID(req.query.id)}, function (err, item) {
                        if (err){
                            console.log(req.query.viewphoto + "photo (2): " + err);
                            callback(err);
                        }
                        else{
                            if (!item){
                                console.log(req.query.viewphoto + "photo (3): documents not found");
                                //triad[0] = triad[1] = triad[2] = null;
                                callback(new Error(req.query.viewphoto + "photo (3): documents not found"));
                            }
                            else{
                                var triad = item;
                                callback(null, item);
                            }
                        }
                    });
                    */
                    collection.find(query, options).toArray(function (err, items) {
                        if (err){
                            console.log(req.query.viewphoto + "photo (2): " + err);
                            callback(err);
                        }
                        else{
                            if (items.length <= 0){
                                console.log(req.query.viewphoto + "photo (3): documents not found");
                                //triad[0] = triad[1] = triad[2] = null;
                                callback(new Error(req.query.viewphoto + "photo (3): documents not found"));
                            }
                            else{
                                var ind = -1;
                                var triad = [];

                                switch (req.query.id)
                                {
                                  case '-1':  //first photo
                                    ind = 0;
                                    break;

                                  case '-999': // last photo
                                    ind = items.length-1;
                                    break;

                                  default:
                                    for (var i=0; i<items.length; i++){
                                        if (items[i]._id.id === new ObjectID(req.query.id).id){
                                            ind = i;
                                            break;
                                        }
                                    }
                                    break;
                                }

                                if (ind == -1){
                                    console.log(req.query.viewphoto + "photo (4): photo not found");
                                    callback(new Error(req.query.viewphoto + "photo (4): photo not found"));
                                }
                                else{
                                    if (items[ind-1] === undefined){
                                        triad[0] = null;//items[ind];//({_id:0, link: "empty"});
                                    }
                                    else{
                                        triad[0] = items[ind-1];
                                    }

                                    triad[1] = items[ind];
                                    phID = items[ind]._id;
                                    curPhoto = ind + 1;
                                    totalPhotos = items.length;

                                    if (items[ind+1] === undefined){
                                        triad[2] = null;//items[ind];//({_id:0, link: "empty"}
                                    }
                                    else{
                                        triad[2] = items[ind+1];
                                    }

                                    callback(null, triad);
                                }
                            }
                        }
                    });
                }
            });
        },

        function(callback){
            photodb.collection("comments", function(err, c){
                if (err){
                    console.log(req.query.viewphoto + "photo (5): " + err);
                    callback(err);
                }
                else {
                    //c.find({'photoid': req.query.id}, {sort:{date: -1}}).toArray(function (err, items) {
                    c.find({'photoid': phID.toString()}, {sort:{date: -1}}).toArray(function (err, items) {
                        if (err){
                            console.log(req.query.viewphoto + "photo (6): " + err);
                            callback(err);
                        }
                        else{
                            var comments= [];
                            if (items.length <= 0){
                                /*comments.push({
                                 author: null,
                                 date: null,
                                 photoid: null,
                                 text:""
                                 });*/
                            }
                            else{
                                comments = items.slice();
                            }
                            callback(null, comments);
                        }
                    });
                }
            });
        },

        // remove temporary img
        function(callback){
            if (req.session.tempImg !== undefined){
                fs.unlink(req.session.tempImg, function(err) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    }
                    else{
                        callback(null, true);
                    }
                });
            }
            else{
                callback(null, true);
            }
        }
    ],
    // optional callback
    function(err, results){
        // the results array will equal ['one','two'] even though
        // the second function had a shorter timeout.
        if (err){
            //res.render('singlephoto', {title: "", triad: triad, comments:results[1], loggedUser:req.session.user});
        }
        else{
            //create viewport img
            var target_dir = '/home/ubuntu/klub-imgs';//'./public/images/photo_heap';
            var target_path = target_dir + "/" + results[0][1].link;
            var target_path_small = klbLib.klb650x480Path(target_path);

            im.convert([target_path, '-resize', '650x480', target_path_small],
                function(err){
                    if (!err){
                        results[0][1].link = path.basename(target_path_small);
                        req.session.tempImg =  target_path_small;
                    }
                    //console.log(results[0]);
                    res.send({photos: results[0], comments:results[1], loggedUser:req.session.user,
                              current:curPhoto, total:totalPhotos});
                });
        }
    });
};

exports.addComment = function(req, res){
    photodb.collection("comments", function(err, collection){
        if (err){
            console.log("Add comment (1): " + err);
        }
        else{
            async.series([
                function(callback){
                    collection.insert(
                        {
                            author: req.query.user, // username
                            date: new Date(),
                            photoid: req.query.photoid,
                            text: req.query.comment
                        },
                        {w:1},
                        function (err) {
                            if (err){
                                console.log("Add comment (2): " + err);
                                callback(err);
                            }
                            else
                                callback(null);
                        }
                    );
                },

                function(callback){
                    collection.find({'photoid': req.query.photoid}, {sort:{date: -1}}).toArray(function (err, items) {
                        if (err){
                            console.log("Add comment (3): " + err);
                            callback(err);
                        }
                        else{
                            var comments= [];
                            if (items.length > 0){
                                comments = items.slice();
                            }
                            callback(null, comments);
                        }
                    });
                }
            ],

            function(err, results){
                res.send(results);
            });
        }
    });
};

exports.deletePhoto = function(req, res){
    var target_dir;// = './public/images/'+ req.session.user.username;
    var target_path;// = target_dir + "/" + req.files.photo.name;
    var target_path_small;
    var qtty;

    async.parallel(
    [
        function(callback){
            photodb.collection('photos', function(err, collection){
                if (err){
                    console.log("Delete photo (1): " + err);
                    callback(err);
                }
                else {
                    // check the photo exists in the DB
                    collection.findOne({_id: new ObjectID(req.query.id)}, function (err, ph) {
                        if (err){
                            console.log("Delete photo (1a): " + err);
                            callback(err);
                        }
                        else if (!ph){
                            console.log("Delete photo (1b): photo not found in the collection");
                            callback(err);
                        }
                        else{
                            target_dir = '/home/ubuntu/klub-imgs';//'./public/images/'+ req.session.user.username;
                            target_path = target_dir + "/" + ph.photoname;
                            target_path_small = klbLib.klbThumbPath(target_path);
                            //target_path_650x480 = klbLib.klb650x480Path(target_path);

                            //delete photo from disk
                            fs.unlink(target_path, function(err) {
                                if (err) {
                                    console.log(err);
                                    callback(err);
                                }
                                else{
                                    // delete thumb from disk
                                    fs.unlink(target_path_small, function(err) {
                                        if (err) {
                                            console.log(err);
                                            callback(err);
                                        }
                                        else{
                                            // delete photo from DB
                                            collection.remove({_id: new ObjectID(req.query.id)}, {w:1}, function (err, numDocs) {
                                                if (err){
                                                    console.log("Delete photo (2): " + err);
                                                    callback(err);
                                                }
                                                else{
                                                    if (numDocs != 1){
                                                        console.log("Delete photo (3): "  + numDocs + " documents found");
                                                        callback(new Error("Delete photo (3): documents not found"));
                                                    }
                                                    else{
                                                        collection.find().count(function(err, photoQtty){
                                                            if (err){
                                                                console.log("Thumbs error (1a): " + err);
                                                                callback(err);
                                                            }
                                                            else{
                                                                qtty = photoQtty;
                                                                callback();
                                                            }
                                                        })

                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        },

        function(callback){
            // delete comments
            photodb.collection("comments", function(err, c){
                if (err){
                    console.log("Delete photo (4): " + err);
                    callback(err);
                }
                else {
                    c.remove({'photoid': req.query.id}, {w:1}, function (err, numComments) {
                        if (err){
                            console.log("Delete photo (5): " + err);
                            callback(err);
                        }
                        else{
                            callback(null, numComments);
                        }
                    });
                }
            });
        }
    ],

    function(err, results){
        console.log(err);
        console.log(results);

        if (err != null)
            res.json({error:'Fail', qtty: qtty});
        else
            res.send({error: 'Ok', qtty: qtty});
    });
};