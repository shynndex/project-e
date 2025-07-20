import React, { useState } from 'react';

const ProductImageGallery = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback cho trường hợp không có hình ảnh
  const imageList = Array.isArray(images) && images.length > 0 
    ? images 
    : ['https://via.placeholder.com/600x600?text=No+Image'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <div 
          className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={imageList[activeImage]}
            alt={`${productName} - Hình ${activeImage + 1}`}
            className="h-96 w-full object-cover object-center transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        {/* Zoom Hint */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          <i className="fas fa-search-plus mr-1"></i>
          Click để phóng to
        </div>
      </div>

      {/* Thumbnail Images */}
      {imageList.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                activeImage === index 
                  ? 'border-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={imageList[activeImage]}
              alt={`${productName} - Zoomed`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;