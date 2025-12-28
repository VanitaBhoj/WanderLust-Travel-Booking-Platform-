
console.log("coords from EJS:", coordinates);

if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
  // No valid coordinates; skip map/marker
  console.warn("No valid coordinates for this listing");
} else {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 9,
  });

  new mapboxgl.Marker({ color: 'red'})
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${placeName}</h4><p>exact location will be provided after booking</p>`))
  .addTo(map);
}
