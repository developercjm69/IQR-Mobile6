'use strict';

app.appSettingsView = kendo.observable({});

(function (parent) {
    var samplePrivateFunction = function () {
        console.log("I'm private");
    },
        appSettingsModel = kendo.observable({
            params: {
                ftpFolder: "",
                ftpUser: "",
                ftpPass: "",
                dropBoxApi: "enpq4o5era7m3fp",
                dropboxSecret: "9o3fvhjo1ee0ypd",
                iqUser: "cliff.mauer@iqreseller.com",
                iqPass: "Rabbit2008",
                iqKey: "iqreseller",
                iqAppKey: "testiqreseller",
                publicFolderUrl: "",
                fileNameItem: "0", 
                fileNameMD: "1", 
                fileSize: "0"
            },
            show: function (e) {
                console.log("appSettings show");
            },
            saveClick: function (e) {
                // save params to storage on phone
                console.log(appSettingsModel.params);
                appSettingsModel.params.dropboxSecret = document.getElementById('dropboxSecret').value;
                appSettingsModel.params.dropBoxApi = document.getElementById('dropBoxApi').value;
                appSettingsModel.params.iqUser = document.getElementById('iqUser').value;
                appSettingsModel.params.iqPass = document.getElementById('iqPass').value;
                appSettingsModel.params.iqKey = document.getElementById('iqKey').value;
                appSettingsModel.params.iqAppKey = document.getElementById('iqAppKey').value;

                window.localStorage.setItem("iqSettings", JSON.stringify(appSettingsModel.params));
                alert("Settings Saved");
            }
        });

    parent.set('appSettingsModel', appSettingsModel);

    // if settings have been persisted, we load them when this file loads

    var localSaved = window.localStorage.getItem("iqSettings");
    if (localSaved != null) {
        parent.appSettingsModel.params = JSON.parse(localSaved);
    }

})(app.appSettingsView);