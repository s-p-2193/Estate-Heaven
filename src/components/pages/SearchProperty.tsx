import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import SearchSection from '../ForSearch/SearchSection';
import SearchResults from '../ForSearch/SearchResults';
import SearchFilters from '../ForSearch/SearchFilter'; 
import PropertyDetailsOverlay from '../pages/PropertyDetailsOverlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../img/images/Loaders.gif';
import '../../styles/SearchPage/SearchProperty.css';

interface Property {
  _id: string;
  title: string;
  price: number;
  type: string;
  for: string;
  city: string;
  state: string;
  bedrooms: number;
  hall: number;
  kitchen: number;
  bathrooms: number;
  area: number;
  ownerName: string;
  images: string[];
  isFavorite: boolean;
  pincode: string;
  address: string;
  ownerContact: string;
  ownerEmail: string;
  description: string;
  latitude: number;
  longitude: number;
}

const SearchProperty: React.FC = () => {
  const { state, city, for: forValue = '' } = useParams<{ state: string; city: string; for: string }>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchExecuted, setSearchExecuted] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState({
    city: city || '',
    state: state || '',
    stateIso2: '',
    for: forValue.toLowerCase() === 'sale' ? 'sale' : 'rent',
  });

  const [filterState, setFilterState] = useState({
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    halls: '',
    kitchens: '',
    area: '',
    sort: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const fetchProperties = useCallback(async (params: any) => {
    if (params.state && params.city && params.for) {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_API_URL}/api/property/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        
        const result = await response.json();
        if (response.ok) {
          setProperties(result.data);
          setSearchExecuted(true);
          // if (result.data.length === 0) {
          //   toast.info("No properties found."); // Toast message for no results
          // }
        } else {
          toast.error(result.message); // Toast for server error messages
        }
      } catch (error) {
        toast.error("An error occurred while fetching properties."); // Generic error message
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProperties(searchParams);
  }, [searchParams, fetchProperties]);

  useEffect(() => {
    if (city && state && forValue) {
      setSearchParams({
        city,
        state,
        stateIso2: '',
        for: forValue === 'sale' ? 'sale' : 'rent',
      });
    }
  }, [city, state, forValue]);

  const handleFavoriteToggle = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const triggerFetch = (filters: any) => {
    const filteredParams = {
      ...searchParams,
      ...filters,
    };

    Object.keys(filteredParams).forEach(key => {
      if (filteredParams[key] === undefined || filteredParams[key] === '') {
        delete filteredParams[key];
      }
    });

    fetchProperties(filteredParams);
  };

  const handleFilterChange = (filters: any) => {
    setFilterState(filters);
  };

  const applyFilters = () => {
    const nonEmptyFilters = Object.keys(filterState)
      .filter(key => filterState[key as keyof typeof filterState] !== '')
      .reduce((obj, key) => {
        obj[key as keyof typeof filterState] = filterState[key as keyof typeof filterState];
        return obj;
      }, {} as Partial<typeof filterState>);

    triggerFetch(nonEmptyFilters);
  };

  const selectedProperty = properties.find(property => property._id === selectedPropertyId) || null;

  return (
    <>
      <Navbar />
      <div className="search-property-page">
        <ToastContainer />
        <SearchSection
          setSearchParams={setSearchParams}
          triggerFetch={() => triggerFetch({})}
        />
        {loading ? (
          <img src={loader} alt="Loading..." className="loading-spinner" />
        ) : (
          searchExecuted && (
            <>
              <SearchFilters 
                onApplyFilters={applyFilters} 
                filterState={filterState} 
                onFilterChange={handleFilterChange} 
              />
              {properties.length > 0 ? (
                <SearchResults
                properties={properties}
                onFavoriteToggle={handleFavoriteToggle}
                favorites={favorites}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                searchExecuted={true}
              />
              
              ) : (
                <p>No Properties Found.</p> // Message if no properties
              )}
            </>
          )
        )}
        {selectedPropertyId && (
          <PropertyDetailsOverlay
            property={selectedProperty}
            onClose={() => setSelectedPropertyId(null)}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchProperty;
