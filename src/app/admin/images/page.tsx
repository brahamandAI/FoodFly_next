'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  Image as ImageIcon,
  Cloud,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { testMenuItems } from '@/lib/testData';

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  currentImage?: string;
}

interface ProcessedImage {
  public_id: string;
  urls: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  metadata: {
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
}

interface ProcessingResult {
  success: boolean;
  data?: ProcessedImage;
  error?: string;
}

export default function ImageManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [processingResults, setProcessingResults] = useState<Record<string, ProcessingResult>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Convert test menu items to the format we need
    const items = Object.values(testMenuItems).map(item => ({
      _id: item._id,
      name: item.name,
      category: item.category,
      currentImage: item.image,
    }));
    setMenuItems(items);
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item._id));
    }
  };

  const processImages = async (mode: 'single' | 'batch') => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one menu item');
      return;
    }

    setIsProcessing(true);
    setProcessingResults({});

    try {
      const itemsToProcess = menuItems.filter(item => selectedItems.includes(item._id));
      
      const response = await fetch('/api/admin/process-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          menuItems: itemsToProcess,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process images');
      }

      const result = await response.json();
      setProcessingResults(result.results);

      const successCount = Object.values(result.results).filter((r: any) => r.success).length;
      const failureCount = Object.values(result.results).filter((r: any) => !r.success).length;

      if (successCount > 0) {
        toast.success(`Successfully processed ${successCount} images`);
      }
      if (failureCount > 0) {
        toast.error(`${failureCount} images failed to process`);
      }

    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteImage = async (publicId: string) => {
    try {
      const response = await fetch(`/api/admin/process-images?publicId=${publicId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      toast.success('Image deleted successfully');
      
      // Remove from processing results
      setProcessingResults(prev => {
        const newResults = { ...prev };
        delete newResults[publicId];
        return newResults;
      });

    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const getImageAnalytics = async (publicId: string) => {
    try {
      const response = await fetch(`/api/admin/process-images?publicId=${publicId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get image analytics');
      }

      const result = await response.json();
      console.log('Image analytics:', result.analytics);
      toast.success('Image analytics retrieved');

    } catch (error) {
      console.error('Error getting image analytics:', error);
      toast.error('Failed to get image analytics');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Image Management</h1>
              <p className="text-gray-600 mt-1">
                Process menu images using Unsplash API and Cloudinary optimization
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-6 w-6 text-blue-600" />
              <Cloud className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Select All */}
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </button>

            {/* Process Images */}
            <button
              onClick={() => processImages('batch')}
              disabled={isProcessing || selectedItems.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Process Images ({selectedItems.length})
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredItems.length}</div>
              <div className="text-sm text-blue-600">Total Items</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(processingResults).filter((r: any) => r.success).length}
              </div>
              <div className="text-sm text-green-600">Processed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(processingResults).filter((r: any) => !r.success).length}
              </div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{selectedItems.length}</div>
              <div className="text-sm text-yellow-600">Selected</div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isSelected = selectedItems.includes(item._id);
            const result = processingResults[item._id];

            return (
              <div
                key={item._id}
                className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Item Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectItem(item._id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Current Image */}
                {item.currentImage && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                                         <img
                       src={item.currentImage}
                       alt={item.name}
                       className="w-full h-32 object-cover rounded-lg"
                       onError={(e) => {
                         e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE4NS42MjUgMTUwIDE3NC4zNzUgMTM4Ljc1IDE3NC4zNzUgMTI0LjM3NUMxNzQuMzc1IDEwOS45OTkgMTg1LjYyNSA5OC43NSAyMDAgOTguNzVDMjE0LjM3NSA5OC43NSAyMjUuNjI1IDEwOS45OTkgMjI1LjYyNSAxMjQuMzc1QzIyNS42MjUgMTM4Ljc1IDIxNC4zNzUgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNzQuMzc1IDE3NS42MjVIMjI1LjYyNVYyMDEuMjVIMTc0LjM3NVYxNzUuNjI1WiIgZmlsbD0iIzlCOUJBMCIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                       }}
                     />
                  </div>
                )}

                {/* Processing Result */}
                {result && (
                  <div className="mt-4 p-3 rounded-lg border">
                    {result.success ? (
                      <div className="space-y-3">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Successfully Processed</span>
                        </div>
                        
                        {result.data && (
                          <>
                            <img
                              src={result.data.urls.medium}
                              alt={item.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>Size: {Math.round(result.data.metadata.bytes / 1024)}KB</div>
                              <div>Format: {result.data.metadata.format}</div>
                              <div>Width: {result.data.metadata.width}px</div>
                              <div>Height: {result.data.metadata.height}px</div>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => getImageAnalytics(result.data!.public_id)}
                                className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
                              >
                                Analytics
                              </button>
                              <button
                                onClick={() => deleteImage(result.data!.public_id)}
                                className="flex-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Failed: {result.error}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Process Single */}
                {!result && (
                  <button
                    onClick={() => processImages('single')}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Process Single
                  </button>
                )}
              </div>
            );
          })}
        </div>

                 {/* Empty State */}
         {filteredItems.length === 0 && (
           <div className="text-center py-12">
             <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
             <p className="text-gray-600">Try adjusting your search or category filter.</p>
             <div className="mt-4">
               <button
                 onClick={() => {
                   setSearchTerm('');
                   setSelectedCategory('all');
                 }}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
               >
                 Clear Filters
               </button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
