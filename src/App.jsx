import React, { useState, useEffect } from 'react';
import { 
  Home, Map, Bell, Settings, Search, MapPin, Clock, Cloud, 
  Sun, CloudRain, Train, Bus, ChevronRight, AlertTriangle,
  TrendingUp, Users, Navigation, RefreshCw, Star, StarOff,
  Check, X, Zap, Thermometer, Droplets, Wind, ArrowLeft,
  Filter, Layers, LocateFixed, Info, Share2, BellRing,
  Moon, Globe, HelpCircle, Shield, ChevronDown, Calendar,
  Target, ArrowRight, BarChart3, LayoutGrid, Compass
} from 'lucide-react';

// Malaysian Transport Data
const stations = [
  { id: 1, name: 'KL Sentral', type: 'LRT/MRT', line: 'Multiple Lines', crowd: 72, capacity: 500, passengers: 360, nextArrival: '2 min', lat: 3.1343, lng: 101.6865 },
  { id: 2, name: 'Pasar Seni', type: 'LRT', line: 'Kelana Jaya Line', crowd: 45, capacity: 300, passengers: 135, nextArrival: '4 min', lat: 3.1422, lng: 101.6958 },
  { id: 3, name: 'KLCC', type: 'LRT', line: 'Kelana Jaya Line', crowd: 85, capacity: 400, passengers: 340, nextArrival: '3 min', lat: 3.1579, lng: 101.7116 },
  { id: 4, name: 'Bukit Bintang', type: 'MRT', line: 'Kajang Line', crowd: 68, capacity: 350, passengers: 238, nextArrival: '5 min', lat: 3.1466, lng: 101.7108 },
  { id: 5, name: 'Masjid Jamek', type: 'LRT', line: 'Ampang Line', crowd: 55, capacity: 280, passengers: 154, nextArrival: '3 min', lat: 3.1495, lng: 101.6963 },
  { id: 6, name: 'Bangsar', type: 'LRT', line: 'Kelana Jaya Line', crowd: 32, capacity: 250, passengers: 80, nextArrival: '6 min', lat: 3.1246, lng: 101.6792 },
  { id: 7, name: 'Mid Valley', type: 'KTM', line: 'KTM Komuter', crowd: 58, capacity: 320, passengers: 186, nextArrival: '8 min', lat: 3.1178, lng: 101.6775 },
  { id: 8, name: 'TRX', type: 'MRT', line: 'Putrajaya Line', crowd: 42, capacity: 400, passengers: 168, nextArrival: '4 min', lat: 3.1425, lng: 101.7195 },
];

const busRoutes = [
  { id: 'B1', name: 'RapidBus T789', route: 'KL Sentral → Bangsar → Mid Valley', crowd: 58, capacity: 45, passengers: 26, nextArrival: '8 min' },
  { id: 'B2', name: 'RapidBus U90', route: 'Pasar Seni → Chinatown → Bukit Bintang', crowd: 78, capacity: 45, passengers: 35, nextArrival: '12 min' },
  { id: 'B3', name: 'GoKL Purple Line', route: 'Free City Bus - Bukit Bintang Loop', crowd: 42, capacity: 40, passengers: 17, nextArrival: '5 min' },
];

const hourlyPredictions = [
  { time: '6 AM', crowd: 25 }, { time: '7 AM', crowd: 55 }, { time: '8 AM', crowd: 88 },
  { time: '9 AM', crowd: 75 }, { time: '10 AM', crowd: 45 }, { time: '11 AM', crowd: 38 },
  { time: '12 PM', crowd: 52 }, { time: '1 PM', crowd: 48 }, { time: '2 PM', crowd: 42 },
  { time: '3 PM', crowd: 50 }, { time: '4 PM', crowd: 65 }, { time: '5 PM', crowd: 92 },
  { time: '6 PM', crowd: 85 }, { time: '7 PM', crowd: 68 }, { time: '8 PM', crowd: 45 },
  { time: '9 PM', crowd: 32 }, { time: '10 PM', crowd: 22 }, { time: '11 PM', crowd: 15 },
];

// Weekly pattern data for heatmap
const weeklyPatternData = {
  'Monday': [20, 45, 85, 72, 40, 35, 48, 45, 38, 48, 62, 90, 82, 65, 42, 30, 20, 12],
  'Tuesday': [22, 48, 88, 75, 42, 38, 52, 48, 42, 50, 65, 92, 85, 68, 45, 32, 22, 15],
  'Wednesday': [25, 50, 90, 78, 45, 40, 55, 50, 45, 52, 68, 88, 80, 62, 40, 28, 18, 12],
  'Thursday': [22, 48, 86, 74, 43, 38, 50, 46, 40, 48, 64, 90, 84, 66, 44, 30, 20, 14],
  'Friday': [25, 52, 82, 70, 45, 42, 55, 52, 48, 55, 70, 85, 78, 60, 48, 38, 28, 18],
  'Saturday': [15, 25, 35, 42, 48, 55, 62, 68, 72, 75, 78, 75, 70, 65, 58, 45, 35, 22],
  'Sunday': [12, 18, 25, 32, 38, 45, 52, 58, 60, 62, 65, 62, 58, 52, 45, 38, 28, 18],
};

const timeLabels = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];

const notifications = [
  { id: 1, type: 'alert', title: 'High Congestion Alert', message: 'KLCC station is 85% full. Consider alternative routes.', time: '5 min ago', read: false },
  { id: 2, type: 'weather', title: 'Weather Impact', message: 'Rain expected at 5PM. Crowd levels may increase by 15-20%.', time: '1 hour ago', read: false },
  { id: 3, type: 'suggestion', title: 'Best Time to Travel', message: 'Crowd at KL Sentral drops to 35% after 9:30 AM.', time: '2 hours ago', read: true },
  { id: 4, type: 'alert', title: 'Route Update', message: 'Kelana Jaya Line experiencing slight delays. Allow extra time.', time: '3 hours ago', read: true },
];

// Helper Functions
const getCrowdColor = (level) => {
  if (level <= 40) return '#34A853';
  if (level <= 70) return '#FBBC04';
  return '#EA4335';
};

const getCrowdBgColor = (level) => {
  if (level <= 40) return 'rgb(52, 168, 83)';
  if (level <= 70) return 'rgb(251, 188, 4)';
  return 'rgb(234, 67, 53)';
};

const getCrowdLabel = (level) => {
  if (level <= 40) return 'Low';
  if (level <= 70) return 'Moderate';
  return 'Overcrowded';
};

const getCrowdDescription = (level) => {
  if (level <= 40) return 'Plenty of seats available';
  if (level <= 70) return 'Some standing room';
  return 'Very packed, consider alternatives';
};

// Components
const CircularProgress = ({ percentage, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getCrowdColor(percentage)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.3s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: getCrowdColor(percentage) }}>{percentage}%</span>
        <span className="text-xs text-gray-500">{getCrowdLabel(percentage)}</span>
      </div>
    </div>
  );
};

const CrowdBar = ({ percentage, height = 40 }) => (
  <div className="w-6 rounded-t-md bg-gray-200 relative" style={{ height }}>
    <div 
      className="absolute bottom-0 w-full rounded-t-md transition-all duration-500"
      style={{ 
        height: `${percentage}%`, 
        backgroundColor: getCrowdColor(percentage),
        minHeight: '4px'
      }}
    />
  </div>
);

const StationCard = ({ station, onClick, showFavorite = false }) => {
  const [isFav, setIsFav] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all active:scale-98"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${getCrowdColor(station.crowd)}15` }}
          >
            {station.type?.includes('LRT') || station.type?.includes('MRT') || station.type?.includes('KTM') ? (
              <Train size={24} style={{ color: getCrowdColor(station.crowd) }} />
            ) : (
              <Bus size={24} style={{ color: getCrowdColor(station.crowd) }} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{station.name}</h3>
            <p className="text-sm text-gray-500">{station.line || station.route}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getCrowdColor(station.crowd) }}
              />
              <span className="font-bold" style={{ color: getCrowdColor(station.crowd) }}>
                {station.crowd}%
              </span>
            </div>
            <p className="text-xs text-gray-500">{station.nextArrival}</p>
          </div>
          {showFavorite && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFav(!isFav); }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isFav ? <Star size={20} fill="#FBBC04" color="#FBBC04" /> : <StarOff size={20} color="#9CA3AF" />}
            </button>
          )}
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

// Heatmap Cell Component
const HeatmapCell = ({ value, showValue = false }) => {
  const getHeatmapColor = (val) => {
    if (val <= 30) return 'bg-green-400';
    if (val <= 50) return 'bg-green-300';
    if (val <= 60) return 'bg-yellow-300';
    if (val <= 75) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <div 
      className={`w-full h-6 rounded-sm ${getHeatmapColor(value)} flex items-center justify-center transition-all hover:scale-110 hover:z-10 cursor-pointer`}
      title={`${value}% crowded`}
    >
      {showValue && <span className="text-xs font-bold text-white drop-shadow">{value}</span>}
    </div>
  );
};

// Main App Component
const PublicTransportCrowdingPredictor = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapFilter, setMapFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Smart Scheduler State
  const [schedulerData, setSchedulerData] = useState({
    origin: '',
    destination: '',
    arrivalTime: '09:00',
    result: null
  });

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    peakHours: true,
    overcrowded: true,
    weather: true,
    minutesBefore: 15
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Smart Scheduler Calculator
  const calculateBestDeparture = () => {
    const arrivalHour = parseInt(schedulerData.arrivalTime.split(':')[0]);
    const travelTime = 25; // Assume 25 min travel
    const bufferTime = 10; // Buffer for safety
    
    // Find lowest crowd time before arrival
    const departureHour = arrivalHour - 1;
    const crowdAtDeparture = hourlyPredictions.find(p => p.time.includes(`${departureHour > 12 ? departureHour - 12 : departureHour}`))?.crowd || 50;
    
    // Alternative times
    const alternatives = [
      { time: `${departureHour - 1}:30 AM`, crowd: Math.max(20, crowdAtDeparture - 25), savings: '20 min earlier, 25% less crowd' },
      { time: `${departureHour}:00 AM`, crowd: crowdAtDeparture, savings: 'Standard departure' },
      { time: `${departureHour}:15 AM`, crowd: Math.min(95, crowdAtDeparture + 10), savings: '15 min later, slightly busier' },
    ];

    setSchedulerData(prev => ({
      ...prev,
      result: {
        recommendedDeparture: `${departureHour}:35 AM`,
        expectedCrowd: Math.max(25, crowdAtDeparture - 15),
        arrivalTime: schedulerData.arrivalTime,
        travelTime: `${travelTime} min`,
        alternatives
      }
    }));
  };

  // Home Screen
  const HomeScreen = () => (
    <div className="flex flex-col gap-4 pb-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Where are you going?"
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Weather & Time Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Kuala Lumpur</p>
            <p className="text-3xl font-bold">{formatTime(currentTime)}</p>
            <p className="text-blue-100 text-sm mt-1">Tuesday, January 20</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Sun size={32} />
              <span className="text-3xl font-bold">32°C</span>
            </div>
            <p className="text-blue-100 text-sm mt-1">Partly Cloudy</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-blue-100">
              <CloudRain size={14} />
              <span>Rain expected 5PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setShowScheduler(true)}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Target size={24} className="text-purple-500" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Smart Scheduler</span>
        </button>
        <button 
          onClick={() => setActiveTab('heatmap')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <LayoutGrid size={24} className="text-orange-500" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Heatmap</span>
        </button>
        <button 
          onClick={() => setActiveTab('weekly')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
            <BarChart3 size={24} className="text-teal-500" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Weekly View</span>
        </button>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800">Best Time to Travel</h3>
            <p className="text-sm text-emerald-600 mt-1">
              Leave now or after 9:30 AM for lower crowds at KL Sentral (35% capacity)
            </p>
          </div>
        </div>
      </div>

      {/* Nearby Stations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Nearby Stations</h2>
          <button className="text-blue-500 text-sm font-medium flex items-center gap-1">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {stations.slice(0, 4).map(station => (
            <StationCard 
              key={station.id} 
              station={station} 
              onClick={() => { setSelectedStation(station); setActiveTab('detail'); }}
              showFavorite
            />
          ))}
        </div>
      </div>

      {/* Bus Routes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Nearby Buses</h2>
          <button className="text-blue-500 text-sm font-medium flex items-center gap-1">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {busRoutes.slice(0, 2).map(bus => (
            <StationCard 
              key={bus.id} 
              station={bus} 
              onClick={() => { setSelectedStation(bus); setActiveTab('detail'); }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Map Screen
  const MapScreen = () => (
    <div className="flex flex-col h-full -mx-4 -mt-4">
      {/* Filter Buttons */}
      <div className="absolute top-20 left-4 right-4 z-10 flex gap-2">
        {['all', 'LRT/MRT', 'Bus'].map(filter => (
          <button
            key={filter}
            onClick={() => setMapFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
              mapFilter === filter 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {filter === 'all' ? 'All' : filter}
          </button>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 bg-gray-100 relative" style={{ minHeight: '500px' }}>
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-green-50 opacity-50" />
        
        {/* Grid Lines (simulating map) */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Transit Line */}
        <svg className="absolute inset-0 w-full h-full">
          <path 
            d="M 60 150 Q 120 200 180 180 Q 240 160 280 220 Q 320 280 350 250" 
            stroke="#E91E63" 
            strokeWidth="4" 
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 100 100 L 180 180 L 280 220 L 350 300" 
            stroke="#2196F3" 
            strokeWidth="4" 
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Station Pins */}
        {stations.map((station, index) => (
          <div
            key={station.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
            style={{ 
              left: `${15 + (index * 12)}%`, 
              top: `${25 + (index % 3) * 20}%` 
            }}
            onClick={() => { setSelectedStation(station); setActiveTab('detail'); }}
          >
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                style={{ backgroundColor: getCrowdColor(station.crowd) }}
              >
                <Train size={18} className="text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
                <p className="text-xs font-semibold text-gray-800">{station.name}</p>
                <p className="text-xs text-center" style={{ color: getCrowdColor(station.crowd) }}>{station.crowd}%</p>
              </div>
            </div>
          </div>
        ))}

        {/* Current Location Button */}
        <button className="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <LocateFixed size={24} className="text-blue-500" />
        </button>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Crowd Level</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">Low (0-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600">Moderate (41-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-600">Overcrowded (71-100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Station Detail Screen
  const DetailScreen = () => {
    if (!selectedStation) return null;
    
    return (
      <div className="flex flex-col gap-4 pb-4 -mt-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{selectedStation.name}</h1>
            <p className="text-sm text-gray-500">{selectedStation.line || selectedStation.route}</p>
          </div>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Live Crowd Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">LIVE CROWD STATUS</h2>
          <div className="flex items-center justify-between">
            <CircularProgress percentage={selectedStation.crowd} size={140} strokeWidth={12} />
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: getCrowdColor(selectedStation.crowd) }}>
                {getCrowdLabel(selectedStation.crowd)}
              </p>
              <p className="text-gray-500 mt-1">{getCrowdDescription(selectedStation.crowd)}</p>
              <div className="mt-3 flex items-center gap-2 justify-end">
                <Users size={18} className="text-gray-400" />
                <span className="text-lg font-semibold text-gray-700">
                  ~{selectedStation.passengers}/{selectedStation.capacity}
                </span>
              </div>
              <p className="text-xs text-gray-400">estimated passengers</p>
            </div>
          </div>
          
          {selectedStation.crowd > 70 && (
            <button 
              onClick={() => setShowAlternatives(true)}
              className="w-full mt-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
              <AlertTriangle size={18} />
              View Alternative Options
            </button>
          )}
        </div>

        {/* Weather Impact */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CloudRain size={24} className="text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">Weather Impact</p>
              <p className="text-sm text-amber-600">Rain expected at 5PM - expect 15-20% higher crowds</p>
            </div>
          </div>
        </div>

        {/* Hourly Prediction */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">HOURLY PREDICTION</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {hourlyPredictions.map((pred, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <CrowdBar percentage={pred.crowd} height={60} />
                  <span className="text-xs text-gray-500">{pred.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Best Windows */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">RECOMMENDED TRAVEL WINDOWS</h2>
          <div className="flex flex-col gap-2">
            {[
              { time: '6:00 - 6:45 AM', crowd: 25 },
              { time: '10:00 - 11:30 AM', crowd: 38 },
              { time: '2:00 - 3:30 PM', crowd: 42 },
              { time: '8:30 - 10:00 PM', crowd: 32 },
            ].map((window, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-green-600" />
                  <span className="font-medium text-green-800">{window.time}</span>
                </div>
                <span className="text-green-600 font-semibold">{window.crowd}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Set Alert Button */}
        <button className="w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
          <BellRing size={20} />
          Set Alert When Crowd Drops
        </button>
      </div>
    );
  };

  // Alternatives Modal
  const AlternativesModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Route is Crowded</h2>
            <p className="text-gray-500">Here are better alternatives</p>
          </div>
        </div>

        {/* Current Selection */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-red-500 font-semibold mb-1">CURRENT SELECTION</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{selectedStation?.name}</p>
              <p className="text-sm text-gray-500">Now</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-500">{selectedStation?.crowd}%</p>
              <p className="text-xs text-red-400">Overcrowded</p>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        <div className="flex flex-col gap-3 mb-6">
          <p className="text-sm font-semibold text-gray-500">ALTERNATIVES</p>
          
          {/* Time Alternative */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-green-600" />
              <span className="text-xs text-green-600 font-semibold">DIFFERENT TIME</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Leave 25 mins later</p>
                <p className="text-sm text-gray-500">Depart at 9:30 AM</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-500">38%</p>
                <p className="text-xs text-green-500">Low crowd</p>
              </div>
            </div>
          </div>

          {/* Route Alternative */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation size={16} className="text-blue-600" />
              <span className="text-xs text-blue-600 font-semibold">DIFFERENT ROUTE</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Via Bangsar Station</p>
                <p className="text-sm text-gray-500">+5 min travel time</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-500">32%</p>
                <p className="text-xs text-blue-500">Low crowd</p>
              </div>
            </div>
          </div>

          {/* Combined Alternative */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-purple-600" />
              <span className="text-xs text-purple-600 font-semibold">BEST OPTION</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Pasar Seni + 15 min later</p>
                <p className="text-sm text-gray-500">Same total travel time</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-500">28%</p>
                <p className="text-xs text-purple-500">Very low</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAlternatives(false)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Proceed Anyway
          </button>
          <button 
            onClick={() => setShowAlternatives(false)}
            className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Choose Alternative
          </button>
        </div>
      </div>
    </div>
  );

  // Smart Scheduler Modal
  const SmartSchedulerModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target size={24} className="text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Smart Scheduler</h2>
              <p className="text-gray-500 text-sm">Find the best time to travel</p>
            </div>
          </div>
          <button 
            onClick={() => setShowScheduler(false)}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-gray-500 mb-2 block">FROM</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              <select 
                value={schedulerData.origin}
                onChange={(e) => setSchedulerData(prev => ({ ...prev, origin: e.target.value, result: null }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="">Select origin station</option>
                {stations.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ArrowRight size={16} className="text-gray-400 rotate-90" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 mb-2 block">TO</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
              <select 
                value={schedulerData.destination}
                onChange={(e) => setSchedulerData(prev => ({ ...prev, destination: e.target.value, result: null }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="">Select destination</option>
                {stations.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 mb-2 block">I NEED TO ARRIVE BY</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" size={20} />
              <input 
                type="time"
                value={schedulerData.arrivalTime}
                onChange={(e) => setSchedulerData(prev => ({ ...prev, arrivalTime: e.target.value, result: null }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={calculateBestDeparture}
          disabled={!schedulerData.origin || !schedulerData.destination}
          className="w-full py-4 bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <Zap size={20} />
          Find Best Departure Time
        </button>

        {/* Results */}
        {schedulerData.result && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 text-white">
              <p className="text-purple-100 text-sm mb-1">RECOMMENDED DEPARTURE</p>
              <p className="text-3xl font-bold">{schedulerData.result.recommendedDeparture}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span className="text-sm">{schedulerData.result.expectedCrowd}% crowd</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span className="text-sm">{schedulerData.result.travelTime}</span>
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-500">OTHER OPTIONS</p>
            {schedulerData.result.alternatives.map((alt, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{alt.time}</p>
                  <p className="text-xs text-gray-500">{alt.savings}</p>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    backgroundColor: `${getCrowdColor(alt.crowd)}20`,
                    color: getCrowdColor(alt.crowd)
                  }}
                >
                  {alt.crowd}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Weekly Pattern Screen
  const WeeklyPatternScreen = () => {
    const [selectedDay, setSelectedDay] = useState('Tuesday');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
      <div className="flex flex-col gap-4 pb-4 -mt-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Weekly Patterns</h1>
            <p className="text-sm text-gray-500">Compare crowd levels across the week</p>
          </div>
        </div>

        {/* Day Selector */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDay === day 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">{selectedDay.toUpperCase()} CROWD PATTERN</h2>
          <div className="space-y-2">
            {weeklyPatternData[selectedDay].map((crowd, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12">{timeLabels[index]}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${crowd}%`,
                      backgroundColor: getCrowdColor(crowd)
                    }}
                  />
                </div>
                <span className="text-xs font-semibold w-8" style={{ color: getCrowdColor(crowd) }}>{crowd}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Week Comparison */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">PEAK HOUR COMPARISON</h2>
          <div className="flex justify-between items-end h-40">
            {days.map((day, i) => {
              const peakCrowd = Math.max(...weeklyPatternData[day]);
              return (
                <div key={day} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full mx-1 rounded-t-lg transition-all duration-500"
                    style={{ 
                      height: `${peakCrowd}%`,
                      backgroundColor: getCrowdColor(peakCrowd),
                      maxWidth: '40px'
                    }}
                  />
                  <span className="text-xs text-gray-500">{day.slice(0, 1)}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">Peak hour crowd levels (8AM & 5PM)</p>
        </div>

        {/* Insights */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <h3 className="font-semibold text-teal-800 mb-2">Weekly Insights</h3>
          <ul className="text-sm text-teal-600 space-y-1">
            <li>• Wednesday has the highest peak crowds (90%)</li>
            <li>• Weekend mornings are 40% less crowded</li>
            <li>• Friday evenings clear up faster than other days</li>
          </ul>
        </div>
      </div>
    );
  };

  // Heatmap Screen
  const HeatmapScreen = () => {
    const [selectedStation, setSelectedStationLocal] = useState('KL Sentral');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
      <div className="flex flex-col gap-4 pb-4 -mt-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Crowd Heatmap</h1>
            <p className="text-sm text-gray-500">Visual overview of crowd patterns</p>
          </div>
        </div>

        {/* Station Selector */}
        <div className="relative">
          <select 
            value={selectedStation}
            onChange={(e) => setSelectedStationLocal(e.target.value)}
            className="w-full p-3 pr-10 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
          >
            {stations.map(s => (
              <option key={s.id} value={s.name}>{s.name} - {s.line}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Heatmap Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">WEEKLY HEATMAP</h2>
          
          {/* Time Labels */}
          <div className="flex gap-1 mb-2 ml-10">
            {['6', '8', '10', '12', '2', '4', '6', '8', '10'].map((t, i) => (
              <div key={i} className="flex-1 text-center text-xs text-gray-400">{t}</div>
            ))}
          </div>

          {/* Heatmap Rows */}
          <div className="space-y-1">
            {fullDays.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-8">{days[dayIndex]}</span>
                <div className="flex-1 flex gap-0.5">
                  {weeklyPatternData[day].map((crowd, hourIndex) => (
                    <HeatmapCell key={hourIndex} value={crowd} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-gray-400">Less crowded</span>
            <div className="flex gap-0.5">
              <div className="w-4 h-4 rounded bg-green-400" />
              <div className="w-4 h-4 rounded bg-green-300" />
              <div className="w-4 h-4 rounded bg-yellow-300" />
              <div className="w-4 h-4 rounded bg-orange-400" />
              <div className="w-4 h-4 rounded bg-red-500" />
            </div>
            <span className="text-xs text-gray-400">More crowded</span>
          </div>
        </div>

        {/* Best Times Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">BEST TIMES TO TRAVEL</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-600 font-semibold mb-1">WEEKDAYS</p>
              <p className="font-bold text-green-800">6:00 - 6:45 AM</p>
              <p className="font-bold text-green-800">10:00 - 11:00 AM</p>
              <p className="font-bold text-green-800">8:00 - 10:00 PM</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-semibold mb-1">WEEKENDS</p>
              <p className="font-bold text-blue-800">6:00 - 10:00 AM</p>
              <p className="font-bold text-blue-800">8:00 - 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* Worst Times Warning */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <AlertTriangle size={18} />
            Avoid These Times
          </h3>
          <div className="text-sm text-red-600 space-y-1">
            <p>• Weekday mornings: 7:30 - 9:00 AM (80-92%)</p>
            <p>• Weekday evenings: 5:00 - 6:30 PM (85-92%)</p>
          </div>
        </div>
      </div>
    );
  };

  // Predictions Screen
  const PredictScreen = () => {
    const [selectedDate, setSelectedDate] = useState('today');
    const [selectedRoute, setSelectedRoute] = useState(stations[0].name);
    
    return (
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Crowd Prediction</h1>
        
        {/* Route Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-sm font-semibold text-gray-500 mb-2 block">SELECT ROUTE</label>
          <div className="relative">
            <select 
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full p-3 pr-10 bg-gray-50 rounded-xl border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {stations.map(s => (
                <option key={s.id} value={s.name}>{s.name} - {s.line}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex gap-2">
          {['today', 'tomorrow', 'custom'].map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                selectedDate === date 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {date.charAt(0).toUpperCase() + date.slice(1)}
            </button>
          ))}
        </div>

        {/* Weather Forecast */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun size={32} className="text-amber-500" />
              <div>
                <p className="font-semibold text-gray-900">Partly Cloudy</p>
                <p className="text-sm text-gray-500">High: 33°C / Low: 25°C</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-blue-500">
                <CloudRain size={16} />
                <span className="text-sm">60%</span>
              </div>
              <p className="text-xs text-gray-400">Rain at 5PM</p>
            </div>
          </div>
        </div>

        {/* Full Day Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">FULL DAY PREDICTION</h2>
          <div className="space-y-2">
            {hourlyPredictions.map((pred, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-14">{pred.time}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                    style={{ 
                      width: `${pred.crowd}%`,
                      backgroundColor: getCrowdColor(pred.crowd)
                    }}
                  >
                    {pred.crowd > 30 && (
                      <span className="text-xs font-semibold text-white">{pred.crowd}%</span>
                    )}
                  </div>
                </div>
                {(pred.time === '8 AM' || pred.time === '5 PM') && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Peak</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Best Windows Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Check size={18} className="text-green-600" />
            Best Travel Windows
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {['6-7 AM', '10-11 AM', '2-3 PM', '8-10 PM'].map((time, i) => (
              <div key={i} className="bg-white/80 rounded-xl p-3 text-center">
                <p className="font-semibold text-green-700">{time}</p>
                <p className="text-xs text-green-500">Low crowd</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Alerts Screen
  const AlertsScreen = () => (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      
      {/* Alert Preferences */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 mb-4">ALERT PREFERENCES</h2>
        
        {[
          { key: 'peakHours', label: 'Notify before peak hours', icon: Clock },
          { key: 'overcrowded', label: 'Alert when route is overcrowded', icon: AlertTriangle },
          { key: 'weather', label: 'Weather impact alerts', icon: CloudRain },
        ].map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-gray-400" />
              <span className="text-gray-700">{label}</span>
            </div>
            <button
              onClick={() => setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                notifSettings[key] ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                notifSettings[key] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
        
        <div className="flex items-center justify-between py-3 mt-2">
          <span className="text-gray-700">Alert me before departure</span>
          <select 
            value={notifSettings.minutesBefore}
            onChange={(e) => setNotifSettings(prev => ({ ...prev, minutesBefore: e.target.value }))}
            className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 focus:outline-none"
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
          </select>
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3">RECENT ALERTS</h2>
        <div className="flex flex-col gap-3">
          {notifications.map(notif => (
            <div 
              key={notif.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                notif.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'alert' ? 'bg-red-100' :
                  notif.type === 'weather' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  {notif.type === 'alert' ? <AlertTriangle size={20} className="text-red-500" /> :
                   notif.type === 'weather' ? <CloudRain size={20} className="text-amber-500" /> :
                   <Zap size={20} className="text-green-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notification Preview */}
      <div className="bg-gray-900 rounded-2xl p-4 shadow-lg">
        <p className="text-xs text-gray-400 mb-2">NOTIFICATION PREVIEW</p>
        <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Train size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">Crowd Alert</p>
            <p className="text-gray-400 text-xs">KLCC station is now 85% full</p>
          </div>
          <span className="text-xs text-gray-500">now</span>
        </div>
      </div>
    </div>
  );

  // Settings Screen (Profile)
  const SettingsScreen = () => (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
        <p className="text-blue-100 text-sm mb-3">Your Travel Stats</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">47</p>
            <p className="text-xs text-blue-100">Trips</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-blue-100">Crowds Avoided</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">2.5h</p>
            <p className="text-xs text-blue-100">Time Saved</p>
          </div>
        </div>
      </div>

      {/* Saved Routes */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">SAVED ROUTES</h2>
        {[
          { from: 'KL Sentral', to: 'KLCC', time: 'Weekdays 8:00 AM' },
          { from: 'Bangsar', to: 'Bukit Bintang', time: 'Weekends' },
        ].map((route, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Navigation size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{route.from} → {route.to}</p>
                <p className="text-xs text-gray-500">{route.time}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        ))}
        <button className="w-full mt-3 py-2 text-blue-500 font-medium text-sm">
          + Add New Route
        </button>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {[
          { icon: Bell, label: 'Notification Settings', action: () => setActiveTab('alerts') },
          { icon: Globe, label: 'Language', value: 'English' },
          { icon: Moon, label: 'Dark Mode', toggle: true },
          { icon: Shield, label: 'Privacy Policy' },
          { icon: HelpCircle, label: 'Help & Support' },
          { icon: Info, label: 'About' },
        ].map(({ icon: Icon, label, value, toggle, action }, i) => (
          <button 
            key={i}
            onClick={action}
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-gray-400" />
              <span className="text-gray-700">{label}</span>
            </div>
            {value && <span className="text-gray-400 text-sm">{value}</span>}
            {toggle && (
              <div className="w-12 h-7 bg-gray-300 rounded-full relative">
                <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow" />
              </div>
            )}
            {!value && !toggle && <ChevronRight size={20} className="text-gray-400" />}
          </button>
        ))}
      </div>

      {/* Version */}
      <p className="text-center text-xs text-gray-400">
        WeBUG Transit Predictor v1.0.0 • Made for Smart Cities
      </p>
    </div>
  );

  // Render current screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'map': return <MapScreen />;
      case 'predict': return <PredictScreen />;
      case 'alerts': return <AlertsScreen />;
      case 'settings': return <SettingsScreen />;
      case 'detail': return <DetailScreen />;
      case 'weekly': return <WeeklyPatternScreen />;
      case 'heatmap': return <HeatmapScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {/* Phone Frame */}
      <div className="w-full max-w-sm bg-gray-50 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800 relative">
        {/* Status Bar */}
        <div className="bg-gray-800 px-6 py-2 flex items-center justify-between">
          <span className="text-white text-xs font-medium">{formatTime(currentTime)}</span>
          <div className="w-20 h-6 bg-gray-900 rounded-full" /> {/* Notch */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border-2 border-white rounded-sm relative">
              <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

        {/* App Header */}
        {activeTab !== 'detail' && activeTab !== 'map' && activeTab !== 'weekly' && activeTab !== 'heatmap' && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Train size={18} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">WeBUG Transit</span>
            </div>
            <button 
              onClick={handleRefresh}
              className={`p-2 hover:bg-gray-100 rounded-full transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div 
          className="bg-gray-50 px-4 pt-4 overflow-y-auto"
          style={{ height: activeTab === 'map' ? '580px' : '520px' }}
        >
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white px-4 py-3 flex items-center justify-around border-t border-gray-100">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'map', icon: Map, label: 'Map' },
            { id: 'predict', icon: TrendingUp, label: 'Predict' },
            { id: 'alerts', icon: Bell, label: 'Alerts', badge: 2 },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                activeTab === id ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon size={22} />
                {badge && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {badge}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showAlternatives && <AlternativesModal />}
      {showScheduler && <SmartSchedulerModal />}

      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default PublicTransportCrowdingPredictor;
