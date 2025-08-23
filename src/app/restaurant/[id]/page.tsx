'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import RestaurantMenuGrid from '../../../components/RestaurantMenuGrid';

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Restaurant mapping
  const restaurantMapping = {
    '1': { name: 'Panache', theme: 'panache' as const },
    '2': { name: 'Cafe After Hours', theme: 'cafe' as const },
    '3': { name: 'Symposium Restaurant', theme: 'symposium' as const }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const restaurantId = params.id as string;
  const restaurantInfo = restaurantMapping[restaurantId as keyof typeof restaurantMapping];

  if (!restaurantInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Restaurant Not Found</h2>
          <p className="text-gray-400 mb-4">The restaurant you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => router.back()}
          className="p-3 bg-gray-900/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Restaurant Menu Grid */}
      <RestaurantMenuGrid 
        restaurantId={restaurantId}
        restaurantName={restaurantInfo.name}
        theme={restaurantInfo.theme}
      />
    </div>
  );
} 