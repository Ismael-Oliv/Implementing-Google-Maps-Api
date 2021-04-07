import React, { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

import LoadError from "./Components/LoadError";
import LoadingMap from "./Components/LoadingMap";
import Point from "./Components/Point";
import Search from "./Components/Search";

import mapStyle from "./config/mapStyles";
import { Logo, Container } from "./styles";

const ContainerStyle = {
  width: "900px",
  height: "600px",
};

const Center = {
  lat: -23.52102,
  lng: -46.37928,
};

const libraries = ["places"];

const Options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(17);

    setMarkers((current) => [
      {
        lat,
        lng,
        time: new Date(),
      },
    ]);
  }, []);

  const onMapClicked = useCallback((event) => {
    setMarkers((current) => [
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  if (loadError) return <LoadError />;

  if (!isLoaded) return <LoadingMap />;

  return (
    <>
      <Container>
        <Logo>Google Maps API</Logo>
        <Search panTo={panTo} />
      </Container>
      <GoogleMap
        mapContainerStyle={ContainerStyle}
        center={Center}
        zoom={8}
        options={Options}
        onClick={onMapClicked}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <Point />
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </>
  );
};

export default Map;
