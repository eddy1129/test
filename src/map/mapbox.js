import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import classes from './mapbox.module.css'

import MapboxLanguage from "@mapbox/mapbox-gl-language";
import * as turf from '@turf/turf';

//mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2NodW5obyIsImEiOiJjbGd1OTg3NXUwZGl4M3FxbTE4bnN2czllIn0.kQW7EfbohzpgyObyNwewgw';
mapboxgl.accessToken = "pk.eyJ1IjoieWlpdSIsImEiOiJjazJvMmJ3M2QwejYzM21tdWdiZzR6cmUwIn0.XolZlohi-gYoIdMoen7Gyg";

var locations = [
  {
    name: 'Victoria Peak',
    lng: 114.1492,
    lat: 22.2686,
    arrows: [
      { direction: 0, color: 'red' },
      { direction: 180, color: 'blue' }
    ]
  },
  {
    name: 'Hong Kong Convention and Exhibition Centre',
    lng: 114.1655,
    lat: 22.2779,
    arrows: [
      { direction: 90, color: 'green' },
      { direction: 135, color: 'orange' }
    ]
  },
  {
    name: 'Tsim Sha Tsui',
    lng: 114.1736,
    lat: 22.2950,
    arrows: [
      { direction: 180, color: 'purple' },
      { direction: 225, color: 'yellow' }
    ]
  }];

var data2 = {
  "type": "FeatureCollection",
  "features": [
    { "properties": { "magnitude": 100 }, "geometry": { "type": "Feature", "coordinates": [114.1492, 22.2686], "type": "Point" } },
    { "properties": { "magnitude": 500 }, "geometry": { "type": "Feature", "coordinates": [114.1655, 22.2779], "type": "Point" } },
    { "properties": { "magnitude": 800 }, "geometry": { "type": "Feature", "coordinates": [114.1736, 22.2950], "type": "Point" } }
  ]
}

const Heatmap = ({ data }) => {
  const mapContainerRef = useRef(null);

  // Function to store the selected refresh interval in localStorage
  const setRefreshIntervalInStorage = (value) => {
    localStorage.setItem('refreshInterval', value);
  };

  const [refreshInterval, setRefreshInterval] = useState(localStorage.getItem('refreshInterval')? localStorage.getItem('refreshInterval')/1000:15);
  const [countdown, setCountdown] = useState(localStorage.getItem('refreshInterval')? localStorage.getItem('refreshInterval')/1000:15);
  const [categories, setCategories] = useState([]);
  const refreshPage = () => {
    console.log("Refresh")
    window.location.reload();
  };


  useEffect(() => {

    // Retrieve the selected refresh interval from localStorage
    const storedRefreshInterval = localStorage.getItem('refreshInterval');
    if (storedRefreshInterval) {
      setRefreshInterval(parseInt(storedRefreshInterval));
      setCountdown(parseInt(storedRefreshInterval) / 1000);
    }
    let intervalId;

    if (refreshInterval) {
      intervalId = setInterval(refreshPage, refreshInterval);
    }

    const timer = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [114.1492, 22.3867],
      zoom: 10.5,
    });

    // Add custom pull-down menu
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown';
    dropdownContainer.innerHTML = `
      <select id="map-style-select">
        <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
        <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
        <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
        <option value="mapbox://styles/mapbox/light-v10">Light</option>
      </select>
    `;

    //const mapContainer = map.current;
    //map.addLayer(dropdownContainer);

    map.on('load', () => {
      let data = require('./test.json');
      //console.log(data.features[0].properties)
      const sortedArray = data.features.sort((a, b) => b.properties.magnitude - a.properties.magnitude);
      const numCategories = 5; // Change this to the desired number of categories
      const objectsPerCategory = Math.ceil(sortedArray.length / numCategories);
      //console.log(objectsPerCategory)
      //const categories = [];
      for (let i = 0; i < numCategories; i++) {
        //const category = Math.round((i + 1) * objectsPerCategory/1000)*1000;
        const category = sortedArray.slice(i * objectsPerCategory, (i + 1) * objectsPerCategory);
        //categories.push(category);
        console.log(category[0].properties.magnitude)
        categories.push(category[0].properties.magnitude);
      }
      console.log(categories)
      //console.log(autoColorValue)
      const container = document.createElement("div");
      container.className = "marker-container";

      const label = document.createElement("div");
      label.className = "circle";
      label.textContent = "test";

      container.appendChild(label);

      map.addSource('heatmap-data', {
        type: 'geojson',
        data: data
      });
      map.addLayer({
        id: 'circle-layer',
        type: 'circle',
        source: 'heatmap-data',
        paint: {
          'circle-radius': {
            property: 'magnitude',
            type: 'exponential',
            stops: [
              [categories[4], 5],
              [categories[2], 6],
              [categories[1], 7],
              [categories[0], 9],
            ]
          },
          'circle-color': {
            property: 'magnitude',
            type: 'interval',
            stops: [
              [0, '#F9E2CE'], //FFB422
              [categories[4], '#F5A57D'], //FF5733
              [categories[3], '#E74044'], //D61E56
              [categories[2], '#951C5B'], //961A40
              [categories[1], '#501E49']  //66244C
            ]
          },
          'circle-opacity': 0.7
        }
      });
      var popup;
      map.on('mouseenter', 'circle-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const label2 = e.features[0].properties.magnitude; // Assuming your GeoJSON has a 'label' property

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<p>${label2}</p>`)
          .addTo(map);
      });

      map.on('mouseleave', 'circle-layer', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      //for (const feature of data.features) {
      //    const el = document.createElement('div');
      //    el.className = 'circle1';

      //    new mapboxgl.Marker({
      //      element: el
      //  })
      //    .setLngLat(feature.geometry.coordinates)

      //    .addTo(map);
      //    }

    });

    return () => {
      map.remove();
      clearInterval(timer);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [data, refreshInterval]);

  // Calculate arrow coordinates based on marker location and direction

  // return <div ref={mapContainer} style={{ width: '100%', height: '800px' }} />;
  return (
    <>
      <div className="map-container" ref={mapContainerRef} style={{ width: '100%', height: '800px' }} />
      <div class="legend">
        <h3>User Distribution</h3>
        <div>
          <span class="color-box" style={{ backgroundColor: '#F9E2CE' }}></span><span class="color-label">0 - {categories[4]}</span>
        </div><div>
          <span class="color-box" style={{ backgroundColor: '#F5A57D' }}></span><span class="color-label">{categories[4] + 1} - {categories[3]}</span>
        </div><div>
          <span class="color-box" style={{ backgroundColor: '#E74044' }}></span><span class="color-label">{categories[3] + 1} - {categories[2]}</span>
        </div><div>
          <span class="color-box" style={{ backgroundColor: '#951C5B' }}></span><span class="color-label">{categories[2] + 1} - {categories[1]}</span>
        </div><div>
          <span class="color-box" style={{ backgroundColor: '#501E49' }}></span><span class="color-label">{categories[1] + 1} - {categories[0]}</span>
        </div>
      </div>
      <div className={classes.interval_outer}>
        <p className={classes.interval_inner}>Refresh interval:</p>
        <select className={classes.interval_inner} id="map-style-select" value={refreshInterval} onChange={(e) => {
          const selectedValue = e.target.value;
          setRefreshInterval(selectedValue);
          setCountdown(selectedValue / 1000);

          // Store the selected refresh interval in localStorage
          setRefreshIntervalInStorage(selectedValue);
        }}>
          <option value="5000">5s</option>
          <option value="15000">15s</option>
          <option value="30000">30s</option>
        </select>



        <p className={classes.interval_inner}>Countdown: {countdown}</p>
      </div>


    </>
  );
};

export default Heatmap;