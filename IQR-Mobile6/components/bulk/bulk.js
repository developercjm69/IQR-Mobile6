'use strict';

app.bulkView = kendo.observable({});
//app.settings.tempSettings;

function setGlobalLocationTo () {
    locationToValue = document.getElementById('locationTo').value;
    return;
}


(function (parent) {

    var bulkModel = kendo.observable({
        params: {
            locationTo: ""
        },

        init: function (e) {
            // make large image zoomable
            $("#zoomable").panzoom({
                minScale: 0.5,
                maxScale: 3
            });
        },
        beforeShow: function (e) {
            console.log("beforeShow");
            //bulkModel.set("params.locationTo", "");
            $("#bulk-info-div").show();
        },
        clearClick: function (input) {
            this.params.locationTo = "";
            document.getElementById('locationTo').value = '';
            $("#bulk-info-div").show();
        }

    });
    parent.set('bulkModel', bulkModel);
})(app.bulkView);
