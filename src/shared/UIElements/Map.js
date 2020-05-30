import React, {useEffect, useRef} from "react";

import './Map.css'

const Map = props =>{
    const mapRef = useRef()

    const {center, zoom} =props

    useEffect(()=>{
        new window.ol.Map({
            target: mapRef.current.id,
            layers: [
                new window.ol.layer.Tile({
                    source: window.ol.source.OSM()
                })
            ],
            view: new window.ol.View({
                center: window.ol.proj.fromLonLat([center.lng, center.Lat]),
                zoom: zoom
            })
        });
    },[center,zoom])

    return (
        <div ref={mapRef} id="map" className={`map ${props.className}`} style={props.style}>

        </div>
    )
}

export default Map
