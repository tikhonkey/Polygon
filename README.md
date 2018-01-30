# Polygon plugin

### Main goals:

1. The widget should be designed as a JQuery plugin
2. The widget must work in latest version on Google Chrome
3. Google Maps API must be used to work with maps
4. When opened, the widget should automatically determine the current user position by using Geo HTML5 API and center the map on the received coordinates.
5. The following tools should be available to the user:
    a. Add a polygon;
    b. Delete the polygon;
    c. Delete everything;
    d. Export;
    e. Import;
6. When user click on the "Add a polygon" button, he should be able to draw a polygon on the map, clicking on it. With each click on the map in the potential polygon point must be added point-vertex. When the user wants to complete adding vertices to the polygon, he should be able to click on the button "Add a polygon" again.
7. When clicking on an already drawn polygon system should highlight it (polygon).
8. User should be able to move the selected polygon on the map with the mouse.
9. By clicking on the "Delete polygon" button the system should delete the selected polygon from the map.
10. By clicking on "Delete All" button the system must delete all polygons from the map.
11. By clicking on the "Export" button the system should output the list of polygons with the coordinates of the vertices in JSON format to any place in HTML.
12. User should be able to import the drawn polygons (using the JSON format from the export) to the widget using the "Import" button.
13. The system should allow user to create only convex polygons.
14. The system should allow to create several widgets on one page (the widget code must be correctly encapsulated and not conflict with other widget instances on the page).
