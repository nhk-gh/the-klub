/**
 * Created with JetBrains WebStorm.
 * User: Naum
 * Date: 3/3/13
 * Time: 4:30 PM
 * To change this template use File | Settings | File Templates.
 */
var routes = require('../routes/routes');
var encrypt = require("../routes/lib/encrypt");
//var countries = require("../node_modules/country-selector/nodejs.countryList.js");
var countries = require("../node_modules/country-selector/nodejs.countryList.js");
var mailer = require("../node_modules/nodemailer/lib/nodemailer.js");
var async = require("async");
var fs = require("fs");

var cl = countries.countryList();

var photodb;

exports.countriesList = function(req,res){
    if(req.method.toLowerCase() == "get") {
        res.send({countries: cl});
    }
};

exports.editprofile = function(req,res){
    if(req.method.toLowerCase() == "get") {
//        res.send({countries: cl});
    }
    else {
        photodb = routes.getdb();

        var encryptPasswrd = encrypt.encrypt(req.body.oldpassword);
        var workingCollection;

        async.waterfall([
            //open authors collection
            function(callback){
                photodb.collection("authors", function(err, collection){
                    if (err){
                        console.log("Edit profile (1): " + err);
                        callback(new Error("Edit profile (1): " + err.message));
                    }
                    else {
                        workingCollection = collection;
                        callback(null);
                    }
                })
            },

            // update user data
            function(callback){
                workingCollection.update({username:req.session.user.username, password: encryptPasswrd},
                    {$set:{firstname:req.body.firstname, lastname: req.body.lastname,
                        password: encrypt.encrypt(req.body.newpassword),
                        country: req.body.country, email: req.body.email,
                        name: req.body.firstname + " " + req.body.lastname}},
                    {w:1},
                    function(err, result) {
                        if(err) {
                            console.log("Edit profile (5): " + err);
                            callback(new Error("Edit profile (5): " + err.message))
                        }
                        else{
                            //take the new document
                            workingCollection.findOne({name:req.body.firstname + " " + req.body.lastname},
                                function(err, result) {
                                    if(err){
                                        console.log("Edit profile (5a): " + err);
                                        callback(new Error("Edit profile (5a): " + err.message));
                                    }
                                    else if(result == null) {
                                        console.log('Edit profile (5b)');
                                        callback(new Error('Edit profile (5b)'));
                                    }
                                    else {
                                        callback(null, result);
                                    }
                                }
                            );
                            //callback(null, oldAuthor, result);
                        }
                    }
                );
            },

            // in case of author changed his/her name adjust photos collection documents (author field).
            function(newAuthor, callback){
                if (req.session.user.name != newAuthor.name){
                    photodb.collection("photos", function(err, collection){
                        if (err){
                            console.log("Edit profile (6): " + err);
                            callback(err);
                        }
                        else {
                            collection.update({author: req.session.user.name},{$set:{author: newAuthor.name}},
                                {w:1, multi:true},
                                function(err, result) {
                                    if(err) {
                                        console.log("Edit profile (7): " + err);
                                        callback(err)
                                    }
                                    else{
                                        callback(null, newAuthor);
                                    }
                                }
                            );

                        }
                    })
                }
                else
                    callback(null, newAuthor);
            }
        ],

        function(err, result){
            if (err){
                res.send({message:err.message, error: 403});        }
            else{
                req.session.user = result;
                res.send({message:'Ok', error: 200, user: result});
            }
        });
    }
};

exports.register = function(req, res) {

    if(req.method.toLowerCase() == "get") {
//        res.send({countries: cl});
    }
    else {
        photodb = routes.getdb();

        photodb.collection("authors", function(err, collection){
            if (err)
                console.log("Login: Can not open 'authors' collection!");
            else {
                collection.findOne({username:req.body.username}, function(err, result) {
                    if(err) console.log(err);

                    if(result != null) {
                        res.send({message:'name is already used', error: 403});
                    }
                    else {
                        //auth(result);
                        var usr = {
                            username: req.body.username,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            password: encrypt.encrypt(req.body.password),
                            name: req.body.firstname + " " + req.body.lastname,
                            logged: true,
                            country: req.body.country,
                            email: req.body.email,
                            qtty: 0
                        };
                        collection.insert(usr, {w:1}, function(err, result) {
                            //assert.equal(null, err);
                            req.session.user = result[0];
                            res.send({message:'Ok', error: 200, user: result});
                        });
                    }
                });
            }
        });
    }
};

exports.login = function(req, res) {

    if(req.method.toLowerCase() != "post") {
        res.render("login.jade", {title:"Log in"});
    }
    else {
        photodb = routes.getdb();
        photodb.collection("authors", function(err, collection){
            if (err)
                console.log("Login: Can not open 'authors' collection!");
            else {
                collection.findOne({username:req.body.username}, function(err, result) {
                    if(err) console.log(err);

                    if(result == null) {
                        res.send({message:'invalid username',
                                  error: 403});
                        //res.send(403,{'Content-type' : 'text/plain'},{ error: 'something blew up' });
                    }
                    else {
                        //auth(result);
                        var encryptPasswrd = encrypt.encrypt(req.body.password);
                        if(encryptPasswrd != result.password) {
                            res.send({message:'invalid password',
                                error: 403});
                        }
                        else {
                            collection.update({username:req.body.username, password: encryptPasswrd},
                                              {$set:{logged: true}}, {w:1}, function(err, rs){
                                    if (err)
                                        console.log(err);
                                    else{
                                        result.logged = true;
                                        req.session.user = result;
                                        res.send({message:'Ok', error: 200, user: result});
                                    }
                                });

                            //res.redirect("/");
                        }

                    }
                });
            };
        });
    }
};

exports.logout = function(req, res) {

    photodb = routes.getdb();

    photodb.collection("authors", function(err, collection){
        if (err)
            console.log("Login: Can not open 'authors' collection!");
        else {
            collection.findOne({username:req.body.username}, function(err, result) {
                if(err) console.log(err);

                if(result == null) {
                    res.send({message:'invalid username', error: 403});
                }
                else {
                    collection.update({username:req.body.username},{$set:{logged: false}}, {w:1},
                        function(err, rs){
                            if (err)
                                console.log(err);
                            else{
                                req.session.user = null;
                                res.send({message:'Ok', error: 200});
                            }

                        });
                }
            });
        };
    });
};

exports.passwordReminder = function(req, res){
    console.log("reminder");

    var searchStr = {};

    var searchStr = {};
    if (req.body.lookfor == "username"){
        searchStr = {username: req.body.name};
    }
    else{
        searchStr = {name: req.body.name};
    }
    searchStr.email = req.body.email;

    photodb = routes.getdb();

    photodb.collection("authors", function(err, collection){
        if (err)
            console.log("Reminder: Can not open 'authors' collection!");
        else {
            collection.findOne(searchStr, function(err, result) {
                if(err) console.log(err);

                if(result == null) {
                    res.send({message:'Sorry, but you really do not remember your registration data', error: 403});
                }
                else {
                    var transport = new mailer.createTransport("SMTP",
                        {service: "Gmail",
                            auth: {
                                user: "naum.krivoruk@gmail.com",
                                pass: "nhk110859"
                            }
                        }
                    );
                    var pswrd = encrypt.decrypt(result.password);

                    transport.sendMail(
                        {
                            from: "<naum.krivoruk@gmail.com>", // sender address
                            to: req.body.email, // list of receivers
                            subject: "Your password", // Subject line
                            text: "Your password is: " + pswrd // plaintext body
                        },
                        function(error, response){
                            if(error){
                                console.log(error);
                                res.send({message:error.message, error: 403});
                            }
                            else{
                                res.send({message:'Registration data sent to your e-mail address!', error: 200});
                            }
                        }
                    );


                }
            });
        }
    });
};