'use strict';

app.identifierView = kendo.observable({});
(function (parent) {
    var barcodeScanArray = [];
    var blnScanCycle = false;

    function padNumber(num, length) {
            var resultString = '' + num;
            while (resultString.length < length) {
                resultString = '0' + resultString;
            }

            return resultString;
    }
   
    var identifierModel = kendo.observable({
        invitem: {
            inventoryid: "",
            poid: "",
            item: "",
            mfgr: "",
            condition: "",
            serial: "",
            weight: "",
            warehouse: "",
            location: "",
            country: "",
            userdefined1: "",
            userdefined2: "",
            userdefined3: "",
            userdefined4: "",
            userdefined5: ""
        },
        curItem: {
            itemid: "",
            itemnumber: "",
            mfgr: "",
            mfgrid: "",
            warehouse: "",
            location1: "",
            location2: "",
            weight: "",
            countrycode: ""
        },
        show: function (e) {
            //bindListView();
            //identifierModel.invitem.item

            if (identifierModel.invitem.item != undefined) {
            //if ($("#item").val() != undefined) {
                var strSearch = identifierModel.invitem.item;
                //var strSearch = $("#item").val();
                //var fullUri = app.settings.urls.GetItemsByItemNumber + strSearch.substring(0,strSearch.length);
                //var fullUri = app.settings.urls.GetItemsByItemNumber;
                //var fullUri = app.settings.urls.getItems;
            }

            $('#autocomplete').autocomplete({
                headers: { 'ApprendaSessionToken': app.settings.apprendaToken },
                serviceUrl: app.settings.urls.GetItemsByItemNumber,
                paramName: 'ItemNumber',
                dataType: 'json',
                maxHeight: '100',
                transformResult: function (response, originalQuery) {
                    return {
                        suggestions: $.map(response, function (dataItem) {
                            return { value: dataItem.itemnumber, data: dataItem };
                        })
                    };
                },
                onSelect: function (suggestion) {
                    identifierModel.curItem.itemid = suggestion.data.itemid;
                    identifierModel.curItem.itemnumber = suggestion.data.itemnumber;
                    //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
                }
            });

            $('#condition').change(function () {
                var x = $("#condition").val();
                UpdateConditionCodeByInventoryId(identifierModel.invitem.inventoryid, x);
            });

            $('#weight').change(function () {
                var x = $("#weight").val();
                UpdateWeightByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            $('#warehouse').change(function () {
                var x = $("#warehouse").val();
                UpdateWarehouseByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            $('#location').change(function () {
                var x = $("#location").val();
                UpdateLocationByInventoryId(identifierModel.invitem.inventoryid, x);
            });

            $('#country').change(function () {
                var x = $("#country").val();
                UpdateCountryCodeByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            $('#serial').change(function () {
                var x = $("#serial").val();
                UpdateSerialnumberByInventoryId(identifierModel.invitem.inventoryid, x);
            });

            $('#mfgr').change(function () {
                UpdateInventoryByItemnumberAndMfgr(identifierModel.invitem.inventoryid, identifierModel.invitem.itemnumber,identifierModel.mfgr);
            });

            $('#userdefined1').change(function () {
                var x = $("#userdefined1").val()
                UpdateUserdefined1ByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            $('#userdefined2').change(function () {
                var x = $("#userdefined2").val()
                UpdateUserdefined2ByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            $('#userdefined3').change(function () {
                var x = $("#userdefined3").val()
                UpdateUserdefined3ByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            $('#userdefined4').change(function () {
                var x = $("#userdefined4").val()
                UpdateUserdefined4ByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            $('#userdefined5').change(function () {
                var x = $("#userdefined5").val()
                UpdateUserdefined5ByInventoryId(app.settings.tempSettings.inventoryid, x);
            });

            //$('#autocomplete').autocomplete({
            //    headers: { 'ApprendaSessionToken': app.settings.apprendaToken },
            //    serviceUrl: fullUri,
            //    onSelect: function (suggestion) {
            //        alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
            //    }
            //});

                
            //$.ajax({
            //    url: fullUri,
            //    contentType: 'application/json',
            //    type: 'GET',
            //    headers: { 'ApprendaSessionToken': app.settings.apprendaToken },
            //    success: function (items) {
            //        var data = items.map(function (item) {
            //            return {
            //                id: item.itemid,
            //                text: item.itemnumber
            //            };
            //        })
            //        $('#item').select2({
            //            data: data
            //            //, minimumInputLength: 3
            //        });

            //        $('#item').data('select2').$container.addClass('k-dropdown');
            //    }
            //})
      

            //$('#item').select2({
            //    ajax: {
            //        url: fullUri,
            //        headers: { 'ApprendaSessionToken': app.settings.apprendaToken },
            //        type: 'GET',
            //        dataType: 'json',
            //        delay: 300,
            //        data: function (parms) {
            //            return {
            //                q: params.term,
            //            };
            //        },
            //        processResults: function (data) {
            //            alert("processing data.items");
            //            return {
            //                results: $.map(data, function (item, index) {
            //                    return {
            //                        'id': item.itemid,
            //                        'text': item.itemnumber
            //                    };
            //                })
            //            };
            //        },
            //        cache: true,
            //   }
            //});
        },
                   
                //}
            //})
            //$.getJSON(fullUri, function (items) {
            //    var data = items.map(function (item) {
            //        return {
            //            id: item.id,
           //             text: item.itemNumber
            //        };
            //    })

            //    $('#item').select2({
            //        data: data  //, theme: "classic"
             //   });


            //    $('#item').data('select2').$container.addClass('k-dropdown');
            //});
        //},
        beforeShow: function (e) {
            if (app.settings.apprendaToken == null) {
                //alert("Trying to login");
                app.iqAuth.loginTwo(iqAuthLoginCallback);
            }
            else {
                $("#resultDivRelocater").html("Successfully logged in.");
            };

            //$(".km-state-active").removeClass("km-state-active");

            //this.scanClick();
        },
        masterClick: function () {

            //alert("masterClick");
        },
        processBarcodeResult: function (e) {

            //alert("starting the process barcode result");

            //alert(app.settings.apprendaToken);

            if (app.settings.apprendaToken == null) {
                alert("Trying to login");
                var result = app.iqAuth.loginTwo(iqAuthLoginCallback);
            } else {
                    var fullUri = null;
                    //alert("BarcodeScanArray id is " + barcodeScanArray[barcodeScanArray.length - 1])
                    if (barcodeScanArray[barcodeScanArray.length - 1] == null || barcodeScanArray[barcodeScanArray.length - 1].length == 0) {
                        alert("Id was not found");
                        return;
                    }
                    else {
                        //alert(barcodeScanArray[barcodeScanArray.length - 1]);
                        fullUri = app.settings.urls.getById + barcodeScanArray[barcodeScanArray.length - 1];

                        //alert(fullUri);
                        console.log("auth token exists, trying inventory api for id " + barcodeScanArray[barcodeScanArray.length - 1]);
                        console.log("Processing ");


                        $.ajax({
                            url: fullUri,
                            contentType: 'application/json',
                            type: 'GET',
                            async: false,
                            headers: {
                                'ApprendaSessionToken': app.settings.apprendaToken
                            },
                            success: function (s) {
                                console.log(s);
                                //alert("start success function");
                                //alert(s.poid);
                                if (s.poid == undefined) {
                                    //alert("Id was not found");
                                    return;
                                }
                                else {
                                    ////alert(s.poid);
                                    // format poid and poline for leading zero requirements
                                    identifierModel.set("invitem.inventoryid", s.inventoryid);
                                    identifierModel.set("curItem.inventoryid", s.inventoryid);
                                    app.settings.tempSettings.inventoryid = s.inventoryid;
                                    app.settings.tempSettings.itemid = s.itemid;

                                    var paddedPoid = padNumber(s.poid, 4);
                                    var paddedPoline = padNumber(s.poline, 4);
                                    ////alert("setting value for itemnumber");
                                    identifierModel.set("invitem.poid", paddedPoid + "-" + paddedPoline);
                                    $("#poid").val(identifierModel.invitem.poid);

                                    identifierModel.set("invitem.item", s.item);
                                    app.settings.tempSettings.item = s.item;
                                    $("#autocomplete").val(identifierModel.invitem.item);

                                    identifierModel.set("invitem.mfgr", s.mfgr);
                                    $("#mfgr").val(identifierModel.invitem.mfgr);

                                    identifierModel.set("invitem.serial", s.serialnumber);
                                    $("#serial").val(identifierModel.invitem.serial);

                                    identifierModel.set("invitem.condition", s.condition);
                                    $("#condition").val(identifierModel.invitem.condition);

                                    identifierModel.set("invitem.weight", s.weight);
                                    $("#weight").val(identifierModel.invitem.weight);
                                    app.settings.tempSettings.weight = s.weight;

                                    identifierModel.set("invitem.warehouse", s.warehouse);
                                    $("#warehouse").val(identifierModel.invitem.warehouse);

                                    identifierModel.set("invitem.location", s.location);
                                    $("#location").val(identifierModel.invitem.location);

                                    identifierModel.set("invitem.country", s.country);
                                    $("#country").val(identifierModel.invitem.country);

                                    identifierModel.set("invitem.userdefined1", s.userdefined1);
                                    $("#userdefined1").val(identifierModel.invitem.userdefined1);

                                    identifierModel.set("invitem.userdefined2", s.userdefined2);
                                    $("#userdefined2").val(identifierModel.invitem.userdefined2);

                                    identifierModel.set("invitem.userdefined3", s.userdefined3);
                                    $("#userdefined3").val(identifierModel.invitem.userdefined3);

                                    identifierModel.set("invitem.userdefined4", s.userdefined4);
                                    $("#userdefined4").val(identifierModel.invitem.userdefined4);

                                    identifierModel.set("invitem.userdefined5", s.userdefined5);
                                    $("#userdefined5").val(identifierModel.invitem.userdefined5);

                                }
                            },
                            error: function (e) {
                                console.log(e);
                                //$("#loginBtn").show();
                                //alert(JSON.stringify(e));
                            }
                        })
                    };

                    //alert("end of process barcode");
                    // need to remove the placeholders
                    //inventoryList.splice(0, 10);
                    //}
            }
        },
        scanClick: function (e) {
            $(".km-state-active").removeClass("km-state-active");
            if (window.navigator.simulator === undefined) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (app.settings.apprendaToken == null) {
                            app.iqAuth.loginTwo(iqAuthLoginCallback);
                        }
                        barcodeScanArray = [];
                        //alert("barcode array is " + barcodeScanArray);
                        //alert(result.text);
                        if (result.text.length > 0) {
                            barcodeScanArray.push(result.text);
                            //alert(barcodeScanArray[0]);
                        }
                        //alert("processing barcode");
                        try
                        {
                            alert("using try loop");
                            identifierModel.processBarcodeResult();
                        }
                        catch (e)
                        {
                            //alert(JSON.stringify(error));
                        }
                    }
                    );
             }
            else {
                // for testing in simulator
                var x = app.settings.tempSettings.barcodeScanId;
                barcodeScanArray[barcodeScanArray.length] = x;
                if (app.settings.apprendaToken == null) {
                    ////alert("Trying to login");
                    app.iqAuth.loginTwo(iqAuthLoginCallback);
                    this.processBarcodeResult();
                } else {
                    this.processBarcodeResult();
                }
            }
        },
        pictureClick: function () {

            //alert("pictureClick");
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
        scanSerialClick: function () {
            $(".km-state-active").removeClass("km-state-active");
            if (window.navigator.simulator === undefined) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (app.settings.apprendaToken == null) {
                            app.iqAuth.loginTwo(iqAuthLoginCallback);
                        }
                        //alert(result.text);
                        //alert("processing serial number");
                        try {
                            //alert("using try loop");
                            // update the serial number field
                            $("#serial").val(result.text);
                            UpdateSerialnumberByInventoryId(identifierModel.invitem.inventoryid, result.txt);
                        }
                        catch (e) {
                            alert(JSON.stringify(error));
                        }
                    }
                    )
            } else {
                $("#serial").val(app.settings.tempSettings.serialNumber);
                UpdateSerialnumberByInventoryId(identifierModel.invitem.inventoryid, app.settings.tempSettings.serialNumber);
            }
        },
        saveClick: function () {

            // look up the chosen item in the master item table to retrieve the itemid.
            if (identifierModel.curItem.itemid.length == 0) {
                var fullUri = app.settings.urls.GetItemByItemId + app.settings.tempSettings.itemid;
            }
            else
            {
                var fullUri = app.settings.urls.GetItemByItemId + identifierModel.curItem.itemid;
            }

            var blnOKtoSave = false;
            var pitemnumber = "";
            var pmfgrid = 0;
            var pitemid = 0;
            var pconditioncode = "";
            var pserialnumber = "";
            var pweight = 0;
            var pwarehouse = "";
            var plocation = "";
            var pcountrycode = "";
            var puserdefined1 = "";
            var puserdefined2 = "";
            var puserdefined3 = "";
            var puserdefined4 = "";
            var puserdefined5 = "";
            var SaveSuccess = false;

            //alert(fullUri);
            console.log("auth token exists, trying item api for id " + app.settings.tempSettings.itemid);
            console.log("Processing ");


            $.ajax({
                url: fullUri,
                contentType: 'application/json',
                type: 'GET',
                async: false,
                headers: {
                    "ApprendaSessionToken": app.settings.apprendaToken
                },
                success: function (s) {
                    console.log(s);
                    //alert("start success function");
                    if (s.itemid == undefined) {
                        alert("Item was not found");
                        return;
                    }
                    else {
                        // set the flag that says it is ok to save the data dnd then update the variables for saving
                        blnOKtoSave = true;
                        var pinventoryid = app.settings.tempSettings.inventoryid;
                        pitemid = identifierModel.curItem.itemid;
                        //pitemid = app.settings.tempSettings.itemid;
                        pitemnumber = $("#autocomplete").val();
                        var pmfgr = identifierModel.invitem.mfgr;
                        var pmfgrid = identifierModel.invitem.mfgrid;
                        var pconditioncode = identifierModel.invitem.condition;
                        var pserialnumber = identifierModel.invitem.serialNumber;
                        var pweight = identifierModel.invitem.weight;
                        var pwarehouse = identifierModel.invitem.warehouse;
                        var plocation = identifierModel.invitem.location;
                        var pcountrycode = identifierModel.invitem.pcountrycode;
                        var puserdefined1 = identifierModel.invitem.userdefined1;
                        var puserdefined2 = identifierModel.invitem.userdefined2;
                        var puserdefined3 = identifierModel.invitem.userdefined3;
                        var puserdefined4 = identifierModel.invitem.userdefined4;
                        var puserdefined5 = identifierModel.invitem.userdefined5;


                    }
                },
                error: function (e) {
                    console.log(e);
                    //$("#loginBtn").show();
                    //alert(JSON.stringify(e));
                }
            });

            // Replace the itemid in the inventory record that we are trying to save
            // using an api call
            // update the inventory record with the itemid from the chosen item

            if (blnOKtoSave) {
                UpdateInventoryByItemnumberAndMfgr(identifierModel.invitem.inventoryid,  pitemnumber , identifierModel.invitem.mfgr);
            }
            else
            {
                alert("Inventory record cannot be saved.");
            }
            ////var SaveSuccess = SaveInventoryByInventoryID(identifierModel.pitemid, 
            //                                                 identifierModel.pitemnumber, 
            //                                                 identifierModel.pmfgr, 
            //                                                 identifierModel.pmfgrid, 
            //                                                 identifierModel.pconditioncode,
            //                                                 identifierModel.pserialnumber, 
            //                                                 identifierModel.pweight, 
            //                                                 identifierModel.pwarehouse, 
            //                                                 identifierModel.plocation, 
            //                                                 identifierModel.pcountrycode,
            //                                                 identifierModel.userdefined1,
            //                                                 identifierModel.userdefined2,
            //                                                 identifierModel.userdefined3,
            //                                                 identifierModel.userdefined4,
            //                                                 identifierModel.userdefined5);

            if (app.settings.tempsettings.SaveSuccess != undefined) {
                if (app.settings.tempsettings.SaveSuccess = true) {
                    alert("Inventory record has been saved.");
                }
                else {
                    alert("Inventory record has not been saved.");
                }
            }
            else {
                alert("Inventory record has not been saved.");
            }


            
        }
    });

    parent.set('identifierModel', identifierModel);
 
 
})(app.identifierView)

