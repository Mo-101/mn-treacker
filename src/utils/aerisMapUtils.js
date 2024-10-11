import AerisWeather from '@aerisweather/javascript-sdk';

export const initializeAerisMap = (mapContainer, aerisApp, mapState, toast, addToConsoleLog) => {
  const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);

  aeris.apps().then((apps) => {
    aerisApp.current = new apps.InteractiveMapApp(mapContainer, {
      map: {
        strategy: 'mapbox',
        accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
        zoom: mapState.zoom,
        center: {
          lat: mapState.lat,
          lon: mapState.lng
        },
        timeline: {
          from: -7200,
          to: 0
        }
      },
      layers: {
        radar: { zIndex: 1 },
        satellite: { zIndex: 2 },
        temperatures: { zIndex: 3 },
        'wind-particles': { zIndex: 4 },
        precipitation: { zIndex: 5 },
        clouds: { zIndex: 6 },
      },
      panels: {
        layers: { enabled: false },
        timeline: {
          enabled: true,
          position: { pin: "bottom", translate: { x: 0, y: -16 } }
        },
        search: {
          enabled: true,
          position: { pin: "bottomright", translate: { x: -10, y: -10 } }
        },
        legends: {
          enabled: true,
          toggleable: true,
          position: { pin: "bottomright", translate: { x: -10, y: -10 } }
        },
        info: {
          enabled: true,
          position: { pin: "topleft", translate: { x: 10, y: 10 } },
          metric: true
        }
      }
    });

    aerisApp.current.on('ready', () => {
      console.log('AerisWeather map is ready');
      addToConsoleLog('AerisWeather map initialized');
      setupMapInteractions(aerisApp.current, addToConsoleLog);
    });
  }).catch(error => {
    console.error('Error initializing Aeris Weather SDK:', error);
    toast({
      title: "Error",
      description: "Failed to initialize weather map. Please try again later.",
      variant: "destructive",
    });
  });
};

const setupMapInteractions = (app, addToConsoleLog) => {
  app.panels.info.setContentView('localweather', {
    views: [
      { renderer: "place" },
      { renderer: "obs" },
      { renderer: "threats" },
      { renderer: "forecast" },
      { renderer: "alerts" },
      { renderer: "outlook" },
      { renderer: "hazards" },
      { renderer: "units" }
    ]
  });

  app.map.on('click', (e) => {
    app.showInfoAtCoord(e.data.coord, 'localweather', 'Local Weather');
    addToConsoleLog(`Weather info requested for: ${e.data.coord.lat.toFixed(4)}, ${e.data.coord.lon.toFixed(4)}`);
  });

  // Start the timeline play after a short delay to ensure all layers are loaded
  setTimeout(() => {
    app.map.timeline.play();
    addToConsoleLog('Weather timeline animation started');
  }, 1000);
};

export const cleanupAerisMap = (aerisApp) => {
  if (aerisApp.current && aerisApp.current.map) {
    if (aerisApp.current.map.timeline) {
      aerisApp.current.map.timeline.stop();
    }
    
    // Remove event listeners
    if (typeof aerisApp.current.map.off === 'function') {
      aerisApp.current.map.off();
    }

    // Remove the map
    if (typeof aerisApp.current.map.remove === 'function') {
      aerisApp.current.map.remove();
    }
  } else {
    console.warn('Aeris map or map object not found during cleanup');
  }
  aerisApp.current = null;
};

export const toggleAerisLayer = (app, layerId, visible) => {
  if (app && app.map && app.map.layers) {
    app.map.layers.setLayerVisibility(layerId, visible);
    console.log(`AerisWeather layer ${layerId} visibility set to ${visible}`);
  } else {
    console.warn(`Unable to toggle AerisWeather layer ${layerId}. Map or layers not initialized.`);
  }
};