'use strict';

app.locationView = kendo.observable({});

(function (parent) {

    function iqAuthLoginCallback(result) {
        $("#resultDivContainer").html(result.reason);
        // might execute ProcessItems once again
    }


    var locationModel = kendo.observable({
        params: {
            locationTo: "",
            locationFrom: ""
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
            locationModel.set("params.location", "");
            if (app.settings.apprendaToken == null) {
              app.iqAuth.loginTwo(iqAuthLoginCallback);
             };
            $("#location-info-div").show();
        },
        processItems: function () {
            //alert("Processing Items!");
            //alert(app.settings.urls.changeLocation4);
            //if (app.settings.apprendaToken == null) {
            //    app.iqAuth.loginTwo(iqAuthLoginCallback);
            //};
            //alert(app.settings.apprendaToken);
            if (this.params.locationFrom.length == 0 || this.params.locationFrom.length == 0) {
                alert("You must enter a From location and a To Location");
                return;
            }



            var resultDiv = $("#resultDivContainer");
            var dta = "<request>" +
	                        "<option>4</option>" +
	                        "<oldlocation>"+this.params.locationFrom+"</oldlocation>" +
	                        "<newlocation>"+this.params.locationTo+"</newlocation>" +
	                        "<updatehistory>0</updatehistory>" +
                            "</request>";

            if (app.settings.apprendaToken != null) {

                $.ajax({
                    url: app.settings.urls.XMLchangeLocation4,
                    contentType: 'text/xml',
                    type: "POST",
                    data: dta,
                    dataType: "xml",
                    headers: {
                        "ApprendaSessionToken": app.settings.apprendaToken
                    },
                    success: processSuccessLocation,
                    error: processErrorLocation
                });
            };
        },
        clearLocationClick: function (input) {
            this.params.locationFrom = "";
            this.params.locationTo = "";
            $("input#locationTo").val("");
            $("input#locationFrom").val("");
            document.getElementById('lblMessageLocation').textContent = "Text fields have been clear.";
            var element = document.getElementById('lblMessageLocation');
            element.style.color = '#00FF00';
            element.style.fontWeight = "bold";

            //document.getElementById('locationTo').value = '';
            //document.getElementById('locationFrom').value = '';
            $("#location-info-div").show();
        }


    });


    parent.set('locationModel', locationModel);
})(app.locationView)

function processSuccessLocation (data, status, req) { 
    //alert('success');
    if (status == "success")
        document.getElementById('lblMessageLocation').textContent = "Items have been successfully transferred.";
        var element = document.getElementById('lblMessageLocation');
        element.style.color = '#800080';
        element.style.fontWeight = "bold";

    $("#location-info-div").show();
        //$("#response").text($(req.responseXML).find("Result").text());
        //alert(req.responseXML);
}

function processErrorLocation (data, status, req) {
    //alert('err'+data.state);
    alert(req.responseXML + " " + status);
}


