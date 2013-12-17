"use strict";

theKlubApp.controller('HallController',
    function HallController($scope, layoutService){


        layoutService.titleBar.promoMsg = "Hall of Passions";
        layoutService.titleBar.promoImg = '/images/gentleman-club-concept-3.jpg';
        layoutService.titleBar.promoHref = '/';
        //layoutService.titleBar.logged = false;
        layoutService.titleBar.foregroundColor = 'sandybrown';//'#ffdd86';
        layoutService.titleBar.backgroundColor = '#070707';
        layoutService.titleBar.linkColor = 'sandybrown';
        layoutService.titleBar.subTitle = "Select genre and enjoy !";
        layoutService.bodyColor = 'tan';
        layoutService.selectedKlub = "hall";

        layoutService.btnBackgrounColor = "saddlebrown",
        layoutService.btnColor = "khaki";
        layoutService.btnBorder = "1px solid";
        layoutService.btnBorderColor = "khaki";


    }
);