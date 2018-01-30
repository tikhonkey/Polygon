# Polygon plugin

Test task for interview  

#### Main goals:

1. ol The widget should be designed as a JQuery plugin  
2. ol The widget must work in latest version on Google Chrome  
3. ol Google Maps API must be used to work with maps  
4. ol When opened, the widget should automatically determine the current user position by using Geo HTML5 API and center the map on the received coordinates.  
5. ol The following tools should be available to the user:  
  5. ol add a polygon;  
  5. ol Delete the polygon;  
  5. ol Delete everything;  
  5. ol Export;  
  5. ol Import;  
6. ol When user click on the "Add a polygon" button, he should be able to draw a polygon on the map, clicking on it. With each click on the map in the potential polygon point must be added point-vertex. When the user wants to complete adding vertices to the polygon, he should be able to click on the button "Add a polygon" again.  
7. ol When clicking on an already drawn polygon system should highlight it (polygon).  
8. ol User should be able to move the selected polygon on the map with the mouse.  
9. ol By clicking on the "Delete polygon" button system should delete the selected polygon from the map.  
10. ol By clicking on "Delete All" button system must delete all polygons from the map.  
11. ol By clicking on the "Export" button system should output the list of polygons with the coordinates of the vertices in JSON format to any place in HTML.  
12. ol User should be able to import the drawn polygons (using the JSON format from the export) to the widget using the "Import" button.  
13. ol The system should allow user to create only convex polygons.  
14. ol System should allow to create several widgets on one page (the widget code must be correctly encapsulated and not conflict with other widget instances on the page).
