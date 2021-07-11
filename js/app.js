var mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var layer_aed = L.layerJSON({
    url: 'aed.json',
    propertyItems: 'elements',
    propertyTitle: 'tags.name',
    propertyLoc: ['lat', 'lon'],
    caching: true,
    cacheId: function (data, latlng) {
        return data.tags.name || latlng.toString();
    },
    buildIcon: function (data, title) {
        return new L.Icon({
            iconUrl: 'img/aed.png',
            iconSize: new L.Point(32, 37),
            iconAnchor: new L.Point(18, 37),
            popupAnchor: new L.Point(0, -37)
        });
    },
    buildPopup: function (data, marker) {
        if (data.tags.name != undefined) var nome = "<b>Nome</b> = " + data.tags.name; else var nome = "";
        if (data.tags["addr:street"] != undefined) var via = data.tags["addr:street"]; else var via = "";
        if (data.tags["addr:housenumber"] != undefined) var numero = ", " + data.tags["addr:housenumber"]; else var numero = "";
        if (data.tags["addr:city"] != undefined) var citta = data.tags["addr:city"]; else var citta = "";
        var indirizzo = "<br><b>Indirizzo</b> = " + via + numero + "<br>" + citta;
        if (data.tags["addr:street"] == undefined && data.tags["addr:housenumber"] == undefined && data.tags["addr:city"] == undefined) var indirizzo = ""
        if (data.tags.operator != undefined) var gestore = "<br><b>Gestore</b> = " + data.tags.operator; else var gestore = "";
        var foto = "";
        if (data.tags.wikimedia_commons != undefined) {
            var foto = "<br><img src=\"" + mytoWikimediaCommensUrl(data.tags.wikimedia_commons) + "\" width=\"150\" >"
                + "<br><a href=\"" + mytoWikimediaCommensUrl(data.tags.wikimedia_commons) + "\" target='_blank'>Foto originale</a>";
        }
        if (data.tags.mapillary != undefined) {
            var foto = "<br><img src=\"https://d1cuyjsrcm0gby.cloudfront.net/" + data.tags.mapillary + "/thumb-320.jpg\"\" width=\"150\">"
                + "<br><a href=\"https://d1cuyjsrcm0gby.cloudfront.net/" + data.tags.mapillary + "/thumb-320.jpg" + "\" target='_blank'>Foto originale</a>"
                ;
        }
        if (data.tags.indoor == undefined) var ubicazione = "";
        if (data.tags.indoor === "yes") var ubicazione = "<br><b>Ubicazione</b>: interno all'edificio";
        if (data.tags.indoor === "no") var ubicazione = "<br><b>Ubicazione</b>: esterno all'edificio";
        if (data.tags["defibrillator:location"] != undefined) var collocazione = "<br><b>Collocazione: </b>" + data.tags["defibrillator:location"]; else var collocazione = "";
        return nome
            + indirizzo
            + gestore
            + ubicazione
            + collocazione
            + foto;
    }
})
    .on('dataloading', function (e) {
        loader.style.display = 'block';
    })
    .on('dataloaded', function (e) {
        loader.style.display = 'none';
    })
    ;
loader = L.DomUtil.get('loader');
var map = L.map('map', {
    zoom: 10,
    center: new L.latLng([45.398699, 10.972915]),
    layers: [mapnik, layer_aed] //layer attivi quando si carica la pagina
})
var baseLayers = {
    "Mapnik": mapnik,
    "TopoMap": OpenTopoMap,
    "Satellite": Esri_WorldImagery
};
var overlays = {
    "Dae": layer_aed
};
L.control.layers(baseLayers, overlays).addTo(map);