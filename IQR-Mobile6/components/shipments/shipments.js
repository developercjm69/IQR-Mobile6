'use strict';
var barcodeScanArray = []; 
var shipmentsData;

app.shipmentsView = kendo.observable({});
(function (parent) {
    

    var shipmentsModel = kendo.observable({
        shippingItem: {
            poid: "",
            item: "",
            mfgr: "",
            condition: "",
            serial: "",
            weight: "",
            warehouse: "",
            location: "",
            country: ""
        },
        show: function (e) {
            bindListView();
            //alert(app.settings.apprendaToken);
        },
        beforeShow: function (e) {
            alert("getting json data");
        },

    });

    function bindListView(shipmentsData) {

        alert("retreiving data");
        shipmentsData = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "shipments.json",
                    dataType: "json"
                },
                schema: {
                    data: "shipment",
                    model: {
                        fields: {
                            scheduledDate: { type: "string" },
                            companyName: { type: "string" },
                            contactName: { type: "string" },
                            so: { type: "string" },
                            shipperName: { type: "string" },
                            serviceType: { type: "string"}
                        }
                    }
                }
            }
        });

        $("#pickingView").kendoMobileListView({
            dataSource: shipmentsData,
            template: kendo.template($("#pickingViewTemplate").html())
        });
    }


    parent.set('shipmentsModel', shipmentsModel);
 
 
})(app.shipmentsView)
