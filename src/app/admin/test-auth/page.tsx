"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTestAuthPage() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we have admin authentication
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    if (!adminToken || !adminUser) {
      setAuthStatus('❌ No admin authentication found');
      return;
    }

    try {
      const user = JSON.parse(adminUser);
      if (user.role !== 'admin') {
        setAuthStatus('❌ User is not an admin');
        return;
      }

      setAuthStatus('✅ Admin authentication verified');
      setUserInfo(user);
    } catch (error) {
      setAuthStatus('❌ Error parsing admin user data');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🔐 Admin Auth Test
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-2">Authentication Status:</h2>
            <p className="text-lg">{authStatus}</p>
          </div>

          {userInfo && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="font-semibold text-green-800 mb-2">Admin User Info:</h2>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Role:</strong> {userInfo.role}</p>
                <p><strong>ID:</strong> {userInfo.id}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Admin Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              If you can see this page, the middleware is working correctly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
