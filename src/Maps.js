import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet';
import './map.css'
import { showDataOnMap } from './util'
function Maps({ countryCircle, casesType, center, zoom }) {
    console.log('asif', casesType)
    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {/*Loop through all countries and draw circles*/}
                {showDataOnMap(countryCircle, casesType)}
            </MapContainer>
        </div>
    )
}

export default Maps

