import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PropertyForm from '../../components/ForListing/PropertyForm';
import '../../styles/ListProperty/ListProperty.css';


const ListProperty: React.FC = () => {
    return (
      <>
        <Navbar />
        <div className="list-property-page">
          <div className="form-container">
            <h1 className="page-title">List Your Property</h1>
            <p className="page-description">
              Fill out the details of your property below to get it listed on Estate Heaven.
            </p>
            <PropertyForm />
          </div>
        </div>
        <Footer />
      </>
    );
};

export default ListProperty;
