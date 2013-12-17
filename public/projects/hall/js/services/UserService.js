"use strict";

theKlubApp.factory("userService", function(){
    return {
        user:{
            password: "",
            username: "",
            logged: false,
            firstname: "",
            lastname: "",
            name: "",
            country: "",
            email: "",
            notify: false
        },

        newUser:{
            password: "",
            username: "",
            logged: false,
            firstname: "",
            lastname: "",
            name: "",
            country: "",
            email: "",
            notify: false
        },

        clear: function(whom){
            switch (whom) {
                case "current":
                    this.user.password= "";
                    this.user.username= "";
                    this.user.logged= false;
                    this.user.firstname= "";
                    this.user.lastname= "";
                    this.user.name= "";
                    this.user.country= "";
                    this.user.email= "";
                    this.user.notify= false;
                    break;

                case "new":
                    this.newUser.password= "";
                    this.newUser.username= "";
                    this.newUser.logged= false;
                    this.newUser.firstname= "";
                    this.newUser.lastname= "";
                    this.newUser.name= "";
                    this.newUser.country= "";
                    this.newUser.email= "";
                    this.newUser.notify= false;
                    break;
            }
        }
    };
});

