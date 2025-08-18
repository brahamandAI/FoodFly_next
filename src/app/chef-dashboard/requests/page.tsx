'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  DollarSign, 
  ChefHat,
  Check,
  X,
  Phone,
  Mail,
  Star,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthGuard from '@/components/AuthGuard';

interface GeneralRequest {
  id: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  duration: number;
  guestCount: number;
  cuisine: string[];
  venue: {
    type: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  budgetRange: {
    min: number;
    max: number;
    isFlexible: boolean;
  };
  estimatedTotalAmount: number;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  dietaryRestrictions?: string[];
  bookedAt: string;
}

export default function ChefRequestsPage() {
  const [requests, setRequests] = useState<GeneralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('chef-token');
      
      if (!token) {
        toast.error('Chef authentication required');
        return;
      }

      const response = await fetch('/api/chef-services/general-request', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Chef session expired. Please login again.');
          return;
        }
        const txt = await response.text();
        throw new Error(`Failed to fetch requests: ${txt}`);
      }

      const data = await response.json();
      setRequests(data.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setAcceptingRequest(requestId);
      const token = localStorage.getItem('chef-token');
      
      if (!token) {
        toast.error('Chef authentication required');
        return;
      }

      const response = await fetch('/api/chef-services/accept-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          finalPrice: 0 // Chef can set their own price
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Request accepted successfully!');
        // Remove the accepted request from the list
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        const error = await response.json();
        if (error.error?.includes('already accepted')) {
          toast.error('This request was already accepted by another chef');
          // Remove from list since it's no longer available
          setRequests(prev => prev.filter(req => req.id !== requestId));
        } else {
          toast.error(error.error || 'Failed to accept request');
        }
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    } finally {
      setAcceptingRequest(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getEventTypeLabel = (eventType: string) => {
    const eventTypeLabels: { [key: string]: string } = {
      'birthday_party': 'Birthday Party',
      'anniversary_celebration': 'Anniversary',
      'wedding_catering': 'Wedding',
      'corporate_event': 'Corporate Event',
      'family_gathering': 'Family Gathering',
      'custom_event': 'Custom Event',
      'private_dining': 'Private Dining'
    };
    return eventTypeLabels[eventType] || eventType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available requests...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Available Requests</h1>
                  <p className="text-gray-600">Accept and manage customer requests</p>
                </div>
              </div>
              
              <button
                onClick={fetchRequests}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {requests.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Requests Available</h2>
              <p className="text-gray-600 mb-8">
                There are currently no general requests available. Check back later for new opportunities!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Request Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getEventTypeLabel(request.eventType)}
                          </h3>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock className="h-4 w-4 mr-1" />
                            Available
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(request.eventDate)} at {formatTime(request.eventTime)}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {request.guestCount} guests
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {request.duration} hours
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{request.estimatedTotalAmount}</p>
                        <p className="text-sm text-gray-600">Budget: ₹{request.budgetRange.min}-{request.budgetRange.max}</p>
                        {request.budgetRange.isFlexible && (
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Flexible</span>
                        )}
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Event Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Cuisine:</span>
                            <span className="font-medium">{request.cuisine.join(', ')}</span>
                          </div>
                          {request.specialRequests && (
                            <div className="flex items-start space-x-2">
                              <span className="text-gray-600">Special Requests:</span>
                              <span className="font-medium text-sm">{request.specialRequests}</span>
                            </div>
                          )}
                          {request.dietaryRestrictions && request.dietaryRestrictions.length > 0 && (
                            <div className="flex items-start space-x-2">
                              <span className="text-gray-600">Dietary Restrictions:</span>
                              <span className="font-medium text-sm">{request.dietaryRestrictions.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Location & Customer</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{request.venue.address.street}, {request.venue.address.city}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Customer:</span>
                            <span className="font-medium">{request.customer.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{request.customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{request.customer.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Requested on {formatDate(request.bookedAt)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={acceptingRequest === request.id}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            acceptingRequest === request.id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {acceptingRequest === request.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              <span>Accepting...</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Accept Request</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
