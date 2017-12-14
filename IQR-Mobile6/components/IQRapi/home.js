'use strict';

app.homeView = kendo.observable({});
(function (parent) {
    var barcodeScanArray = [];
    var locationToValue = "";
    var photolist = [];

    var localSaved = window.localStorage.getItem("iqSettings");
    //alert(localSaved);

    var homeModel = kendo.observable({
        //app.settings.tempSettings;
        //alert(localSaved);

        show: function (e) {
            console.log("homeModel.show");
            console.log(window);
        },
        goPhoto: function (e) {
           if (window.navigator.simulator === undefined) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        app.settings.tempSettings.barcodeScanId = result.text;
                        app.mobileApp.navigate('components/photo/photo.html');
                    },
                    function (error) {
                        console.log(error);
                        alert(JSON.stringify(error));
                    },
                    { // barcode scanner parameters
                        "preferFrontCamera": false,
                        "showFlipCameraButton": false
                    }
                );
            } else {
                // for testing in simulator
                //app.settings.tempSettings.barcodeScanId = "18";
                app.mobileApp.navigate('components/photo/photo.html');

                // for app
                //alert("Application must be used on a mobile device with a camera.");
            }
        },
        gorelocater: function (e) {
            app.mobileApp.navigate('components/relocater/relocater.html');
        },
        goidentifier: function (e) {
            app.mobileApp.navigate('components/identifier/identifier.html');
        },
        goClearScanData: function (e) {

            barcodeScanArray = [];

            alert("Scan Array is being cleared");
            localStorage.removeItem("barcodeScanArray");
            app.settings.tempSettings.barcodeClear = true;

            var retrievedData = localStorage.getItem("barcodeScanArray");
            if (retrievedData != null) {
                barcodeScanArray = string.split(',');
                alert("Retrieved Data is " + barcodeScanArray);
            }

        },
        goLocationSettings: function (e) {
            app.mobileApp.navigate('components/location/location.html');
        },
        goAppSettings: function (e) {
            app.mobileApp.navigate('components/appsettings/index.html');
        },
        goMakeChanges: function (e) {
            console.log("goMakeChanges: not implemented");
        },
        goReserve: function (e) {
            console.log("goReserve: not implemented");
        }
    });

    parent.set('homeModel', homeModel);
})(app.homeView);
