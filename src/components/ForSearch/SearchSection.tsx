import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/SearchPage/SearchSection.css';

interface SearchParams {
  city: string;
  state: string;
  stateIso2: string;
  for: string; // Represents "sale" or "rent"
}

interface State {
  name: string;
  iso2: string;
}

interface SearchSectionProps {
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  triggerFetch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ setSearchParams, triggerFetch }) => {
  const navigate = useNavigate();
  const [localSearchParams, setLocalSearchParams] = useState<SearchParams>({ city: '', state: '', stateIso2: '', for: 'sale' });
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const req = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
          method: 'GET',
          headers: {
            'X-CSCAPI-KEY': process.env.REACT_APP_LOCATION_AUTHORIZATION_KEY || '',
          },
        });

        if (req.ok) {
          const stateData = await req.json();
          const stateNames = stateData.map((state: State) => ({ name: state.name, iso2: state.iso2 }));
          stateNames.sort((a: State, b: State) => a.name.localeCompare(b.name));
          setStates(stateNames);
        } else {
          throw new Error('Failed to fetch states');
        }
      } catch (error) {
        console.error('Error fetching states:', error);
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
        cityNames.sort((a: string, b: string) => a.localeCompare(b));
        setCities(cityNames);
      } else {
        throw new Error('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateIso2 = event.target.value;
    const selectedState = states.find(state => state.iso2 === selectedStateIso2);

    if (selectedState) {
      setLocalSearchParams(prev => ({
        ...prev,
        state: selectedState.name,
        stateIso2: selectedStateIso2,
        city: '', // Reset city when state changes
      }));
      fetchCities(selectedStateIso2);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = event.target.value;
    setLocalSearchParams(prev => ({ ...prev, city: selectedCity }));
  };

  const handleSearch = () => {
    setSearchParams(localSearchParams);
    const forValue = localSearchParams.for === 'rent' ? 'rent' : 'sale'; // Ensure lowercase
    navigate(`/search/${localSearchParams.state}/${localSearchParams.city}/${forValue}`);
    triggerFetch();
  };

  return (
    <div className="search-section-search-container">
      <h1 className="search-section-search-title">Find Your Dream Property</h1>

      <div className="search-section-service-type-toggle">
        <div
          className={`search-section-service-type-box ${localSearchParams.for === 'sale' ? 'active' : ''}`}
          onClick={() => setLocalSearchParams(prev => ({ ...prev, for: 'sale' }))}>
          Buy
        </div>
        <div
          className={`search-section-service-type-box ${localSearchParams.for === 'rent' ? 'active' : ''}`}
          onClick={() => setLocalSearchParams(prev => ({ ...prev, for: 'rent' }))}>
          Rent
        </div>
      </div>

      <div className="search-section-search-form">
        <div className="search-section-search-input-group">
          <FaMapMarkerAlt className="search-section-search-icon" />
          <select name="state" onChange={handleStateChange} aria-label="State">
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state.iso2}>{state.name}</option>
            ))}
          </select>
        </div>
        <div className="search-section-search-input-group">
          <FaMapMarkerAlt className="search-section-search-icon" />
          <select name="city" onChange={handleCityChange} aria-label="City">
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <button className="search-section-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
