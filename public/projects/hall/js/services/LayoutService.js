"use strict";

theKlubApp.factory('layoutService', function(){
    return {
        /* default values */
        titleBar:{
            promoMsg: 'Hall of Passions',
            promoImg: '/images/gentleman-club-concept-3.jpg',
            promoHref: '/',
            logged: false,
            foregroundColor: '#ffdd86',
            backgroundColor: '#070707',
            linkColor: 'sandybrown',
            subTitle: "Select your passion"
        },
        bodyColor: 'tan',
        selectedKlub: "hall",

        btnBackgrounColor: "saddlebrown",
        btnColor: "khaki",//"#6a4229",
        btnBorder: "1px solid",
        btnBorderColor: "khaki"
    }
});