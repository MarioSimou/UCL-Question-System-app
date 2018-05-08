# UCL-Question-System-app

**What is UCL Question System app?**

The UCL Question System app is a browsed-based web application that works in conjunction with the UCL Quiz app. The main operation of the application is data collection and the population of the back-end database that is used by the UCL Quiz app. In particular, it enables to a user to record POIs in which information has been attached that is employed by the quiz app.

**Which browsers do support the web app?**

The web application is compatible with the following browsers:
Google Chrome Version 66.0.3359.139 (64-bit)
Google Chrome Version 48.0.2564.109 (64-bit)
Mozilla Firefox Quantum Version 59.0.2 (64-bit)
Mozilla Firefox Quantum Version 45.2.0 (64-bit)
Internet Explorer 11 Version 11.0.9600.18920 (64-bit) 

**How does it works?**

The app automatically loads a POI (point of interest) dataset of UCL’s buildings and zoom the map display on them. Double-clicking on the map display, a pop up window appears that prompts a user to store a POI at the location that he/she has chosen. Therefore, the user needs to fill a form and submit it. After that process, the selected point is stored in the dataset, and refreshing the website it can  be seen that the dataset is now updated.


**Who can use it?**

The app is available on any user.

**How to access the UCL Question System app?**

The user can access the application in the following link:

> http://developer.cege.ucl.ac.uk:31277/

-----------------------------------------------------------------------------------------------------------------------------

**Web App Features**

Besides the main purpose of the mobile app to inform a user and prompts him/her on a quiz challenge, the app’s deployment was attained so that a user can interact with the facilities of the campus of UCL. A variety of commands and operations are supported, which are described in that section.

**Commands**

![6](https://user-images.githubusercontent.com/32243459/39714162-15bccc04-5221-11e8-8722-93e21c6906b2.png)  
>Search Command

A building might be searched based on its corresponded question using this command. A marker is used to represent the building that is found.

![7](https://user-images.githubusercontent.com/32243459/39714472-166610c4-5222-11e8-9ba2-1cc70becd522.png)
> Clean Command

Markers that may remain from a search process or the geolocation are cleaned from the map.

![8](https://user-images.githubusercontent.com/32243459/39714506-36b6acee-5222-11e8-863d-d9efd0a300d8.png)

> Full Zoom Command

The map zoom changes so that a full display of the data is given.

![11](https://user-images.githubusercontent.com/32243459/39715229-858c8a62-5224-11e8-8433-35be023a45c7.png)

> Geolocation Command

Enables the geolocation of the user and marks his/her location on a map. The accuracy of the geolocation is shown with a buffer around the marked position of the user. Based on the user desire, the geolocation command can be activated or deactivated.

![mari](https://user-images.githubusercontent.com/32243459/39732685-b47daf62-5266-11e8-9f09-24ab1f9ffe78.png)

> Help Command 

Pressing this command, a new site opens with the corresponded documentation of the app


**3. More Capabilities**

When a user clicks on a POI, a pop up that contains information related to the clicked point is shown. The pop up contains information such as the department name, the question that is asked for that point, its correct answer, and its geographical coordinates [Fig 1 (A)].

Hovering over the map and the POI dataset, information related to their content is shown at the bottom-left corner of the map [Fig. 1 (B)]. This information is similar with what is given in the pop up window.

![7a](https://user-images.githubusercontent.com/32243459/39714629-9642614e-5222-11e8-94ec-cf9eca64cade.png)

Fig. 1 (A)

![7b](https://user-images.githubusercontent.com/32243459/39714666-b4f1fb54-5222-11e8-8a4f-911d60093a59.png)

Fig. 1 (B)

In order to make the map display more visually attractive, the buildings of UCL are concentrated in small clusters (Fig. 2). Each building that may fell within the buffer zone of a cluster, is added on that cluster and removed from the display. As a zoom level of the map changes, and the display reaches to its maximum zoom level, the cluster dissolves.

![9](https://user-images.githubusercontent.com/32243459/39714689-c753bf62-5222-11e8-8d76-caf5dcdad0d7.png)

Fig. 2

Lastly, the map is equipped with a scale bar [(Fig. 3)], which uses metre or foot as the measurement unit. The scale bar is often important when a user wants to estimate a distance from his/her location.  

![10](https://user-images.githubusercontent.com/32243459/39714734-e3e25206-5222-11e8-8a8a-b15eaae3469f.png)

Fig. 3

---------------------------------------------------------------------------------------------------------------------------

**Sources:**

[Markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster)

[Awesome Markers Plugin](https://github.com/lvoogdt/Leaflet.awesome-markers)

[Leaflet](https://leafletjs.com/)

[Leaflet Search](https://github.com/stefanocudini/leaflet-search)
