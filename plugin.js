 $(function () {
    var myAppl = function () {

        // All necessary variables
        var __self = this;
        var allMarkers = [], polygonBase = [], renderedPolygons = [], selectedPolygons = [];
        var points;
        var listenersCount = 0;

        var infoWindow = $('#info-window')[0];


        // Basic params for map
        var mapOptions = {
            zoom: 11,
            mapTypeControl: false,
            navigationControl: true,
            scrollwheel: true

        };

        // Getting location, works perfect in chrome only, in other browsers need timeout
        function getLocation () {
            navigator.geolocation.getCurrentPosition(function (position) {
                __self.map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
            });
         }

         // Function to initialize map
        this.initializeIt = function() {

            this.map = new google.maps.Map( $('#map')[0], mapOptions);

            getLocation();

            buttonSwitch ('complete', true);
            buttonSwitch ('delete', true);
            buttonSwitch ('clear', true);
            buttonSwitch ('export', true);

        };

        // Function to create new polygon
        this.createNew = function () {

            // Check if button pressed twice
            if (this.clickListener) {
                this.finishCurrent();
                buttonSwitch ('clear', true);
                buttonSwitch ('export', true);
            }

            // Check if polygon is selected and reset it
            if (selectedPolygons) {
                selectedPolygons = [];
                buttonSwitch ('delete', true);
            }

            infoWindowSwitch('Укажите возможные координаты вершин полигона, кликая по карте. <br> По завершении нажмите "Закончить", либо "Добавить полигон", чтобы добавить новый полигон');

            buttonSwitch ('complete', false);

            this.createMarker = function (coord) {
               return new google.maps.Marker({
                    position: coord,
                    map: this.map
                });
            };

            //  Add listener for markers
            this.clickListener = this.map.addListener('click', function (e) {
                if (e.latLng) {
                    var coord = {lat: e.latLng.lat(), lng: e.latLng.lng()};
                    var marker = __self.createMarker(coord, allMarkers.length);
                    allMarkers.push(marker);
                }
            });

        };

        // Function to calculate hulls of polygon
        function calculateConvexHull() {

            if (allMarkers.length !== 0) {
                var hullPoints = [];
                points = [];

                for (var i = 0; i < allMarkers.length; i++) {
                    points.push(allMarkers[i].getPosition());
                }
                points.sort(sortPointY);
                points.sort(sortPointX);

                chainHull_2D(points, points.length, hullPoints);

                polygonBase.push(hullPoints);
            }
        }

        function sortPointX (a, b) {
            return a.lng() - b.lng();
        }
        function sortPointY (a, b) {
            return a.lat() - b.lat();
        }

        function removeMarkers() {
            for (var i = 0; i < allMarkers.length; i++) {
                allMarkers[i].setMap(null);
                allMarkers.splice(i, 1);
                i--;
            }
        }

        // Add listeners on polygons for selecting them and check for dragging
        function listenersOnPolygons(arg){
            google.maps.event.addListener(arg, 'click', function (){

                // Check if already selected
                if(arg.trigger === 0) {

                    listenersCount++;

                    arg.trigger = 1;
                    arg.setMap(null);
                    arg.fillOpacity = 0.5;
                    arg.setMap(__self.map);

                    selectedPolygons.push(arg.indexID);

                    buttonSwitch ('delete', false);

                } else if (arg.trigger === 1) {

                    listenersCount--;

                    arg.trigger = 0;
                    arg.setMap(null);
                    arg.fillOpacity = 0.15;
                    arg.setMap(__self.map);

                    if (listenersCount === 0){
                        buttonSwitch ('delete', true);
                        selectedPolygons = [];
                    }

                    for ( var i = 0; i < selectedPolygons.length; i++ ) {
                        if (selectedPolygons[i] === arg.indexID ) {
                            selectedPolygons.splice(i--, 1);
                        }
                    }

                }
            });

            // Save ccords after drag
            google.maps.event.addListener(arg, "dragend", function () {
                polygonBase[arg.indexID] = (arg.getPath().getArray());
            });
        }

        // Render function
        function renderPolygons (){

            if (renderedPolygons) {
                for (var j = 0 ; j < renderedPolygons.length ; j++ ){
                    renderedPolygons[j].setMap(null);
                }
                renderedPolygons = [];
            }
            for (var i = 0; i < polygonBase.length ; i++ ) {
                var polyline = new google.maps.Polygon({
                    map: __self.map,
                    paths: polygonBase[i],
                    fillColor: 'ccddee',
                    strokeWidth: 1,
                    fillOpacity: 0.15,
                    strokeColor: 'ccddee',
                    strokeOpacity: 0.5,
                    indexID: i,
                    draggable: true,
                    trigger: 0
                });
                renderedPolygons.push(polyline);
                listenersOnPolygons(polyline);
            }
        }

        // Import JSON coords function
        this.importIt = function(form) {
            try {
                polygonBase = JSON.parse(form.import.value);
                renderPolygons();
                infoWindowSwitch('off');
                buttonSwitch('clear', false);
                buttonSwitch('export', false);
            }
            catch (e) {
                infoWindowSwitch('<b style="color: red;">Ошибка! Введены некорректные данные.</b>');
            }
        };

        // Function for better work with info window
        function infoWindowSwitch(param) {
            switch (param) {
                case 'off':
                    infoWindow.innerHTML = '';
                    infoWindow.style.display = '';
                    break;
                default:
                    infoWindow.style.display = '';
                    infoWindow.innerHTML = param;
                    infoWindow.style.display = 'block';
            }
        }

        // Function for better work with buttons
        function buttonSwitch(id, param) {
            document.getElementById(id).disabled = param;
        }

        // Delete selected polygon(s)
        this.deletePolygon  = function () {

            // If only one is selected
            if (selectedPolygons.length === polygonBase.length){

                this.deleteAllPolygons();
                selectedPolygons = [];
                buttonSwitch ('delete', true);

            } else {

                selectedPolygons.sort().reverse();
                for (var i = 0; i < selectedPolygons.length; i++) {
                    polygonBase.splice(selectedPolygons[i], 1);
                }
                selectedPolygons = [];
                buttonSwitch ('delete', true);
                renderPolygons();

            }
        };

        // Delete all polygons
        this.deleteAllPolygons = function() {

            for (var j = 0 ; j < renderedPolygons.length ; j++ ){
                renderedPolygons[j].setMap(null);
            }
            renderedPolygons = [];
            polygonBase = [];

            infoWindowSwitch('off');

            buttonSwitch ('delete', true);
            buttonSwitch ('clear', true);
            buttonSwitch ('export', true);

        };

        // Finishing current polygon
        this.finishCurrent = function () {

            infoWindowSwitch('off');

            google.maps.event.removeListener(this.clickListener);

            buttonSwitch ('complete', true);
            calculateConvexHull();
            removeMarkers();
            renderPolygons();

            if ( polygonBase.length !== 0 ) {
                buttonSwitch ('clear', false);
                buttonSwitch ('export', false);
            }

        };

        // Export polygons hulls to JSON
        this.exportPolygons = function () {
            infoWindowSwitch('Координаты вершин полигонов: <br><textarea style="word-break:break-all;" cols="70" rows="10" >' + JSON.stringify(polygonBase)+'</textarea>');
        };

        // Importing JSON polygons hulls
        this.importPolygons = function () {
            infoWindowSwitch('Введите координаты вершин полигонов: <br><form><textarea name="import" style="word-break:break-all;" cols="70" rows="10" ></textarea><br><input type="submit" onclick="PolygonPlugin.importIt(this.form);return false" value="Импорт"> </form>');
        }

    };
    window.PolygonPlugin = new myAppl();
 });