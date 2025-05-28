import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MapPin, DollarSign, Home as HomeIcon, BedDouble, Bath, Square, Image as ImageIcon, Trash2 } from 'lucide-react';

const CreateListingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    propertyType: 'Apartment',
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setImageFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    // It's good practice to revoke object URLs to free up memory
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic (e.g., API call with formData and imageFiles)
    console.log('Form data submitted:', formData);
    console.log('Image files:', imageFiles);
    // Reset form or redirect user
  };

  const inputBaseClass = "w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const iconClass = "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 shadow-xl rounded-lg max-w-3xl mx-auto">
      
      {/* Property Information Section */}
      <section>
        <h3 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-300 pb-3">Property Details</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>Property Title*</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputBaseClass} required />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description*</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={5} className={inputBaseClass} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className={labelClass}>Price (USD)*</label>
              <div className="relative">
                <DollarSign className={iconClass} />
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className={`pl-10 ${inputBaseClass}`} required />
              </div>
            </div>
            <div>
              <label htmlFor="propertyType" className={labelClass}>Property Type*</label>
              <div className="relative">
                <HomeIcon className={iconClass} />
                <select name="propertyType" id="propertyType" value={formData.propertyType} onChange={handleChange} className={`pl-10 ${inputBaseClass}`} required>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Studio</option>
                  <option>Duplex</option>
                  <option>Penthouse</option>
                  <option>Land</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section>
        <h3 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-300 pb-3">Location</h3>
        <div>
          <label htmlFor="address" className={labelClass}>Address*</label>
          <div className="relative">
            <MapPin className={iconClass} />
            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className={`pl-10 ${inputBaseClass}`} required />
          </div>
        </div>
      </section>

      {/* Features & Amenities Section */}
      <section>
        <h3 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-300 pb-3">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="bedrooms" className={labelClass}>Bedrooms</label>
            <div className="relative">
              <BedDouble className={iconClass} />
              <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} className={`pl-10 ${inputBaseClass}`} min="0" />
            </div>
          </div>
          <div>
            <label htmlFor="bathrooms" className={labelClass}>Bathrooms</label>
            <div className="relative">
              <Bath className={iconClass} />
              <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} className={`pl-10 ${inputBaseClass}`} min="0" />
            </div>
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>Area (sqft)*</label>
            <div className="relative">
              <Square className={iconClass} />
              <input type="number" name="area" id="area" value={formData.area} onChange={handleChange} className={`pl-10 ${inputBaseClass}`} min="0" required />
            </div>
          </div>
        </div>
        {/* TODO: Add more amenity checkboxes here if needed, similar to PredictionForm */}
      </section>

      {/* Image Upload Section */}
      <section>
        <h3 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-300 pb-3">Property Images</h3>
        <div>
          <label htmlFor="images" className={labelClass}>Upload Images (Max 5)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600">
                <label htmlFor="imageUpload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                  <span>Upload files</span>
                  <input id="imageUpload" name="imageUpload" type="file" className="sr-only" onChange={handleImageChange} multiple accept="image/*" disabled={imageFiles.length >= 5} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
              {imageFiles.length >= 5 && <p className="text-sm text-red-500">Maximum 5 images allowed.</p>}
            </div>
          </div>
        </div>

        {imagePreviews.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-slate-700 mb-2">Image Previews:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className="relative group">
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover rounded-md shadow-md" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Submission Section */}
      <section className="pt-6 border-t border-slate-300">
        <button 
          type="submit" 
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
          disabled={false} // Replace with actual loading state if needed
        >
          Create Listing
        </button>
      </section>
    </form>
  );
};

export default CreateListingForm; 