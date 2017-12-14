'use strict';

app.relocaterView = kendo.observable({});
//app.settings.tempSettings;

//if (app.settings.tempSettings != undefined) {
//    var itemData = app.settings.tempSettings.itemArray;
//}
//else {
//    var itemData = [];

//}
//var locationToValue = app.settings.tempSettings.locationToValue;




     (function (parent) {

        function iqAuthLoginCallback(result) {
            $("#resultDivContainer").html(result.reason);
            // might execute ProcessItems once again
        }

        function bindListView(itemData) {
            $("#listView").kendoMobileListView({
                dataSource: itemData,
                template: kendo.template($("#listViewTemplate").html())
            }).delegate(".k-delete-button", "click", function (e) {
                var self = this;
                var index;
                $("#listView .k-delete-button").each(function (ind, element) {
                    index = element === self ? ind : index;
                });

                if (index || index === 0) {
                    var listView = $("#listView").data('kendoMobileListView');
                    listView.remove($(listView.element.children()[index]));
                    listView.remove(listView.element.children().first());
                    listView.remove(0);

                    listView.dataSource.data().splice(index, 1);
                    listView.refresh();
                    document.getElementById('lblMessage').textContent = "Item has been removed from the list.";
                    element.style.color = '#000000';
                    element.style.backgroundColor = '#fce9b2';
                    element.style.fontWeight = 'normal';
                    element.style.paddingLeft = '5px';
                }
            });
        }

 
        var relocaterModel = kendo.observable({
            newItem: {
                ItemNumber: '',
                Description: '',
                SerialNumber: ''

            },
            beforeShow: function (e) {
                console.log("beforeShow");
                if (app.settings.apprendaToken == null) {
                    app.iqAuth.loginTwo(iqAuthLoginCallback);
                }
                else {
                    $("#resultDivRelocater").html("Successfully logged in.");
                };
            },
            show: function (e) {
                bindListView();
            },
            addItem: function () {
                var listView = $("#listView").data("kendoMobileListView");
                var dataSource = listView.dataSource;
                var total = dataSource.data().length;
                //alert("total is " + total);
                dataSource.insert(0, { ItemNumber: this.newItem.ItemNumber, Description: this.newItem.Description, SerialNumber: this.newItem.SerialNumber });
                var itemData = dataSource;

                return;

                //if (total === 0) {
                //   listView.destroy();
                //   bindListView(); // kendo listView breaks and shows empty item
                //dataSource.add({ name: this.newItem.name });
                //    listview.refresh();
                // } else {
                //     dataSource.add({ ItemNumber: this.newItem.ItemNumber, Description: this.newItem.Description, SerialNumber: this.newItem.SerialNumber } );
                //     listView.refresh();
                // }
            },
            processBarcodeResult: function () {

                //alert(app.settings.apprendaToken);

                if (app.settings.apprendaToken == null) {
                    //alert("Trying to login");
                    app.iqAuth.loginTwo(iqAuthLoginCallback);
                } else {
                    //while (blnScanCycle) {
                    var fullUri = null;
                    //alert("BarcodeScanArray id is " + barcodeScanArray[barcodeScanArray.length-1])
                    if (barcodeScanArray[barcodeScanArray.length - 1] == null || barcodeScanArray[barcodeScanArray.length - 1].length == 0) {
                        alert("Id was not found");
                        return;
                    }
                    else {
                        //alert(barcodeScanArray[barcodeScanArray.length-1]);
                        fullUri = app.settings.urls.getById + barcodeScanArray[barcodeScanArray.length - 1];

                        //alert(fullUri);
                        console.log("auth token exists, trying inventory api for id " + barcodeScanArray[barcodeScanArray.length - 1]);
                        console.log("Processing ");


                        $.ajax({
                            url: fullUri,
                            contentType: 'application/json',
                            type: 'GET',
                            headers: {
                                'ApprendaSessionToken': app.settings.apprendaToken
                            },
                            success: function (s) {
                                console.log(s);
                                //alert("start success function");
                                if (s.poid == undefined) {
                                    alert("Id was not found");
                                    return;
                                }
                                else {
                                    //alert(s.poid);
                                    // format poid and poline for leading zero requirements
                                    //var paddedPoid = padNumber(s.poid, 4);
                                    //var paddedPoline = padNumber(s.poline, 4);
                                    //alert("setting value for itemnumber");
                                    relocaterModel.newItem.ItemNumber = s.item;
                                    relocaterModel.newItem.Description = s.itemdesc;
                                    relocaterModel.newItem.SerialNumber = s.serialnumber;
                                    //relocaterModel.set(newItem.itemNumber, s.item);
                                    //relocaterModel.set(newItem.Description, s.itemdesc);
                                    //relocaterModel.set(newItem.SerialNumber, s.SerialNumber);
                                    relocaterModel.addItem();

                                    //inventoryList.push("itemId", paddedPoid + "-" + paddedPoline, "itemnumber", s.item, "itemDescription", s.itemdesc, "inventoryid", s.inventoryid, "imageurl", s.imageurl);

                                    //relocaterModel.set("params.inventoryList", inventoryList.toString());

                                    //loopCounter = loopCounter + 1;
                                }
                            },
                            error: function (e) {
                                console.log(e);
                                $("#loginBtn").show();
                                //alert(JSON.stringify(e));
                            }
                        })
                    };

                    // need to remove the placeholders
                    //inventoryList.splice(0, 10);
                }
                //**}
            },
            scanClick: function (e) {
                $(".km-state-active").removeClass("km-state-active");
                if (window.navigator.simulator === undefined) {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            //var x = localStorage.getItem("barcodeScanArray")
                            //barcodeScanArray = x.split(',');
                            //alert(result.text);
                            //alert(result.text.length);
                            if (result.text.length > 0) {
                                barcodeScanArray.push(result.text)

                                //alert("Result is " + barcodeScanArray);

                                relocaterModel.processBarcodeResult();
                                app.mobileApp.navigate('components/relocater/relocater.html');
                                document.getElementById('lblMessage').textContent = "Item has been added to the list.";
                                var element = document.getElementById('lblMessage');
                                element.style.color = '#000000';
                                element.style.backgroundColor = '#fce9b2';
                                element.style.fontWeight = 'normal';
                                element.style.paddingLeft = '5px';
                                $("#relocater").show();
                                var retrievedData = localStorage.getItem("barcodeScanArray");
                                //alert(retrievedData)

                            }
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
                    var x = app.settings.tempSettings.barcodeScanId;
                    barcodeScanArray[barcodeScanArray.length] = x;
                    relocaterModel.processBarcodeResult(x);
                    app.mobileApp.navigate('components/relocater/relocater.html');
                    document.getElementById('lblMessage').textContent = "Item has been added to the list.";
                    var element = document.getElementById('lblMessage');
                    element.style.color = '#000000';
                    element.style.backgroundColor = '#fce9b2';
                    element.style.fontWeight = 'normal';
                    element.style.paddingLeft = '5px';

                    $("#relocater").show();
                    var retrievedData = localStorage.getItem("barcodeScanArray");
                    var pResult = document.getElementById('resultDivRelocater');
                    pResult.style.color = '#000000';
                    pResult.style.backgroundColor = '#fce9b2';
                    pResult.style.fontWeight = 'normal';
                    pResult.style.paddingLeft = '5px';
                    // for app
                    //alert("Application must be used on a mobile device with a camera.");
                }
            },
            processItems: function () {

                // we need to create the xml that will be used to process this load of data
                var lcRequest = "<request>" +
                                     "<option>1</option>" +
                                     "<updatehistory>0</updatehistory>" +
                                     "<inventories>";

                if (barcodeScanArray.length == 0) {
                    alert("There are no items to process!");
                    return;
                }

                for (var i = 0; i < barcodeScanArray.length; i++) {
                    lcRequest = lcRequest + "<inventory>";
                    lcRequest = lcRequest + "<inventoryid>" + barcodeScanArray[i] + "</inventoryid>";
                    lcRequest = lcRequest + "<location>" + $("input#locationTo").val() + "</location>";
                    lcRequest = lcRequest + "</inventory>";

                }

                lcRequest = lcRequest + "</inventories>";
                lcRequest = lcRequest + "</request>";
                //alert("xml file has been created");
                //alert(lcRequest);
                //alert(app.settings.apprendaToken);

                if (app.settings.apprendaToken != null) {
                    //alert(app.settings.urls.XMLchangeLocation4);

                    $.ajax({
                        url: app.settings.urls.XMLchangeLocation4,
                        contentType: 'text/xml',
                        type: "POST",
                        data: lcRequest,
                        dataType: "xml",
                        headers: {
                            "ApprendaSessionToken": app.settings.apprendaToken
                        },
                        success: processSuccessRelocate,
                        error: processErrorRelocate
                    });
                };

            },
            processLogin: function () {
                iqAuthLoginCallback(result);
            },
            clearClick: function (e) {
                barcodeScanArray = [];
                var locationToValue = "";
                bindListView([]);

                //alert("Scan Array is being cleared");
                localStorage.removeItem("barcodeScanArray");
                app.settings.tempSettings.barcodeClear = true;

                var retrievedData = localStorage.getItem("barcodeScanArray");
                if (retrievedData != null) {
                    barcodeScanArray = string.split(',');
                    alert("Retrieved Data is " + barcodeScanArray);
                }
                document.getElementById('ItemNumber').value = '';
                document.getElementById('Description').value = '';
                document.getElementById('SerialNumber').value = '';
                app.mobileApp.navigate('components/relocater/relocater.html');
                document.getElementById('lblMessage').textContent = "List has been cleared.";
                var element = document.getElementById('lblMessage');
                element.style.color = '#000000';
                element.style.backgroundColor = '#fce9b2';
                element.style.fontWeight = 'normal';
                element.style.paddingLeft = '5px';


                $("#relocater").show();
            },
            scanLocation: function() {

                $('#locationTo').select();
                setLocationTo();
            }

        });

        function processSuccessRelocate(data, status, req) {
            //alert('success');
            if (status == "success") {
                document.getElementById('lblMessage').textContent = "Items have been successfully transferred.";
                var element = document.getElementById('lblMessage');
                element.style.color = '#000000';
                element.style.backgroundColor = '#fce9b2';
                element.style.fontWeight = 'normal';
                element.style.paddingLeft = '5px';
                $("#relocater").show();
            }
            //$("#response").text($(req.responseXML).find("Result").text());
            //alert(req.responseXML);
        };
        
        function processErrorRelocate(data, status, req) {
            alert("process error");
            alert('err'+data.state);
            alert(req.responseXML + " " + status);
        };

        function setLocationTo() {
            // if there is no data entered into this field, implement the scanner
            if (window.navigator.simulator === undefined) {
                if (locationToValue.length >= 0 ) {
                    //alert('next step is to scan');
                    cordova.plugins.barcodeScanner.scan(
                                function (result) {
                                    //alert(result.text);
                                    //alert(result.text.length);
                                    if (result.text.length > 0) {
                                        //alert("setting the locationTo value");
                                        var lto = result.text;
                                        $('#locationTo').val(lto);
                                        locationToValue = lto;
                                    } else {
                                        locationToValue = document.getElementById('locationTo').value;
                                    }
                                });
                    return;
                };
            } else {
                // for testing in simulator
                $('#locationTo').val("DD");
            }
        };
            
            parent.set('relocaterModel', relocaterModel);


    })(app.relocaterView)

 


