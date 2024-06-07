import './style.css';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';

// Define a GeoJSON object with multiple points
const geojsonObject = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [0, 0] // longitude, latitude
      },
      'properties': {
        'name': 'Null Island',
        'textPosition': 'bottom'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-0.1276, 51.5074] // London
      },
      'properties': {
        'name': 'London',
        'textPosition': 'top'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [2.3522, 48.8566] // Paris
      },
      'properties': {
        'name': 'Paris',
        'textPosition': 'left'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [13.405, 52.52] // Berlin
      },
      'properties': {
        'name': 'Berlin',
        'textPosition': 'right'
      }
    }
  ]
};

// Create a vector source from the GeoJSON object
const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject, {
    featureProjection: 'EPSG:3857'
  })
});

// Create a style function for the vector layer
const styleFunction = (feature) => {
  const textPosition = feature.get('textPosition');
  let textAlign = 'center';
  let textBaseline = 'middle';
  let offsetX = 0;
  let offsetY = 0;

  switch (textPosition) {
    case 'top':
      textBaseline = 'bottom';
      offsetY = -15;
      break;
    case 'bottom':
      textBaseline = 'top';
      offsetY = 15;
      break;
    case 'left':
      textAlign = 'right';
      offsetX = -15;
      break;
    case 'right':
      textAlign = 'left';
      offsetX = 15;
      break;
    default:
      textAlign = 'center';
      textBaseline = 'middle';
  }

  return new Style({
    image: new Icon({
      src: 'https://openlayers.org/en/latest/examples/data/icon.png', // path to an icon image
      scale: 0.1
    }),
    text: new Text({
      text: feature.get('name'),
      textAlign: textAlign,
      textBaseline: textBaseline,
      offsetX: offsetX,
      offsetY: offsetY,
      fill: new Fill({
        color: '#000'
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2
      })
    })
  });
};

// Create a vector layer with the vector source and style function
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction
});

// Create a map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2
  })
});

// Create an overlay to anchor the tooltip to the map
const tooltip = document.getElementById('tooltip');
const overlay = new Overlay({
  element: tooltip,
  offset: [10, 0],
  positioning: 'bottom-left'
});
map.addOverlay(overlay);

// Display the tooltip when hovering over the point
map.on('pointermove', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    const coordinates = (feature.getGeometry()).getCoordinates();
    overlay.setPosition(coordinates);
    tooltip.innerHTML = feature.get('name');
    tooltip.style.display = 'block';
  } else {
    tooltip.style.display = 'none';
  }
});
