// src/components/LoadingOverlay.tsx
import React from 'react';
import '../../styles/ListProperty/LoadingOverlay.css'; // CSS for styles
import LoaderGif from '../../img//images/Loaders.gif'; // Correct import for the GIF

const LoadingOverlay: React.FC = () => {
  return (
    <div className="loading-overlay">
      <img src={LoaderGif} alt="Loading..." />
      <p>Please wait while we submit your property...</p>
    </div>
  );
};

export default LoadingOverlay;