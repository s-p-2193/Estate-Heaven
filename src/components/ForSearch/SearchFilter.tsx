import React from 'react';
import {
  FaBed,
  FaBath,
  FaCouch,
  FaUtensils,
  FaRulerCombined,
  FaSortAmountDown,
  FaBuilding,
} from "react-icons/fa";
import '../../styles/SearchPage/SearchFilter.css';

interface SearchFilterProps {
  onApplyFilters: (filters: any) => void;
  filterState: {
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    halls: string;
    kitchens: string;
    area: string;
    sort: string;
  };
  onFilterChange: (filters: any) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onApplyFilters, filterState, onFilterChange }) => {
  const handleApplyFilters = () => {
    const nonEmptyFilters = Object.keys(filterState)
      .filter(key => filterState[key as keyof typeof filterState] !== '')
      .reduce((obj, key) => {
        obj[key as keyof typeof filterState] = filterState[key as keyof typeof filterState];
        return obj;
      }, {} as Partial<typeof filterState>);

    onApplyFilters(nonEmptyFilters);
  };

  return (
    <div className="filter-container">
      <div className="filter-inputs">
        <div className="filter-item">
          <FaBuilding />
          <select
            className="filter-select"
            onChange={(e) => onFilterChange({ ...filterState, propertyType: e.target.value })}
            value={filterState.propertyType}
            aria-label="Property Type"
          >
            <option value="">Select Property Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>
        <div className="filter-item">
          <FaBed />
          <input
            type="number"
            className="filter-input"
            placeholder="Beds"
            value={filterState.bedrooms}
            onChange={(e) => onFilterChange({ ...filterState, bedrooms: e.target.value })}
          />
        </div>
        <div className="filter-item">
          <FaBath />
          <input
            type="number"
            className="filter-input"
            placeholder="Baths"
            value={filterState.bathrooms}
            onChange={(e) => onFilterChange({ ...filterState, bathrooms: e.target.value })}
          />
        </div>
        <div className="filter-item">
          <FaCouch />
          <input
            type="number"
            className="filter-input"
            placeholder="Halls"
            value={filterState.halls}
            onChange={(e) => onFilterChange({ ...filterState, halls: e.target.value })}
          />
        </div>
        <div className="filter-item">
          <FaUtensils />
          <input
            type="number"
            className="filter-input"
            placeholder="Kitchens"
            value={filterState.kitchens}
            onChange={(e) => onFilterChange({ ...filterState, kitchens: e.target.value })}
          />
        </div>
        <div className="filter-item">
          <FaRulerCombined />
          <input
            type="number"
            className="filter-input"
            placeholder="Area (sq. ft.)"
            value={filterState.area}
            onChange={(e) => onFilterChange({ ...filterState, area: e.target.value })}
          />
        </div>
        <div className="filter-item">
          <FaSortAmountDown />
          <select
            className="filter-select"
            value={filterState.sort}
            onChange={(e) => onFilterChange({ ...filterState, sort: e.target.value })}
          >
            <option value="">Sort</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <button className="apply-button" onClick={handleApplyFilters}>
        Apply
      </button>
    </div>
  );
};

export default SearchFilter;
