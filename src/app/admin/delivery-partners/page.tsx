'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Package, 
  Clock, 
  Phone, 
  Mail, 
  Eye,
  MoreVertical,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeliveryPartner {
  _id: string;
  name: string;
  phone: string;
  email: string;
  profilePhoto?: string;
  deliveryProfile: {
    vehicleType: string;
    vehicleNumber: string;
    currentZone: string;
    isVerified: boolean;
    isActive: boolean;
    totalDeliveries: number;
    totalEarnings: number;
    rating: number;
    availability: {
      status: 'online' | 'offline' | 'busy';
    };
    joinedAt: string;
    lastActiveAt: string;
  };
}

export default function AdminDeliveryPartnersPage() {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    busy: 0,
    verified: 0,
    avgRating: 0,
    totalDeliveries: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchDeliveryPartners();
  }, []);

  const fetchDeliveryPartners = async () => {
    try {
      setLoading(true);
      
      // Get admin token
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Admin authentication required');
        return;
      }

      // Fetch real delivery partners from API
      const response = await fetch('/api/admin/delivery-partners', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load delivery partners: ${response.status}`);
      }

      const data = await response.json();
      const realPartners = data.deliveryPartners || [];
      const summary = data.summary || {};

      // Map API response to component interface
      const mappedPartners: DeliveryPartner[] = realPartners.map((partner: any) => ({
        _id: partner._id,
        name: partner.name,
        phone: partner.phone,
        email: partner.email,
        profilePhoto: partner.profilePhoto,
        deliveryProfile: {
          vehicleType: partner.deliveryProfile?.vehicleType || 'bike',
          vehicleNumber: partner.deliveryProfile?.vehicleNumber || 'N/A',
          currentZone: partner.deliveryProfile?.currentZone || 'Unknown',
          isVerified: partner.deliveryProfile?.isVerified || false,
          isActive: partner.deliveryProfile?.isActive || false,
          totalDeliveries: partner.deliveryProfile?.performance?.completedDeliveries || 0,
          totalEarnings: partner.deliveryProfile?.performance?.totalEarnings || 0,
          rating: partner.deliveryProfile?.rating || 0,
          availability: {
            status: partner.deliveryProfile?.availability?.status || 'offline'
          },
          joinedAt: partner.deliveryProfile?.joinedAt || partner.createdAt,
          lastActiveAt: partner.deliveryProfile?.availability?.lastStatusUpdate || partner.createdAt
        }
      }));

      setPartners(mappedPartners);
      
      // Set stats from API response
      setStats({
        total: summary.totalPartners || 0,
        online: summary.onlinePartners || 0,
        offline: (summary.totalPartners || 0) - (summary.onlinePartners || 0) - (summary.busyPartners || 0),
        busy: summary.busyPartners || 0,
        verified: summary.verifiedPartners || 0,
        avgRating: 4.5, // Calculate from partners if needed
        totalDeliveries: summary.totalDeliveries || 0,
        totalEarnings: (summary.totalDeliveries || 0) * 50 // Assuming ₹50 per delivery
      });

    } catch (error) {
      console.error('Error fetching delivery partners:', error);
      toast.error('Failed to load delivery partners');
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.phone.includes(searchTerm) ||
                         partner.deliveryProfile.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || partner.deliveryProfile.availability.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'busy': return <Clock className="h-4 w-4" />;
      case 'offline': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handlePartnerAction = async (partnerId: string, action: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Admin authentication required');
        return;
      }

      const response = await fetch('/api/admin/delivery-partners', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          partnerId,
          action
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update partner');
      }

      const result = await response.json();
      toast.success(result.message || 'Partner updated successfully');
      
      // Refresh the data
      fetchDeliveryPartners();
      
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('Failed to update partner');
    }
  };

  const vehicleIcons = {
    bike: '🏍️',
    scooter: '🛵',
    bicycle: '🚲',
    car: '🚗',
    walking: '🚶'
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading delivery partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Delivery Partners
                </h1>
                <p className="text-gray-600">Manage and monitor delivery partners</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDeliveryPartners}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Activity className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Partners</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Now</p>
                <p className="text-2xl font-bold text-green-600">{stats.online}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Busy</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.busy}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-purple-600">{stats.verified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgRating}⭐</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.totalDeliveries}</p>
              </div>
              <Package className="h-8 w-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.totalEarnings.toLocaleString('en-IN')}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, phone, or vehicle number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Partners List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Delivery Partners ({filteredPartners.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {partner.profilePhoto ? (
                            <img className="h-12 w-12 rounded-full object-cover" src={partner.profilePhoto} alt="" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {partner.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {partner.name}
                            {partner.deliveryProfile.isVerified && (
                              <CheckCircle className="h-4 w-4 text-blue-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{partner.phone}</div>
                          <div className="text-xs text-gray-400">{partner.deliveryProfile.currentZone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(partner.deliveryProfile.availability.status)}`}>
                        {getStatusIcon(partner.deliveryProfile.availability.status)}
                        <span className="ml-1 capitalize">{partner.deliveryProfile.availability.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <span className="text-lg mr-2">
                          {vehicleIcons[partner.deliveryProfile.vehicleType as keyof typeof vehicleIcons]}
                        </span>
                        <div>
                          <div className="font-medium capitalize">{partner.deliveryProfile.vehicleType}</div>
                          <div className="text-xs text-gray-500 font-mono">
                            {partner.deliveryProfile.vehicleNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{partner.deliveryProfile.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {partner.deliveryProfile.totalDeliveries} deliveries
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ₹{partner.deliveryProfile.totalEarnings.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        ₹{Math.round(partner.deliveryProfile.totalEarnings / partner.deliveryProfile.totalDeliveries)} avg
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastActive(partner.deliveryProfile.lastActiveAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <a 
                          href={`tel:${partner.phone}`}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        
                        {/* Action Buttons */}
                        {!partner.deliveryProfile.isVerified && (
                          <button 
                            onClick={() => handlePartnerAction(partner._id, 'verify')}
                            className="text-yellow-600 hover:text-yellow-800 transition-colors"
                            title="Verify Partner"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {!partner.deliveryProfile.isActive && (
                          <button 
                            onClick={() => handlePartnerAction(partner._id, 'activate')}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Activate Partner"
                          >
                            <Activity className="h-4 w-4" />
                          </button>
                        )}
                        
                        {partner.deliveryProfile.isActive && (
                          <button 
                            onClick={() => handlePartnerAction(partner._id, 'deactivate')}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Deactivate Partner"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery partners found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No delivery partners have registered yet.'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}