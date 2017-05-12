 $(function () {
    var myAppl = function () {


        var __self = this;
        var allMarkers = [];
        var points;
        var colorRandomiser;

        var infoWindow = document.getElementById('info-window');

        var mapOptions = {
                zoom: 11,
                center: {lat: 53.9, lng: 27.566},
                mapTypeControl: false,
                navigationControl: true,
                scrollwheel: true
        };

        this.initializeIt = function() {

            this.map = new google.maps.Map(document.getElementById('map'),
                mapOptions);

            document.getElementById("complete").disabled = true;
            document.getElementById("delete").disabled = true;
            document.getElementById("clear").disabled = true;

        };





        this.createNew = function () {

            if (this.clickListener) {
                google.maps.event.removeListener(this.clickListener);
            }

            if (infoWindow.style.display === '') {
                infoWindow.innerHTML = 'Укажите возможные координаты полигона, кликая по карте. <br> По завершении нажмите "Закончить", либо "Добавить полигон", чтобы добавить новый полигон';
                infoWindow.style.display = 'block';
            }

            document.getElementById("complete").disabled = false;

            this.createMarker = function (coord, marker_number) {
               return new google.maps.Marker({
                    position: coord,
                    map: this.map
                });

            };

            this.clickListener = this.map.addListener('click', function (e) {
                if (e.latLng) {
                    var coord = {lat: e.latLng.lat(), lng: e.latLng.lng()};
                    var marker = __self.createMarker(coord, allMarkers.length);
                    allMarkers.push(marker);
                }
            });

        };



        function removeMarkers() {
            for (var i = 0; i < allMarkers.length; i++) {
                allMarkers[i].setMap(null);
                allMarkers.splice(i, 1);
                i--;
            }
        };

        function calculateConvexHull(){
            // if (polyline) polyline.setMap(null);
            points = [];
            for (var i = 0; i < allMarkers.length; i++) {
                points.push(allMarkers[i].getPosition());
            }
            points.sort(sortPointY);
            points.sort(sortPointX);
            DrawHull();
        }

        function sortPointX (a, b) {
            return a.lng() - b.lng();
        }

        function sortPointY (a, b) {
            return a.lat() - b.lat();
        }

        function DrawHull() {
            var hullPoints = [];
            chainHull_2D(points, points.length, hullPoints);
            var polyline = new google.maps.Polygon({
                map: map,
                paths: hullPoints,
                fillColor: colorRandomiser,
                strokeWidth: 1,
                fillOpacity: 0.15,
                strokeColor: colorRandomiser,
                strokeOpacity: 0.5,
                draggable: true
            });
            polyline.setMap(map);
        }



        this.finishCurrent = function () {

            infoWindow.innerHTML = '';
            infoWindow.style.display = '';

            google.maps.event.removeListener(this.clickListener);
            document.getElementById("complete").disabled = true;

            colorRandomiser = "#" + ((1 << 24) * Math.random() | 0).toString(16);

            calculateConvexHull();
            removeMarkers();

        }



    };
    window.PolygonPlugin = new myAppl();
 });









 // -------------------------------------------------------------------------------------------------------- //
 // -------------------------------------------------------------------------------------------------------- //
 // -------------------------------------------------------------------------------------------------------- //





    function initializeI() {
        // Create a map object and specify the DOM element for display.

        // var allMarkers = [],
        //     colorRandomiser,
        var    polyline;

        // var myOptions = {
        //     zoom: 11,
        //     center: {lat: 53.9, lng: 27.566},
        //     mapTypeControl: false,
        //     navigationControl: true,
        //     scrollwheel: true
        // };
        // var map = new google.maps.Map(document.getElementById('map'),
        //     myOptions);


        // Event listener for close info window
        // map.addListener('click', function() {
        //     infowindow.close();
        // });
        // var infowindow = new google.maps.InfoWindow(
        //     {
        //         size: new google.maps.Size(50,50)
        //     });



        // Create event listener on left-click: adding current len/lat to array + pre-render polygon.
        // var listener1 = map.addListener('click', function (e) {
        //     if (e.latLng) {
        //         var coord = {lat: e.latLng.lat(), lng: e.latLng.lng()};
        //         var marker = createMarker(coord, allMarkers.length);
        //         allMarkers.push(marker);
        //     }
        // });


        function removeMarkers() {
            for (var i = 0; i < allMarkers.length; i++) {
                allMarkers[i].setMap(null);
                allMarkers.splice(i, 1);
                i--;
            }
        }

        // function createMarker(coord, marker_number) {
        //     var marker = new google.maps.Marker({
        //         position: coord,
        //         map: map,
        //     });
        //
        //     // google.maps.event.addListener(marker, 'click', function() {
        //     //     var contentString = marker_number + "<br><a href='javascript:removeMarker(LatLng("+marker.getPosition().toUrlValue()+"));'><b>удалить</b></a>";
        //     //     infowindow.setContent(contentString);
        //     //     infowindow.open(map,marker);
        //     // });
        //
        //     return marker;
        // }


        // Calculate convex polygon
        function calculateConvexHull() {
            // if (polyline) polyline.setMap(null);
            var points = [];
            for (var i = 0; i < allMarkers.length; i++) {
                points.push(allMarkers[i].getPosition());
            }
            points.sort(sortPointY);
            points.sort(sortPointX);
            DrawHull();
        }

        function sortPointX(a, b) {
            return a.lng() - b.lng();
        }

        function sortPointY(a, b) {
            return a.lat() - b.lat();
        }

        // Draw polygon
        function DrawHull() {
            hullPoints = [];
            chainHull_2D(points, points.length, hullPoints);
            polyline = new google.maps.Polygon({
                map: map,
                paths: hullPoints,
                fillColor: colorRandomiser,
                strokeWidth: 1,
                fillOpacity: 0.15,
                strokeColor: colorRandomiser,
                strokeOpacity: 0.5,
                draggable: true
            });
            polyline.setMap(map);
        }


        // Create event listener to construct polygon on right-click.
        var listener2 = map.addListener('rightclick', function () {

            // Get random color for each polygon.
            colorRandomiser = "#" + ((1 << 24) * Math.random() | 0).toString(16);

            calculateConvexHull();

            removeMarkers();
        });
    }

