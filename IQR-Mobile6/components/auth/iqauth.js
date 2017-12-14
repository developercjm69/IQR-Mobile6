'use strict';

app.iqAuth = kendo.observable({
    loginTwo: function (callback) {
        var localSaved = window.localStorage.getItem("iqSettings");

        //alert(app.appSettingsView.appSettingsModel.params.iqUser);
        var dta = {
            "username": app.appSettingsView.appSettingsModel.params.iqUser,
            "Password": app.appSettingsView.appSettingsModel.params.iqPass,
            "tenantalias": app.appSettingsView.appSettingsModel.params.iqKey
        };

        //if (dta.username == "" || dta.Password == "") {

        //    alert("Please enter your login credentials.");
        //    dta = {
        //        "username": "cliff.mauer@iqreseller.com",
        //        "Password": "Rabbit2008",
        //        "tenantalias": "iqreseller"
        //    };
        //}

        $.ajax({

            url: app.settings.urls.loginTwo,
            contentType: 'application/json',
            data: JSON.stringify(dta),
            type: 'POST',
            async: false,
            success: function (s) {
                //alert("setting the access token");
                app.settings.apprendaToken = s.apprendaSessionToken;
                //alert(s.apprendaSessionToken);
                //alert("Successful Login");
                callback({ loggedIn: true, reason: "Successful Login." });
            },
            error: function (e) {
                //alert("Login Error");
                callback({ loggedIn: false, reason: "Login Error." });
            }
        });
    }
});
