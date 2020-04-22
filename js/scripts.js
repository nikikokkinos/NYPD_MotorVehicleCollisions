mapboxgl.accessToken = 'pk.eyJ1IjoibmlraTEyc3RlcCIsImEiOiJjanZlNGFneWswMm0zNDRxcGYwZXYwcjl2In0.fWV3JfWN5hg9UFqDimwIZw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/niki12step/ck5ztjcqg0wb61iqteqyfu5cw', // my style url
  zoom: 9.5,
  center: [-73.915383,40.726238],
})

hoveredId = null

var markerHeight = 20, markerRadius = 10, linearOffset = 25

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

var filterGroup = document.getElementById('filter-group');

map.on('load', function() {

  var filterBorough = ['!=', ['get', 'borough'], 'placeholder']


  map.addSource('crashes', {
    'type': 'geojson',
    'data': 'https://data.cityofnewyork.us/resource/h9gi-nx95.geojson',
    'generateId': true
  })

  map.addLayer({
    'id': 'crashLayer',
    'source': 'crashes',
    'type': 'circle',
    'paint': {
      'circle-radius':
      [
        'match',
        ['get', 'number_of_persons_injured'],
        '0', 1,
        '1', 5,
        '2', 7,
        '3', 9,
        '4', 11,
        '5', 13,
        /* other */ 15
      ],
      'circle-opacity':
        [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          .5,
          1
        ],
      'circle-color': 'white',
    }
  })

  // document.getElementById('slider').addEventListener('input', function(e) {
  //   var hour = parseInt(e.target.value);
  //   // update the map
  //   map.setFilter('crashLayer', ['==', ['number', ['get', 'crash_date']], hour]);
  //
  //   // converting 0-23 hour to AMPM format
  //   var ampm = hour >= 12 ? 'PM' : 'AM';
  //   var hour12 = hour % 12 ? hour % 12 : 12;
  //
  //   // update text in the UI
  //   document.getElementById('active-hour').innerText = hour12 + ampm;
  // })

  document.getElementById('filters').addEventListener('change', function(e) {
    var borough = e.target.value;
    // update the map filter
    if (borough === 'all') {
      filterBorough = ['!=', ['get', 'borough'], 'placeholder'];
    } else if (borough === 'BRONX') {
      filterBorough = ['match', ['get', 'borough'], ['BRONX'], true, false];
    } else if (borough === 'BROOKLYN') {
      filterBorough = ['match', ['get', 'borough'], ['BROOKLYN'], true, false];
    } else if (borough === 'QUEENS') {
      filterBorough = ['match', ['get', 'borough'], ['QUEENS'], true, false];
    } else if (borough === 'MANHATTAN') {
      filterBorough = ['match', ['get', 'borough'], ['MANHATTAN'], true, false];
    } else if (borough === 'STATEN ISLAND') {
      filterBorough = ['match', ['get', 'borough'], ['STATEN ISLAND'], true, false];
    } else {
      console.log('error');
    }
    map.setFilter('crashLayer', ['all', filterBorough]);
  })

  map.on('click', 'crashLayer', function (e) {

    var crashDate = e.features[0].properties.crash_date

    var cdSliced = crashDate.slice(0, 10)

    var popupHTML = 'Crash Date' + ' ' +
    cdSliced.bold() + '<br >' + '# Persons Killed' + ' ' +
    e.features[0].properties.number_of_persons_killed.bold() + '<br >' + '# Persons Injured' + ' ' +
    e.features[0].properties.number_of_persons_injured.bold()

    crashPopup
    .setLngLat(e.lngLat)
    .setHTML( popupHTML )
    .addTo(map)
  })

  map.on('mouseenter', 'crashLayer', function (e) {
    map.getCanvas().style.cursor = 'pointer'

    if (e.features.length > 0) {
      if (hoveredId) {
        map.setFeatureState({ source: 'crashes', id: hoveredId }, { hover: false })
      }
      hoveredId = e.features[0].id
        map.setFeatureState({ source: 'crashes', id: hoveredId }, { hover: true })
      }
    })

  map.on('mouseleave', 'crashLayer', function (e) {
    map.getCanvas().style.cursor = ''
    crashPopup.remove()

    if (hoveredId) {
        map.setFeatureState({ source: 'crashes', id: hoveredId }, { hover: false })
      }
      hoveredId = null
    })

})
