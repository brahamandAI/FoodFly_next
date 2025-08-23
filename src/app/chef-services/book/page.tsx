'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ChefHat,
  Check,
  ArrowLeft,
  Star,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthGuard from '@/components/AuthGuard';
import { Playfair_Display, Dancing_Script, Cormorant_Garamond } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });
const cormorant = Cormorant_Garamond({ 
  weight: ['400', '600'],
  subsets: ['latin'] 
});

interface EventDetails {
  type: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  guestCount: number;
  cuisine: string[];
  specialRequests: string;
  dietaryRestrictions: string[];
  customMenu: {
    isCustom: boolean;
    appetizers: string[];
    mainCourses: string[];
    desserts: string[];
    beverages: string[];
    additionalRequests: string;
  };
}

interface LocationDetails {
  address: string;
  city: string;
  state: string;
  pincode: string;
  venue_type: string;
}

interface BudgetDetails {
  min: number;
  max: number;
  isFlexible: boolean;
}

function BookChefPageContent() {
  const searchParams = useSearchParams();
  const preferredChefId = searchParams?.get('chef');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedChef, setSelectedChef] = useState<any>(null);
  const [userPhone, setUserPhone] = useState<string>('');
  
  // Form data
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    type: '',
    title: '',
    description: '',
    date: '',
    duration: 4,
    guestCount: 10,
    cuisine: [],
    specialRequests: '',
    dietaryRestrictions: [],
    customMenu: {
      isCustom: false,
      appetizers: [],
      mainCourses: [],
      desserts: [],
      beverages: [],
      additionalRequests: ''
    }
  });

  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    address: '',
    city: '',
    state: '',
    pincode: '',
    venue_type: 'home'
  });

  const [budgetDetails, setBudgetDetails] = useState<BudgetDetails>({
    min: 5000,
    max: 15000,
    isFlexible: false
  });

  const eventTypes = [
    { value: 'birthday', label: 'Birthday Party', icon: '🎂' },
    { value: 'anniversary', label: 'Anniversary', icon: '💕' },
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'corporate', label: 'Corporate Event', icon: '💼' },
    { value: 'family_gathering', label: 'Family Gathering', icon: '👨‍👩‍👧‍👦' },
    { value: 'other', label: 'Other', icon: '🎉' }
  ];

  const cuisineOptions = [
    'Indian', 'Chinese', 'Italian', 'Continental', 'Mexican', 'Thai', 
    'Japanese', 'Mediterranean', 'French', 'American', 'Fusion'
  ];

  const venueTypes = [
    { value: 'home', label: 'Home' },
    { value: 'outdoor', label: 'Outdoor Venue' },
    { value: 'banquet_hall', label: 'Banquet Hall' },
    { value: 'office', label: 'Office' },
    { value: 'other', label: 'Other' }
  ];

  const eventTypeMapping = {
    'birthday': 'private_dining',
    'anniversary': 'private_dining', 
    'wedding': 'catering',
    'corporate': 'catering',
    'family_gathering': 'private_dining',
    'other': 'private_dining'
  };

  useEffect(() => {
    if (preferredChefId) {
      loadChefDetails(preferredChefId);
    }
    // Initialize phone from stored user
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u?.phone) setUserPhone(u.phone);
      } catch {}
    }
  }, [preferredChefId]);

  const loadChefDetails = async (chefId: string) => {
    try {
      const response = await fetch('/api/chef-services/chefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chefId })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedChef(data.chef);
      }
    } catch (error) {
      console.error('Error loading chef details:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book a chef');
        return;
      }

      // Ensure user has phone number; if missing, update profile first
      const userStr = localStorage.getItem('user');
      let needsPhoneUpdate = false;
      let currentUser: any = null;
      if (userStr) {
        try { currentUser = JSON.parse(userStr); } catch {}
      }
      
      // Check if user has phone number in profile
      const hasPhoneInProfile = currentUser?.phone && currentUser.phone.trim().length >= 10;
      const hasPhoneInForm = userPhone && userPhone.trim().length >= 10;
      
      if (!hasPhoneInProfile) {
        if (!hasPhoneInForm) {
          toast.error('Please enter a valid contact number (minimum 10 digits)');
          return;
        }
        needsPhoneUpdate = true;
      }
      
      if (needsPhoneUpdate) {
        try {
          console.log('Updating user phone number:', userPhone.trim());
          const upd = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: userPhone.trim() })
          });
          if (upd.ok) {
            const updData = await upd.json();
            const updatedUser = { ...(currentUser || {}), ...updData.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('Phone number updated successfully:', updatedUser.phone);
          } else {
            const errorData = await upd.json();
            console.error('Phone update failed:', errorData);
            toast.error('Failed to save phone number: ' + (errorData.error || 'Unknown error'));
            return;
          }
        } catch (e) {
          console.error('Phone update error', e);
          toast.error('Failed to save phone number');
          return;
        }
      }

      // Check if we have a specific chef selected
      const chefId = preferredChefId || selectedChef?._id;
      
      // If no chef is selected, we'll make a general request
      if (!chefId) {
        console.log('No specific chef selected - creating general request');
      } else {
        // Check if selected chef has required details
        if (selectedChef && !selectedChef.phone) {
          toast.error('Selected chef does not have a phone number. Please choose another chef or contact support.');
          return;
        }
      }

      if (!eventDetails.type) {
        toast.error('Please select an event type');
        return;
      }

      if (!eventDetails.date) {
        toast.error('Please select event date and time');
        return;
      }

      // Check if date is in the past
      const selectedDate = new Date(eventDetails.date);
      const now = new Date();
      if (selectedDate <= now) {
        toast.error('Please select a future date and time for your event');
        return;
      }

      if (eventDetails.cuisine.length === 0) {
        // Make cuisine optional - set default if none selected
        eventDetails.cuisine = ['Indian']; // Default cuisine
      }

      // Validate duration and guest count
      if (eventDetails.duration < 1 || eventDetails.duration > 24) {
        toast.error('Duration must be between 1 and 24 hours');
        return;
      }

      if (eventDetails.guestCount < 1 || eventDetails.guestCount > 200) {
        toast.error('Guest count must be between 1 and 200');
        return;
      }

      if (!locationDetails.address || !locationDetails.city || !locationDetails.state || !locationDetails.pincode) {
        toast.error('Please fill in complete location details');
        return;
      }

      // Extract date and time from datetime-local input
      const eventDateTime = new Date(eventDetails.date);
      const eventDateOnly = eventDateTime.toISOString().split('T')[0];
      // Ensure time is in 24-hour format (HH:MM)
      const eventTimeOnly = eventDateTime.toTimeString().slice(0, 5);

      console.log('Date parsing:', {
        original: eventDetails.date,
        parsed: eventDateTime,
        dateOnly: eventDateOnly,
        timeOnly: eventTimeOnly
      });

      // Determine which API endpoint to use based on whether a specific chef is selected
      const isGeneralRequest = !chefId;
      const apiEndpoint = isGeneralRequest ? '/api/chef-services/general-request' : '/api/chef-services/book';
      
      const bookingData = {
        ...(chefId && { chefId }), // Only include chefId if it exists
        eventType: eventTypeMapping[eventDetails.type as keyof typeof eventTypeMapping] || 'private_dining',
        eventDate: eventDateOnly,
        eventTime: eventTimeOnly,
        duration: eventDetails.duration,
        guestCount: eventDetails.guestCount,
        cuisine: eventDetails.cuisine.length > 0 ? eventDetails.cuisine : ['Indian'], // Ensure cuisine is always an array
        venue: {
          type: locationDetails.venue_type === 'home' ? 'customer_home' : 'external_venue',
          address: {
            street: locationDetails.address,
            city: locationDetails.city,
            state: locationDetails.state,
            zipCode: locationDetails.pincode
          }
        },
        specialRequests: eventDetails.specialRequests || '',
        dietaryRestrictions: (eventDetails.dietaryRestrictions || []).map(restriction => restriction.toLowerCase()),
        customMenu: eventDetails.customMenu.isCustom ? eventDetails.customMenu : undefined,
        paymentMethod: 'cod',
        ...(isGeneralRequest && { budget: budgetDetails }) // Include budget for general requests
      };

      console.log('Sending booking request with data:', JSON.stringify(bookingData, null, 2));
      console.log('Using API endpoint:', apiEndpoint);
      console.log('User phone from form:', userPhone);
      console.log('User phone from profile:', currentUser?.phone);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking successful:', result);
        
        if (isGeneralRequest) {
          toast.success('General chef request sent successfully! Available chefs will be notified.');
        } else {
          toast.success('Chef booking request sent successfully!');
        }
        
        setStep(5); // Success step
      } else {
        const error = await response.json();
        console.error('Booking failed:', error);
        console.error('Response status:', response.status);
        console.error('Error details:', error);
        toast.error(error.error || 'Failed to book chef');
      }
    } catch (error) {
      console.error('Error booking chef:', error);
      toast.error('Failed to book chef');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleCuisine = (cuisine: string) => {
    setEventDetails(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(cuisine)
        ? prev.cuisine.filter(c => c !== cuisine)
        : [...prev.cuisine, cuisine]
    }));
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setEventDetails(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return eventDetails.type && eventDetails.title && eventDetails.description && 
               eventDetails.date; // Removed cuisine requirement
      case 2:
        return locationDetails.address && locationDetails.city && 
               locationDetails.state && locationDetails.pincode;
      case 3:
        return budgetDetails.min > 0 && budgetDetails.max > budgetDetails.min;
      case 4:
        // For step 4, we need either a selected chef OR all required fields for general request
        const hasSelectedChef = preferredChefId || selectedChef?._id;
        const hasRequiredFields = eventDetails.type && eventDetails.date && 
                                 locationDetails.address &&
                                 locationDetails.city && locationDetails.state && locationDetails.pincode;
        const hasPhone = JSON.parse(localStorage.getItem('user') || '{}')?.phone || (userPhone && userPhone.trim().length >= 10);
        
        // If no chef is selected, we're making a general request
        if (!hasSelectedChef) {
          return hasRequiredFields && !!hasPhone;
        }
        
        // If chef is selected, we need all required fields
        return hasSelectedChef && hasRequiredFields && !!hasPhone;
      default:
        return true;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 shadow-sm border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
                             <div className="flex items-center space-x-2">
                 <ChefHat className="h-6 w-6 text-yellow-500" />
                 <Image
                   src="/images/logo.png"
                   alt="FoodFly"
                   width={24}
                   height={24}
                   className="rounded"
                 />
                 <h1 className={`${cormorant.className} text-xl font-bold text-white`}>Book a Chef</h1>
               </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {step !== 5 && (
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? 'bg-yellow-500' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>Event Details</span>
                <span>Location</span>
                <span>Budget</span>
                <span>Review</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Selected Chef Display */}
          {selectedChef && step !== 5 && (
            <div className="bg-gray-900 rounded-lg shadow-sm p-6 mb-8 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Selected Chef</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  {selectedChef.profilePhoto ? (
                    <Image
                      src={selectedChef.profilePhoto}
                      alt={selectedChef.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <ChefHat className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{selectedChef.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{selectedChef.chefProfile.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{selectedChef.chefProfile.experience} years experience</span>
                    <span>•</span>
                    <span>₹{selectedChef.chefProfile.priceRange.min.toLocaleString()} - ₹{selectedChef.chefProfile.priceRange.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

                     {/* Step 1: Event Details */}
           {step === 1 && (
             <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
               <h2 className={`${cormorant.className} text-2xl font-bold text-white mb-6`}>Event Details</h2>
              
              <div className="space-y-6">
                                 {/* Event Type */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-3">Event Type</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {eventTypes.map((type) => (
                       <button
                         key={type.value}
                         onClick={() => setEventDetails(prev => ({ ...prev, type: type.value }))}
                         className={`p-4 border rounded-lg text-left hover:border-yellow-500 ${
                           eventDetails.type === type.value 
                             ? 'border-yellow-500 bg-yellow-900/20' 
                             : 'border-gray-700 bg-gray-800'
                         }`}
                       >
                         <div className="text-2xl mb-2">{type.icon}</div>
                         <div className="text-sm font-medium text-white">{type.label}</div>
                       </button>
                     ))}
                   </div>
                 </div>

                                 {/* Event Title */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                   <input
                     type="text"
                     value={eventDetails.title}
                     onChange={(e) => setEventDetails(prev => ({ ...prev, title: e.target.value }))}
                     placeholder="e.g., John's 30th Birthday Party"
                     className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                   />
                 </div>

                                 {/* Event Description */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Event Description</label>
                   <textarea
                     value={eventDetails.description}
                     onChange={(e) => setEventDetails(prev => ({ ...prev, description: e.target.value }))}
                     placeholder="Describe your event, any special requirements, theme, etc."
                     rows={3}
                     className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                   />
                 </div>

                                 {/* Date, Duration, Guest Count */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Event Date</label>
                     <input
                       type="datetime-local"
                       value={eventDetails.date}
                       onChange={(e) => setEventDetails(prev => ({ ...prev, date: e.target.value }))}
                       min={new Date().toISOString().slice(0, 16)}
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Duration (hours)</label>
                     <input
                       type="number"
                       value={Number.isFinite(eventDetails.duration) ? eventDetails.duration : 0}
                       onChange={(e) => {
                         const v = e.target.value;
                         const n = v === '' ? 0 : parseInt(v, 10);
                         setEventDetails(prev => ({ ...prev, duration: Number.isFinite(n) ? n : 0 }));
                       }}
                       min="1"
                       max="24"
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Guest Count</label>
                     <input
                       type="number"
                       value={Number.isFinite(eventDetails.guestCount) ? eventDetails.guestCount : 0}
                       onChange={(e) => {
                         const v = e.target.value;
                         const n = v === '' ? 0 : parseInt(v, 10);
                         setEventDetails(prev => ({ ...prev, guestCount: Number.isFinite(n) ? n : 0 }));
                       }}
                       min="1"
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white"
                     />
                   </div>
                 </div>

                                 {/* Cuisine Selection */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-3">
                     Preferred Cuisines (Optional)
                     <span className="text-sm font-normal text-gray-400 block">Select your preferred cuisines or leave blank for chef's recommendation</span>
                   </label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                     {cuisineOptions.map((cuisine) => (
                       <button
                         key={cuisine}
                         onClick={() => toggleCuisine(cuisine)}
                         className={`px-3 py-2 border rounded-lg text-sm font-semibold transition-all ${
                           eventDetails.cuisine.includes(cuisine)
                             ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300 shadow-md'
                             : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-yellow-500 hover:bg-yellow-900/20'
                         }`}
                       >
                         {cuisine}
                       </button>
                     ))}
                   </div>
                   {eventDetails.cuisine.length === 0 && (
                     <p className="text-sm text-gray-400 mt-2">
                       No cuisines selected - chef will recommend based on your event type
                     </p>
                   )}
                 </div>

                                 {/* Special Requests */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests (Optional)</label>
                   <textarea
                     value={eventDetails.specialRequests}
                     onChange={(e) => setEventDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                     placeholder="Any specific dishes, presentation style, or special requirements..."
                     rows={2}
                     className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                   />
                 </div>

                                 {/* Dietary Restrictions */}
                 <div className="space-y-3">
                   <label className="block text-lg font-semibold text-gray-300 mb-3">
                     Dietary Restrictions (Optional)
                     <span className="text-sm font-normal text-gray-400 block">Select any dietary requirements for your event</span>
                   </label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
                     {[
                       { label: 'Vegetarian', value: 'vegetarian' },
                       { label: 'Vegan', value: 'vegan' },
                       { label: 'Gluten-Free', value: 'gluten-free' },
                       { label: 'Dairy-Free', value: 'dairy-free' },
                       { label: 'Nut-Free', value: 'nut-free' },
                       { label: 'Halal', value: 'halal' },
                       { label: 'Kosher', value: 'kosher' },
                       { label: 'Keto', value: 'keto' }
                     ].map((restriction) => (
                       <button
                         key={restriction.value}
                         type="button"
                         onClick={() => toggleDietaryRestriction(restriction.value)}
                         className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                           eventDetails.dietaryRestrictions.includes(restriction.value)
                             ? 'border-yellow-500 bg-yellow-500 text-black shadow-lg scale-105'
                             : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-yellow-500 hover:bg-yellow-900/20'
                         }`}
                       >
                         {restriction.label}
                       </button>
                     ))}
                   </div>
                   {eventDetails.dietaryRestrictions.length > 0 && (
                     <p className="text-sm text-yellow-400 font-medium">
                       ✓ {eventDetails.dietaryRestrictions.length} restriction{eventDetails.dietaryRestrictions.length > 1 ? 's' : ''} selected
                     </p>
                   )}
                 </div>

                                 {/* Menu Customization */}
                 <div className="space-y-4">
                   <div className="flex items-center space-x-3">
                     <input
                       type="checkbox"
                       id="customMenu"
                       checked={eventDetails.customMenu.isCustom}
                       onChange={(e) => setEventDetails(prev => ({
                         ...prev,
                         customMenu: { ...prev.customMenu, isCustom: e.target.checked }
                       }))}
                       className="h-5 w-5 text-yellow-500 border-2 border-gray-600 rounded focus:ring-yellow-500 bg-gray-800 checked:bg-yellow-500 checked:border-yellow-500"
                     />
                     <label htmlFor="customMenu" className="text-lg font-semibold text-gray-300">
                       Customize Your Menu
                     </label>
                   </div>
                   
                   {eventDetails.customMenu.isCustom && (
                     <div className="p-6 bg-yellow-900/20 border-2 border-yellow-800 rounded-lg space-y-4">
                       <p className="text-sm text-yellow-300 font-medium mb-4">
                         Work with your chef to create a personalized menu for your event
                       </p>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Appetizers */}
                         <div>
                           <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Appetizers</label>
                           <textarea
                             value={eventDetails.customMenu.appetizers.join(', ')}
                             onChange={(e) => setEventDetails(prev => ({
                               ...prev,
                               customMenu: {
                                 ...prev.customMenu,
                                 appetizers: e.target.value.split(', ').filter(item => item.trim())
                               }
                             }))}
                             placeholder="e.g., Bruschetta, Spring Rolls, Cheese Platter"
                             rows={2}
                             className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                           />
                         </div>

                                                 {/* Main Courses */}
                         <div>
                           <label className="block text-sm font-medium text-gray-300 mb-2">Main Courses</label>
                           <textarea
                             value={eventDetails.customMenu.mainCourses.join(', ')}
                             onChange={(e) => setEventDetails(prev => ({
                               ...prev,
                               customMenu: {
                                 ...prev.customMenu,
                                 mainCourses: e.target.value.split(', ').filter(item => item.trim())
                               }
                             }))}
                             placeholder="e.g., Grilled Salmon, Chicken Tikka, Pasta Primavera"
                             rows={2}
                             className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                           />
                         </div>

                         {/* Desserts */}
                         <div>
                           <label className="block text-sm font-medium text-gray-300 mb-2">Desserts</label>
                           <textarea
                             value={eventDetails.customMenu.desserts.join(', ')}
                             onChange={(e) => setEventDetails(prev => ({
                               ...prev,
                               customMenu: {
                                 ...prev.customMenu,
                                 desserts: e.target.value.split(', ').filter(item => item.trim())
                               }
                             }))}
                             placeholder="e.g., Chocolate Cake, Tiramisu, Fresh Fruit"
                             rows={2}
                             className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                           />
                         </div>

                         {/* Beverages */}
                         <div>
                           <label className="block text-sm font-medium text-gray-300 mb-2">Beverages</label>
                           <textarea
                             value={eventDetails.customMenu.beverages.join(', ')}
                             onChange={(e) => setEventDetails(prev => ({
                               ...prev,
                               customMenu: {
                                 ...prev.customMenu,
                                 beverages: e.target.value.split(', ').filter(item => item.trim())
                               }
                             }))}
                             placeholder="e.g., Fresh Juices, Wine, Cocktails, Tea/Coffee"
                             rows={2}
                             className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                           />
                         </div>
                      </div>

                                             {/* Additional Menu Requests */}
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Additional Menu Requests</label>
                         <textarea
                           value={eventDetails.customMenu.additionalRequests}
                           onChange={(e) => setEventDetails(prev => ({
                             ...prev,
                             customMenu: { ...prev.customMenu, additionalRequests: e.target.value }
                           }))}
                           placeholder="Any specific cooking methods, presentation styles, or special menu requirements..."
                           rows={3}
                           className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                         />
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

                     {/* Step 2: Location Details */}
           {step === 2 && (
             <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
               <h2 className={`${cormorant.className} text-2xl font-bold text-white mb-6`}>Event Location</h2>
              
              <div className="space-y-6">
                                 {/* Venue Type */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-3">Venue Type</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {venueTypes.map((venue) => (
                       <button
                         key={venue.value}
                         onClick={() => setLocationDetails(prev => ({ ...prev, venue_type: venue.value }))}
                         className={`p-4 border rounded-lg text-center ${
                           locationDetails.venue_type === venue.value 
                             ? 'border-yellow-500 bg-yellow-900/20' 
                             : 'border-gray-700 bg-gray-800 hover:border-yellow-500'
                         }`}
                       >
                         <div className="text-sm font-medium text-white">{venue.label}</div>
                       </button>
                     ))}
                   </div>
                 </div>

                                 {/* Address */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Full Address</label>
                   <textarea
                     value={locationDetails.address}
                     onChange={(e) => setLocationDetails(prev => ({ ...prev, address: e.target.value }))}
                     placeholder="Enter complete address including building name, street, landmark"
                     rows={3}
                     className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                   />
                 </div>

                 {/* City, State, Pincode */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                     <input
                       type="text"
                       value={locationDetails.city}
                       onChange={(e) => setLocationDetails(prev => ({ ...prev, city: e.target.value }))}
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                     <input
                       type="text"
                       value={locationDetails.state}
                       onChange={(e) => setLocationDetails(prev => ({ ...prev, state: e.target.value }))}
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
                     <input
                       type="text"
                       value={locationDetails.pincode}
                       onChange={(e) => setLocationDetails(prev => ({ ...prev, pincode: e.target.value }))}
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                     />
                   </div>
                 </div>
              </div>
            </div>
          )}

                     {/* Step 3: Budget */}
           {step === 3 && (
             <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
               <h2 className={`${cormorant.className} text-2xl font-bold text-white mb-6`}>Budget Range</h2>
              
              <div className="space-y-6">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Budget (₹)</label>
                     <input
                       type="number"
                       value={Number.isFinite(budgetDetails.min) ? budgetDetails.min : 0}
                       onChange={(e) => {
                         const v = e.target.value;
                         const n = v === '' ? 0 : parseInt(v, 10);
                         setBudgetDetails(prev => ({ ...prev, min: Number.isFinite(n) ? n : prev.min }));
                       }}
                       min="1000"
                       step="500"
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Budget (₹)</label>
                     <input
                       type="number"
                       value={Number.isFinite(budgetDetails.max) ? budgetDetails.max : 0}
                       onChange={(e) => {
                         const v = e.target.value;
                         const n = v === '' ? 0 : parseInt(v, 10);
                         setBudgetDetails(prev => ({ ...prev, max: Number.isFinite(n) ? n : prev.max }));
                       }}
                       min="1000"
                       step="500"
                       className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white"
                     />
                   </div>
                 </div>

                 <div className="flex items-center space-x-3">
                   <input
                     type="checkbox"
                     id="flexible"
                     checked={budgetDetails.isFlexible}
                     onChange={(e) => setBudgetDetails(prev => ({ ...prev, isFlexible: e.target.checked }))}
                     className="h-4 w-4 text-yellow-500 border-gray-600 rounded focus:ring-yellow-500 bg-gray-800 checked:bg-yellow-500 checked:border-yellow-500"
                   />
                   <label htmlFor="flexible" className="text-sm text-gray-300">
                     My budget is flexible for the right chef
                   </label>
                 </div>

                 <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800">
                   <h3 className="text-sm font-medium text-yellow-300 mb-2">What's included in the price?</h3>
                   <ul className="text-sm text-gray-300 space-y-1">
                     <li>• Chef's cooking services</li>
                     <li>• Menu planning and preparation</li>
                     <li>• Serving and presentation</li>
                     <li>• Basic cleanup</li>
                     <li>• Ingredients and groceries (may vary by chef)</li>
                   </ul>
                 </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="bg-gray-900 rounded-lg shadow-lg border-2 border-yellow-500 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-800">
                  <ChefHat className="h-8 w-8 text-yellow-400" />
                </div>
                <h2 className={`${cormorant.className} text-3xl font-bold text-white mb-2`}>Review Your Request</h2>
                <p className="text-gray-300">Please review all details before submitting your chef booking request</p>
              </div>

              {/* Phone capture - always visible */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number (required)</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">We need your phone number so your chef can coordinate details.</p>
              </div>
              
              <div className="space-y-6">
                {/* Event Summary */}
                <div className="border border-yellow-500 rounded-lg p-6 bg-gradient-to-r from-yellow-900/20 to-red-900/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-yellow-400 mr-2" />
                    Event Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Event:</span>
                      <span className="ml-2 font-bold text-white">{eventDetails.title}</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Type:</span>
                      <span className="ml-2 font-bold text-white">{eventTypes.find(t => t.value === eventDetails.type)?.label}</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Date:</span>
                      <span className="ml-2 font-bold text-white">{new Date(eventDetails.date).toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Duration:</span>
                      <span className="ml-2 font-bold text-white">{eventDetails.duration} hours</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Guests:</span>
                      <span className="ml-2 font-bold text-white">{eventDetails.guestCount} people</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Cuisines:</span>
                      <span className="ml-2 font-bold text-yellow-400">{eventDetails.cuisine.join(', ')}</span>
                    </div>
                  </div>
                  {eventDetails.description && (
                    <div className="mt-4 bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Description:</span>
                      <p className="mt-2 text-white font-medium">{eventDetails.description}</p>
                    </div>
                  )}
                  {eventDetails.customMenu.isCustom && (
                    <div className="mt-4 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 shadow-sm">
                      <span className="text-yellow-300 font-semibold flex items-center">
                        Custom Menu Requested
                      </span>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {eventDetails.customMenu.appetizers.length > 0 && (
                          <div>
                            <span className="font-medium text-yellow-400">Appetizers:</span>
                            <p className="text-gray-300">{eventDetails.customMenu.appetizers.join(', ')}</p>
                          </div>
                        )}
                        {eventDetails.customMenu.mainCourses.length > 0 && (
                          <div>
                            <span className="font-medium text-yellow-400">Main Courses:</span>
                            <p className="text-gray-300">{eventDetails.customMenu.mainCourses.join(', ')}</p>
                          </div>
                        )}
                        {eventDetails.customMenu.desserts.length > 0 && (
                          <div>
                            <span className="font-medium text-yellow-400">Desserts:</span>
                            <p className="text-gray-300">{eventDetails.customMenu.desserts.join(', ')}</p>
                          </div>
                        )}
                        {eventDetails.customMenu.beverages.length > 0 && (
                          <div>
                            <span className="font-medium text-yellow-400">Beverages:</span>
                            <p className="text-gray-300">{eventDetails.customMenu.beverages.join(', ')}</p>
                          </div>
                        )}
                      </div>
                      {eventDetails.customMenu.additionalRequests && (
                        <div className="mt-3">
                          <span className="font-medium text-yellow-400">Additional Requests:</span>
                          <p className="text-gray-300 text-sm">{eventDetails.customMenu.additionalRequests}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Location Summary */}
                <div className="border border-blue-500 rounded-lg p-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                    Location
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Venue Type:</span>
                      <span className="ml-2 font-bold text-white">{venueTypes.find(v => v.value === locationDetails.venue_type)?.label}</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <span className="text-gray-300 font-semibold">Address:</span>
                      <p className="mt-1 font-bold text-white">{locationDetails.address}, {locationDetails.city}, {locationDetails.state} - {locationDetails.pincode}</p>
                    </div>
                  </div>
                </div>

                                 {/* Budget Summary */}
                 <div className="border border-yellow-500 rounded-lg p-6 bg-gradient-to-r from-yellow-900/20 to-red-900/20">
                   <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                     <span className="text-yellow-400 mr-2 font-bold">₹</span>
                     Budget
                   </h3>
                   <div className="space-y-3">
                     <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                       <span className="text-gray-300 font-semibold">Range:</span>
                       <span className="ml-2 font-bold text-2xl text-yellow-400">₹{budgetDetails.min.toLocaleString()} - ₹{budgetDetails.max.toLocaleString()}</span>
                     </div>
                     {budgetDetails.isFlexible && (
                       <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                         <span className="text-gray-300 font-semibold">Budget Flexibility:</span>
                         <span className="ml-2 font-bold text-yellow-400">Flexible for the right chef</span>
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 5 && (
            <div className="bg-gray-900 rounded-lg shadow-sm p-6 text-center border border-gray-800">
              <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-800">
                <Check className="h-8 w-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Request Sent Successfully!</h2>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                {preferredChefId || selectedChef?._id 
                  ? "Your chef booking request has been sent. You'll receive a notification once the chef responds."
                  : "Your general chef request has been sent. Available chefs will be notified and the first to accept will be assigned to your event."
                }
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => window.location.href = '/profile'}
                  className="bg-yellow-500 text-black py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200 font-semibold"
                >
                  View My Requests
                </button>
                <button
                  onClick={() => window.location.href = '/chef-services'}
                  className="border border-yellow-500 text-yellow-400 py-2 px-6 rounded-lg hover:bg-yellow-500 hover:text-black transition duration-200"
                >
                  Book Another Chef
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step !== 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-2 rounded-lg border ${
                  step === 1 
                    ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                Previous
              </button>
              
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-6 py-2 rounded-lg ${
                    isStepValid()
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400 font-semibold'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isStepValid()}
                  className={`px-6 py-2 rounded-lg ${
                    loading || !isStepValid()
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-black hover:bg-yellow-400 font-semibold'
                  }`}
                >
                  {loading ? 'Sending Request...' : 'Send Request'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

export default function BookChefPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookChefPageContent />
    </Suspense>
  );
}