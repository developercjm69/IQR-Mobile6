'use strict';

//** URLS
//** Inventory Table
//**    UpdateItemnumberAndMfgrById where id will be the invetnory id
var localSaved = window.localStorage.getItem("iqSettings");
//alert(localSaved);

if (localSaved != null) {
    var params = JSON.parse(localSaved);
    var applicationKey = params.iqAppKey;
}
else {

    var applicationKey = "";
    //alert("app key is null");
    //alert(applicationKey);
}

app.settings = {
    urls: {
        login: "https://apps.login.iqreseller.com/api/services/json/r/authentication(v1)/CitadelService/IJSONAuthenticationService/Login/",
        getById: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/JSON/GetInventoryById?Id=",
        xmlgetById: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/XML/GetInventoryById?Id=",
        jsonchangeLocation4: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/JSON/RelocateInventories/",
        XMLchangeLocation4: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/XML/RelocateInventories/",
        updateImageUrlById: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/JSON/UpdateInventoryImageUrlById",
        loginTwo: "https://apps.login.iqreseller.com/authentication/api/v1/sessions/" + applicationKey + "/",
        getItems: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/MI/XML/GetItems",
        GetItemsByItemNumber: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/MI/JSON/GetItemsByItemNumber",
        GetItemByItemId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/MI/JSON/GetItemByItemId?ItemId=",
        UpdateItemnumberAndMfgrById: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/ChangeItemNumberMFGR/XML",
        UpdateConditionCodeByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/ChangeConditionCode/XML",
        UpdateWeightByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventory/XML/UpdateInventoryWeightById",
        UpdateLocationByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateWarehouseByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateCountryCodeByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateUserdefined1ByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateUserdefined2ByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateUserdefined3ByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateUserdefined4ByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateUserdefined5ByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",
        UpdateSerialnumberByInventoryId: "https://apps.login.iqreseller.com/api/services/json/r/" + applicationKey + "/WebAPI/IWebAPI/Inventories/Update/XML",

    },
    tempSettings: {
        barcodeScanId: "1957", // test setting, always works 
        barcodeArray: "",
        barcodeClear: false,
        itemArray: [],
        locationToValue: "",
        serialNumber: "00067",
        SaveSucess : false

    },
    userToken: null,
    apprendaToken: null,
    userName: "",

    //** The photolist should be stored in here until the user wants to reset it

    photoList: []


}
