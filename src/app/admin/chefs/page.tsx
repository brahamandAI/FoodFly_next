"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '@/lib/api';
import { 
  ChefHat, 
  Star, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  Award,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Chef {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  createdAt: string;
  chefProfile: {
    specialization: string[];
    experience: number;
    rating: number;
    totalBookings: number;
    completedEvents: number;
    totalRevenue: number;
    avgRating: number;
    efficiency: number;
    avgEarnings: number;
    isOnline: boolean;
    isActive: boolean;
    verification: {
      isVerified: boolean;
    };
    availability: {
      status: string;
    };
    priceRange: {
      min: number;
      max: number;
      currency: string;
    };
  };
}

interface ChefSummary {
  totalChefs: number;
  verifiedChefs: number;
  availableChefs: number;
  busyChefs: number;
  avgRating: number;
  totalChefBookings: number;
}

export default function AdminChefsPage() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [summary, setSummary] = useState<ChefSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    specialization: '',
    verified: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    fetchChefs();
  }, [filters, pagination.currentPage]);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 20
      };
      
      const data = await adminApi.getAllChefs(params);
      setChefs(data.chefs);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (error: any) {
      console.error('Error fetching chefs:', error);
      toast.error('Failed to load chefs');
    } finally {
      setLoading(false);
    }
  };

  const handleChefAction = async (chefId: string, action: string) => {
    try {
      await adminApi.updateChefStatus(chefId, action);
      toast.success(`Chef ${action} successful`);
      fetchChefs(); // Refresh data
    } catch (error: any) {
      console.error('Error updating chef:', error);
      toast.error('Failed to update chef');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-orange-600 bg-orange-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'busy': return <Clock className="h-4 w-4" />;
      case 'offline': return <XCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  if (loading && chefs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-600 text-lg">Loading chefs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ChefHat className="h-8 w-8 mr-3 text-orange-600" />
              Chef Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and monitor all registered chefs</p>
          </div>
          <button
            onClick={fetchChefs}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Chefs</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalChefs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{summary.availableChefs}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-purple-600">{summary.verifiedChefs}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.avgRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter Chefs</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>

          <select
            value={filters.verified}
            onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>

          <input
            type="text"
            placeholder="Search by specialization..."
            value={filters.specialization}
            onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chefs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Chefs</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chef
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chefs.map((chef) => (
                <tr key={chef._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <ChefHat className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{chef.name}</div>
                        <div className="text-sm text-gray-500">{chef.email}</div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Phone className="h-3 w-3 mr-1" />
                          {chef.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(chef.chefProfile.availability.status)}`}>
                        {getStatusIcon(chef.chefProfile.availability.status)}
                        <span className="ml-1 capitalize">{chef.chefProfile.availability.status}</span>
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {chef.chefProfile.completedEvents} completed
                      </div>
                      <div className="text-xs text-gray-500">
                        {chef.chefProfile.efficiency}% efficiency
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        ₹{chef.chefProfile.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Avg: ₹{chef.chefProfile.avgEarnings.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {chef.chefProfile.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleChefAction(chef._id, chef.chefProfile.verification.isVerified ? 'deactivate' : 'verify')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          chef.chefProfile.verification.isVerified
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {chef.chefProfile.verification.isVerified ? 'Deactivate' : 'Verify'}
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(pagination.totalPages, prev.currentPage + 1) }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
