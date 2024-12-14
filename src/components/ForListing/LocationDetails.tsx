import React, { useState, useEffect, memo } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">Loading...</div>
);

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries: Libraries = ["places"];

interface LocationDetailsProps {
  formData: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: string;
    longitude: string;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationDetails: React.FC<LocationDetailsProps> = memo(
  ({ formData, handleChange }) => {
    const [showMap, setShowMap] = useState(false);
    const [latitude, setLatitude] = useState(23.0225);
    const [longitude, setLongitude] = useState(72.5714);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [states, setStates] = useState<{ name: string; iso2: string }[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
      const fetchStates = async () => {
        try {
          const req = await fetch(
            "https://api.countrystatecity.in/v1/countries/IN/states",
            {
              method: "GET",
              headers: {
                'X-CSCAPI-KEY': process.env.REACT_APP_LOCATION_AUTHORIZATION_KEY || '',
              },
            }
          );

          if (req.ok) {
            const stateData = await req.json();
            const stateNames = stateData.map((state: { name: string; iso2: string }) => ({
              name: state.name,
              iso2: state.iso2,
            }));
            // Sort states alphabetically
            stateNames.sort((a: { name: string }, b: { name: string}) => a.name.localeCompare(b.name));
            setStates(stateNames);
          } else {
            throw new Error('Failed to fetch states');
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    }, []);

    const fetchCities = async (stateIso2: string) => {
      try {
        const req = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${stateIso2}/cities`, {
          method: 'GET',
          headers: {
            'X-CSCAPI-KEY': process.env.REACT_APP_LOCATION_AUTHORIZATION_KEY || '',
          },
        });

        if (req.ok) {
          const cityData = await req.json();
          const cityNames = cityData.map((city: { name: string }) => city.name);
          // Sort cities alphabetically
          cityNames.sort((a: string, b: string) => a.localeCompare(b));
          setCities(cityNames);
        } else {
          throw new Error('Failed to fetch cities');
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const state = event.target.value;
      const selectedStateData = states.find(s => s.name === state);
      if (selectedStateData) {
        setSelectedState(selectedStateData.name);
        handleChange({
          target: { name: "state", value: selectedStateData.name },
        } as React.ChangeEvent<HTMLInputElement>);
        fetchCities(selectedStateData.iso2); // Pass the ISO code
      }
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const city = event.target.value;
      setSelectedCity(city);
      handleChange({
        target: { name: "city", value: city },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setLatitude(lat);
        setLongitude(lng);
      }
    };

    useEffect(() => {
      if (formData.latitude !== latitude.toString()) {
        handleChange({
          target: { name: "latitude", value: latitude.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
      }
      if (formData.longitude !== longitude.toString()) {
        handleChange({
          target: { name: "longitude", value: longitude.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }, [latitude, longitude, formData, handleChange]);

    return (
      <div className="real-estate-form-section">
        <h3 className="listproperty-h3">Location Details</h3>
        <input
          className="real-estate-form-input"
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <div className="real-estate-form-two-column">
          <select
            className="real-estate-form-select"
            onChange={handleStateChange}
            value={selectedState}
          >
            <option value="" disabled hidden>Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          <select
            className="real-estate-form-select"
            onChange={handleCityChange}
            value={selectedCity}
          >
            <option value="" disabled hidden>Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <input
          className="real-estate-form-input"
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        <button
          type="button"
          onClick={() => setShowMap((prev) => !prev)}
          className={
            showMap ? "remove-map-point-button" : "add-map-point-button"
          }
        >
          {showMap ? <FaTrash /> : <FaMapMarkerAlt />}
          {showMap ? " Remove Map Point" : " Add Map Point"}
        </button>

        {showMap && (
          <div className="map-container">
            <input
              className="real-estate-form-input"
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={latitude.toFixed(6)}
              readOnly
            />
            <input
              className="real-estate-form-input"
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={longitude.toFixed(6)}
              readOnly
            />
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_KEY || ""}
              libraries={libraries}
            >
              {!isMapLoaded && <LoadingSpinner />}
              {mapError && <div>Error loading map. Please try again.</div>}
              {!mapError && (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat: latitude, lng: longitude }}
                  zoom={12}
                  onClick={handleMapClick}
                  onLoad={() => setIsMapLoaded(true)}
                >
                  <Marker position={{ lat: latitude, lng: longitude }} />
                </GoogleMap>
              )}
            </LoadScript>
            {mapError && (
              <iframe
                title="Google Map"
                width="100%"
                height="400"
                src={`https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_APP_GOOGLE_MAP_KEY || ""}&center=${latitude},${longitude}&zoom=12`}
                style={{ border: '0' }}
                allowFullScreen
              ></iframe>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default LocationDetails;
