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

  map.addSource('crashes', {
    'type': 'geojson',
    'data': 'https://data.cityofnewyork.us/resource/h9gi-nx95.geojson',
    'generateId': true
  })

  // map.getSource('crashes')._data.features.forEach(function(feature) {
  //   var numInjured = feature.properties.number_of_persons_injured;
  //   var crashLayer = 'poi-' + numInjured;
  //
  //   if (!map.getLayer(crashLayer)) {
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
      }
    })

  // Add checkbox and label elements for the layer.
  //   var input = document.createElement('input');
  //   input.type = 'checkbox';
  //   input.id = crashLayer;
  //   input.checked = true;
  //   filterGroup.appendChild(input);
  //
  //   var label = document.createElement('label');
  //   label.setAttribute('for', crashLayer);
  //   label.textContent = numInjured;
  //   filterGroup.appendChild(label);
  //
  //   // When the checkbox changes, update the visibility of the layer.
  //     input.addEventListener('change', function(e) {
  //         map.setLayoutProperty(
  //           crashLayer,
  //           'visibility',
  //           e.target.checked ? 'visible' : 'none'
  //         );
  //     });
  //   }
  // });

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

  // var dropDown = $('.dropdown')
  //
  // dropDown.on('mousemove', (e) => {
  //   if ($('.2013').checked) {
  //     crashDate
  //   }
  // })

})
