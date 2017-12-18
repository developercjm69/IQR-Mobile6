'use strict';

app.photoView = kendo.observable({});
    var basedata = [];
    var dataimage = [];
    var dropboxImageUrl= '';
    var x = localStorage.getItem('iqSettings');
    var params = JSON.parse(x);

(function (parent) {
    var tries = 0,
        errorResult = function (e) {
            if (e != undefined)
            {
                return;
                //console.log("There has been a connection error!.");
                //alert(e.reason);
            }
            else
            {
                return;
            }
            
        },
        loginResult = function (e) {
            //console.log("loginResult");
            console.log(e.reason);
            tries += 1;

            if (tries >= 3) {
                alert("Please check IQ Credentials on the Settings screen and try again.");
                return;
            }

            if (e.loggedIn == true) {
                photoModel.processBarcodeResult();
            } else {
                errorResult(e);
                app.mobileApp.navigate("#:back");
                //app.mobileApp.navigate('components/home.html');
            }
        },
        getImageName = function () {
            var photoName = app.photoView.photoModel.get("params.itemId") + "-";

            // get right now
            var d = new Date();
            var day = d.getDate();
            if (day.length < 2) day = '0' + day; // add leading zero if needed
            var month = (d.getMonth() + 1).toString();
            if (month.length < 2) month = '0' + month; // ditto

            var year = d.getFullYear();

            var dateString = day.toString() + month.toString() + year.toString() + "-" + d.getTime().toString();
            console.log(dateString);
            photoName = photoName + dateString + ".jpg";

            return photoName;
        },
        updateFileImageUrl = function (uriBatch) {
            console.log("updateFileImageUrl", uriBatch);

            var originalUrl = app.photoView.photoModel.get("params.imageurl");
            console.log(originalUrl);
            var inventoryid = app.photoView.photoModel.get("params.inventoryid");

            var photourl = uriBatch;
            console.log(photourl);
            // var photourl = "";
            // if (originalUrl.length == 0) {
            //     photourl = uriBatch;
            // } else {
            //     photourl = originalUrl + '|' + uriBatch;
            // }

            var dta = [{
                "inventoryid": inventoryid.toString(),
                "imageurl": photourl
            }];

            var fullUri = app.settings.urls.updateImageUrlById;
            //alert(fullUri);
            console.log(dta);
            console.log(fullUri);

            $.ajax({
                url: fullUri,
                contentType: 'application/json',
                type: 'POST',
                headers: {
                    'ApprendaSessionToken': app.settings.apprendaToken
                },
                data: JSON.stringify(dta),
                success: function (s) {
                    // put in check, returns success with error message right now
                    console.log("ImageUrl updated successfully");
                    alert("URLs uploaded successfully!");
                    app.mobileApp.hideLoading();
                    var basedata = [];
                    var dataimage = [];
                    var dropboxImageUrl='';
                    // here we can modify something in UI display, navigate back, etc.
                    console.log(s);
                    app.mobileApp.navigate("#:back");
                },
                error: function (e) {
                    console.log("ImageUrl update error");
                    console.log(e);
                    alert("ImageUrl update error");
                    app.mobileApp.hideLoading();
                }
            });
        },
        uploadSequencer = function (sequence, buildString, status) {
            console.log("sequencer hit: " + sequence + "/" + buildString);
            if (status.result == "complete") {
                updateFileImageUrl(buildString);
            } else if (status.result == "error") {
                errorResult(status.messsage);
            } else {
                sequence += 1;
                uploadFileSequence(sequence, buildString);
            }
        },
       _base64ToArrayBuffer = function (base64) {
            base64 = base64.split('data:image/jpeg;base64,').join('');
            var binary_string = window.atob(base64),
                len = binary_string.length,
                bytes = new Uint8Array(len),
                i;

            for (i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },
        uploadFileSequence = function (sequence, buildString) {
            var accessToken = '';
            var DROPBOX_APP_KEY = params.dropBoxApi;
            
            
            var dbx = new Dropbox({ clientId: DROPBOX_APP_KEY });
            dbx.authenticateWithCordova(
                function(accessToken123) {        
                    accessToken = accessToken123;
                    localStorage.setItem('accessToken', accessToken123);
                    // var data = localStorage.getItem('baseimage');
                    var ACCESS_TOKEN = localStorage.getItem('accessToken');
                    var dbx = new Dropbox({
                    accessToken: ACCESS_TOKEN
                    });
                    var rldrop=0;
                    // for(var rldrop=0; rldrop<basedata.length;rldrop++){
                    // while(rldrop<basedata.length){
                   basedata.forEach((basedataone, index, array) =>  {

                        console.log(index);
                        var imageData =basedataone; //basedata[rldrop];
                        
                        var photoName = getImageName();
                        dbx.filesUpload({
                            path: '/' + photoName,
                            contents: imageData
                        })
                        .then(function(response) {
                            console.log(response);
                            // updateFileImageUrl(response.name);
                            // setTimeout(function(){
                            var imagePath =response.path_display;// "/Apps/iq-reseller-pics"+;
                                var sharedate = {
                                    "path": imagePath,
                                    "settings": {
                                        "requested_visibility": {
                                            ".tag": "public"
                                        }
                                    }
                                };
                                $.ajax({
                                    url: "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
                                    contentType: 'application/json',
                                    type: 'POST',
                                    async:'true',
                                    headers: {
                                    'Authorization': "Bearer "+ACCESS_TOKEN
                                    },
                                    data: JSON.stringify(sharedate),
                                    success: function (s) {
                                        console.log(s);
                                        var res = s.url.split('?');
                                        console.log(res);
                                        if(dropboxImageUrl==''){
                                            dropboxImageUrl += res[0]+"?raw=1";
                                        }else{
                                            dropboxImageUrl += "|"+res[0]+"?raw=1"
                                        }
                                        // dropboxImageUrl += "|"+res[0]+"?raw=1"

                                        // dropboxImageUrl.push(res[0]+"?raw=1|");
                                        console.log(dropboxImageUrl);
                                        console.log(index+"===========");
                                        console.log(basedata.length);
                                        if (index === basedata.length - 1) {
                                            // alert("File Uploaded Sucessfully");
                                            updateFileImageUrl(dropboxImageUrl);
                                        }
                                        app.mobileApp.hideLoading();
                                    },
                                    error: function (e) {
                                        console.log(e);
                                        app.mobileApp.hideLoading();
                                    }
                                });
                            localStorage.removeItem('baseimage');
                           
                        })
                        .catch(function(error) {
                            app.mobileApp.hideLoading();
                            alert("Failed");
                            console.error(error);
                        });
                        rldrop++;
                    });
                    
                    //return false;

                },
                function() {        
                    console.log("failed");
                }); 
           
            // console.log("starting uploadFileSequence: " + sequence + "/" + buildString);

            // console.log(app.settings.photoList.length);

            // if (sequence >= app.settings.photoList.length) {
            //     uploadSequencer(sequence, buildString, { result: "complete", message: "Sequence complete" });
            //     return;
            // }

            // // key is from eh@telerik account
            // var CLIENT_ID = app.appSettingsView.appSettingsModel.params.dropboxApi;

            // // debug code to ensure we have account
            // if (CLIENT_ID == null || CLIENT_ID == "" || CLIENT_ID == undefined) {
            //     CLIENT_ID = "12ch1mb0b0qxpz4";
            // }

            // var urlOptions = {
            //     download: true,
            //     downloadHack: true
            // };

           

            // // var accessToken = authenticateWithCordova();
                


            // window.resolveLocalFileSystemURL(data.fileName,
            //     function (fileEntry) {
            //         fileEntry.file(function (file) {
            //             var imageData = data.fileName;
            //             //var arr = imageData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            //             var bstr = atob(imageURI), n = bstr.length, u8arr = new Uint8Array(n);
            //             while(n--){
            //             u8arr[n] = bstr.charCodeAt(n);
            //             }
                        
            //             var file = new File([u8arr], 'hello.jpg', {type:'image/jpeg'});
            //             console.log(file);
            //             var reader = new FileReader();
            //             reader.onloadend = function (e) {
            //                  var accessToken = '';
            //                 var DROPBOX_APP_KEY = 'enpq4o5era7m3fp';

            //                 var dbx = new Dropbox({ clientId: DROPBOX_APP_KEY });
            //                 dbx.authenticateWithCordova(
            //                     function(accessToken123) {        
            //                         console.log(accessToken123);
            //                         accessToken = accessToken123;
            //                         localStorage.setItem('accessToken', accessToken123);
            //                     },
            //                     function() {        
            //                         console.log("failed");
            //                     }); 
            //                 var dbx1 = new Dropbox({ accessToken: ACCESS_TOKEN });
            //                 /* var fileInput = document.getElementById('file-upload');
            //                 console.log(fileInput);
            //                 var file = fileInput.files[0];
            //                 console.log(file); */
            //                 dbx1.filesUpload({path: '/' + e.target.result, contents: file})
            //                 .then(function(response) {
            //                 //var results = document.getElementById('results');
            //                 //results.appendChild(document.createTextNode('File uploaded!'));
            //                 console.log(response);
            //                 })
            //                 .catch(function(error) {
            //                 console.error(error);
            //                 });
            //                 // var res = this.result; 
            //                 // var binResult = res.substr(res.indexOf(',') + 1);

            //                 // // data > blob
            //                 // var byteCharacters = atob(binResult);
            //                 // var byteNumbers = new Array(byteCharacters.length);
            //                 // for (var i = 0; i < byteNumbers.length; i++) {
            //                 //     byteNumbers[i] = byteCharacters.charCodeAt(i);
            //                 // }
            //                 // var byteArray = new Uint8Array(byteNumbers);
            //                 // var blob = new Blob([byteArray], { type: "image/jpeg" });
            //                 // console.log(blob);
            //                 // get timestamped name
                            
            //                 var photoName = getImageName();
            //                 var dbclient='';
            //                 var accessToken = '';
            //                 var DROPBOX_APP_KEY = 'enpq4o5era7m3fp';

            //                 var dbx = new Dropbox({ clientId: DROPBOX_APP_KEY });
            //                 dbx.authenticateWithCordova(
            //                     function(accessToken123) {        
            //                         console.log(accessToken123);
            //                         accessToken = accessToken123;
            //                         localStorage.setItem('accessToken', accessToken123);
            //                     },
            //                     function() {        
            //                         console.log("failed");
            //                     }); 
            //                    setTimeout(function(){     
            //                    dbx.filesUpload({path: '/' + photoName, contents: file})
            //                     .then(function(response) {
            //                     //var results = document.getElementById('results');
            //                     //results.appendChild(document.createTextNode('File uploaded!'));
            //                     console.log(response);
            //                     })
            //                     .catch(function(error) {
            //                     console.error(error);
            //                     });
            //                   }, 4000);
            //                 // dbx.writeFile(photoName, blob, function (e, s) {
            //                 //         if (e) {
            //                 //             uploadSequencer(sequence, buildString, { result: "error", message: "Error writing file to Dropbox." });
            //                 //             app.mobileApp.hideLoading();
            //                 //             return;
            //                 //         }

            //                         // console.log("writeFile.success");
            //                         // dbx.makeUrl(s.path, urlOptions, function (urlError, url) {
            //                         //     if (urlError) {
            //                         //         uploadSequencer(sequence, buildString, { result: "error", message: "Error getting share url from Dropbox." });
            //                         //         app.mobileApp.hideLoading();
            //                         //         return;
            //                         //     }
            //                         //     console.log("dbclient.makeUrl success");

            //                         //     var buildPlus = "";
            //                         //     if (sequence == 0) {
            //                         //         buildPlus = url.url;
            //                         //     } else {
            //                         //         buildPlus = buildString + '|' + url.url;
            //                         //     }
            //                         //     // var buildPlus = buildString + '|' + url.url;
                                        
            //                             // dbx.authenticateWithCordova(
            //                             // function(accessToken123) {        
            //                             //     console.log(accessToken123);
            //                             //     accessToken = accessToken123;
            //                             //     localStorage.setItem('accessToken', accessToken123);
            //                             // },
            //                             // function() {        
            //                             //     console.log("failed");
            //                             // });      
                                        
            //                             //var buildPlus = buildString + '|' + url.url;
            //                             // uploadSequencer(sequence, buildPlus, { result: "continue", message: "" });
            //                     //     });
            //                     // })
            //                 //dbx.authDriver(new Dropbox.AuthDriver.Cordova());
            //                 // dbx.authenticate(function (error, dbclient) {
                    
            //                 //     if (error) {
            //                 //         uploadSequencer(sequence, buildString, { result: "error", message: "Error authenticating with DropBox.  Please try to login again." });
            //                 //         app.mobileApp.hideLoading();
            //                 //         return;
            //                 //     }

                                
            //                 // });
            //             };
            //             reader.readAsDataURL(file);
            //         });
            //     },
            //     function (fileFail) {
            //         console.log("simulator could not resolve local file system")
            //         uploadSequencer(sequence, buildString, { result: "error", message: fileFail });
            //         app.mobileApp.hideLoading();
            //     });
        },
        padNumber = function (num, length) {
            var resultString = '' + num;
            while (resultString.length < length) {
                resultString = '0' + resultString;
            }

            return resultString;
        },
        photoModel = kendo.observable({
            newItem: {
                ItemNumber: '1',
                itemDescription: 'NS',
                itemId: '2'

            },
            params: {
                itemId: "NS",
                itemDescription: "NS",
                imageSrc: null,
                inventoryid: null,
                imageurl: null,
                deleteItemId: null
            },
            //photoList: app.settings.photoList,

            singlePhotoData: null,
            selectedPhoto: null,
            //** Process the bacode result ***//
            processBarcodeResult: function () {
                var fullUri = app.settings.urls.getById + app.settings.tempSettings.barcodeScanId;
                if (app.settings.apprendaToken == null) {
                    app.iqAuth.loginTwo(loginResult);
                } else {
                    console.log("auth token exists, trying inventory api for id " + app.settings.tempSettings.barcodeScanId);
                    $.ajax({
                        url: fullUri,
                        contentType: 'application/json',
                        type: 'GET',
                        headers: {
                            'ApprendaSessionToken': app.settings.apprendaToken
                        },
                        success: function (s) {
                            console.log(s);

                            // format poid and poline for leading zero requirements
                            var paddedPoid = padNumber(s.poid, 4);
                            var paddedPoline = padNumber(s.poline, 4);

                            var spanid = document.getElementById('itemId');
                            spanid.innerText = spanid.textContent = paddedPoid + "-" + paddedPoline;
                            //photoModel.set("params.itemId", paddedPoid + "-" + paddedPoline);
                            photoModel.set("params.itemNumber", s.item);

                            var span = document.getElementById('itemNumber');
                            span.innerText = span.textContent = s.item;
                            //photoModel.newItem.ItemNumber = s.item.trim();

                            var spanDesc = document.getElementById('itemDescription');
                            spanDesc.innerText = spanDesc.textContent = s.itemdesc;
                            //photoModel.set("params.itemDescription", s.itemdesc);

                            photoModel.set("params.inventoryid", s.inventoryid);
                            photoModel.set("params.imageurl", s.imageurl);

                            app.settings.photoList = [];

                        },
                        error: function (e) {
                            console.log(e);
                            //alert(JSON.stringify(e));
                        }
                    });
                }
            },
            init: function (e) {
                // make large image zoomable
                $("#zoomable").panzoom({
                    minScale: 0.5,
                    maxScale: 3
                });

                $("#photo-list").kendoTouch({
                    hold: function (e) {
                        var itemId = $(e.event.target).parents("li").attr("data-uid");
                        console.log(e);
                        photoModel.params.deleteItemId = itemId;

                        $("#confirm-delete-modal").data("kendoMobileModalView").open();
                    }
                });
            },
            beforeShow: function (e) {
                console.log("beforeShow");
                //**photoList.length = 0;
                tries = 0;
                photoModel.processBarcodeResult();

                $("#file-info-div").show();
                $("#photo-list-div").hide();


                $(".km-state-active").removeClass("km-state-active");
            },
            uploadClick: function (e) {
                $(".km-state-active").removeClass("km-state-active");

                // if (app.settings.photoList.length == 0) {
                //     // alert("No pictures to upload.");
                //     // return;

                // } else {
                    app.mobileApp.showLoading();
                    uploadSequencer(-1, "", { result: "continue" });
                // }
            },
            pictureClick: function (e) {
                $(".km-state-active").removeClass("km-state-active");

                // Get quality every time we take photo.  If no setting saved, default to full size.
                var qualMod = Number(app.appSettingsView.appSettingsModel.params.fileSize);
                if (qualMod == NaN || qualMod == "") qualMod = 0;
                qualMod += 1;
                var qualityValue = 100 / qualMod;

                if (window.navigator.simulator === undefined) {
                     var options = {
                        quality: qualityValue, 
                        destinationType: 0,
                        encodingType: 0,
                        sourceType: 1,
                        targetWidth: 2560, // we can tweak width/height based on determined quality if desired
                        targetHeight: 2560
                    };

                    navigator.camera.getPicture(function (data) {
                        localStorage.setItem('baseimage', data);
                        
                        basedata.push(_base64ToArrayBuffer(data));
                        dataimage.push(data);
                        console.log(dataimage);
                        localStorage.setItem('baseimage', JSON.stringify(basedata));
                        console.log(basedata);
                        var image = document.getElementById('lastImage');

                        if (data.indexOf("file") == 0) { // fileUrl response
                            if (app.settings.photoList.length == 0) {
                                $("#file-info-div").hide();
                                $("#photo-list-div").show();
                            }

                            var widthMeasure = (app.settings.photoList.length + 1) * 100 + 5;
                            var scr = $("#photo-scroll-container");
                            scr.width(widthMeasure);

                            app.settings.photoList.push({ fileName: data });
                            photoModel.selectedPhoto = data;
                            image.src = data;

                        } else { // base64 response
                            // alert("Need file-based, not image data based, for proper memory functionality.  Only one image can be stored with this method.");
                            // var showimage = [];
                        //    showimage.push("data:image/jpeg;base64," + data);
                            var imglist = '';
                            for(var i=0;i<dataimage.length;i++){
                                imglist +='<img src="data:image/jpeg;base64,'+dataimage[i]+'" style="width:49%;margin:0.5%;display:inline-block;height:200px;"/>';
                            }
                            $('#gridimg').html(imglist);
                            // image.src = "data:image/jpeg;base64," + data;
                            
                            photoModel.singlePhotoData = data;
                        }
                    }, function (error) {
                        console.log(JSON.stringify(error));
                        //alert(JSON.stringify(error));
                    }, options);
                } else {
                    // simulator code, can remove when finished testing
                    var image = document.getElementById('lastImage');
                    //var image = new Image();
                    var widthMeasure = (app.settings.photoList.length + 1) * 100 + 5;
                    var scr = $("#photo-scroll-container");
                    scr.width(widthMeasure);

                    var serverImage = "images/server_room" + Math.floor(Math.random() * 3) + ".jpg";
                    app.settings.photoList.push({ fileName: serverImage });
                    photoModel.selectedPhoto = serverImage;
                    image.src = serverImage;

                    //if (app.settings.photoList.length == 0) {
                        $("#file-info-div").hide();
                        $("#photo-list-div").show();
                    //}

                  }
            },
            //scanClick: function (e) { // not implemented, hidden on UI currently
            //    console.log("scan not implemented");
            //    console.log(e);
            //    $(".km-state-active").removeClass("km-state-active");
            //},
            imageSelect: function (e) {
                var image = document.getElementById('lastImage');
                console.log("imageSelect");
                console.log(e);

                var fileName;
                if (e.dataItem === undefined) {
                    fileName = e.data.selectedPhoto;
                } else {
                    fileName = e.dataItem.fileName;
                }

                image.src = fileName;
                photoModel.selectedPhoto = fileName;
            },
            confirmDelete: function (e) {
                console.log("confirmDelete");
                if (e.button[0].innerText === "Yes") {
                    var itemId = photoModel.params.deleteItemId;
                    var pl = $("#photo-list").data("kendoMobileListView");

                    var raw = pl.dataSource.data();

                    for (var i = 0; i < raw.length; i++) {
                        var curTest = raw[i];
                        console.log(curTest);
                        if (curTest.uid === itemId) {
                            pl.dataSource.remove(curTest);
                        }
                    }

                    // clean up for image delete
                    raw = pl.dataSource.data();
                    var image = document.getElementById('lastImage');

                    if (raw.length == 0) {
                        image.src = null;
                    } else {
                        var first = raw[0];
                        image.src = first.fileName;
                    }
                }

                $("#confirm-delete-modal").data("kendoMobileModalView").close();
            }
        });

    parent.set('photoModel', photoModel);
})(app.photoView);
