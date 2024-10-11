import AerisWeather from '@aerisweather/javascript-sdk';

export const initializeAerisMap = (mapContainer, aerisApp, mapState, toast) => {
  const aeris = new AerisWeather('r8ZBl3l7eRPGBVBs3B2GD', 'e3LxlhWReUM20kV7pkCTssDcl0c99dKtJ7A93ygW');

  aeris.apps().then((apps) => {
    aerisApp.current = new apps.InteractiveMapApp(mapContainer, {
      map: {
        strategy: 'mapbox',
        accessToken: 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A',
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
      console.log('Map is ready');
      setupMapInteractions(aerisApp.current);
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

const setupMapInteractions = (app) => {
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
  });

  // Start the timeline play after a short delay to ensure all layers are loaded
  setTimeout(() => {
    app.map.timeline.play();
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