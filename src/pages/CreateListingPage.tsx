import React from 'react';
import CreateListingForm from '../components/listings/CreateListingForm'; // Assuming the form will be in this path

const CreateListingPage: React.FC = () => {
  return (
    <div className="create-listing-page bg-gray-100 p-4 min-h-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Create New Listing</h1>
      <CreateListingForm />
    </div>
  );
};

export default CreateListingPage; 