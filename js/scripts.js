mapboxgl.accessToken = 'pk.eyJ1IjoibmlraTEyc3RlcCIsImEiOiJjanZlNGFneWswMm0zNDRxcGYwZXYwcjl2In0.fWV3JfWN5hg9UFqDimwIZw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/niki12step/ck5ztjcqg0wb61iqteqyfu5cw', // my style url
  zoom: 9.5,
  center: [-73.915383,40.726238],
})

hoveredCurrentId = null

var markerHeight = 20, markerRadius = 10, linearOffset = 25;
var popupOffsets = {
  'top': [0, 0],
  'top-left': [0,0],
  'top-right': [0,0],
  'bottom': [0, -markerHeight],
  'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  'left': [markerRadius, (markerHeight - markerRadius) * -1],
  'right': [-markerRadius, (markerHeight - markerRadius) * -1]
}

var crashPopup = new mapboxgl.Popup({
  offset: popupOffsets,
  closeButton: false,
  closeOnClick: false
})

map.on('load', function() {

  map.addSource('crashes', {
    'type': 'geojson',
    'data': 'https://data.cityofnewyork.us/resource/h9gi-nx95.geojson',
    'generateId': true
  })

  // Add a circle layer with a vector source.
  map.addLayer({
    'id': 'crashLayer',
    'source': 'crashes',
    'type': 'circle',
    'paint': {
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        11,
        7 ],
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        .5,
        1 ],
      'circle-color': 'white',
    },
  })

  map.on('click', 'crashLayer', function (e) {

    var popupHTML = 'Crash Date' + ' ' +  e.features[0].properties.crash_date + '<br >' + '# Persons Killed' + ' ' + e.features[0].properties.number_of_persons_killed

    crashPopup
    .setLngLat(e.lngLat)
    .setHTML( popupHTML )
    .addTo(map)
  })

  map.on('mouseenter', 'crashLayer', function (e) {
    map.getCanvas().style.cursor = 'pointer'

    if (e.features.length > 0) {
      if (hoveredCurrentId) {
      map.setFeatureState(
      { source: 'crashes', id: hoveredCurrentId },
      { hover: false })
      }
      hoveredCurrentId = e.features[0].id;
      map.setFeatureState(
      { source: 'crashes', id: hoveredCurrentId },
      { hover: true })
      }
    })

  map.on('mouseleave', 'crashLayer', function (e) {
    map.getCanvas().style.cursor = ''
    crashPopup.remove()

    if (hoveredCurrentId) {
      map.setFeatureState(
      { source: 'crashes', id: hoveredCurrentId },
      { hover: false })
      }
      hoveredCurrentId = null
    })
})
