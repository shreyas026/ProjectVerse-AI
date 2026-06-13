import { useState } from 'react'
import { Settings, Home, User, Zap, Activity } from 'lucide-react'

export default function Neura() {
  const [activeScreen, setActiveScreen] = useState<'sensor' | 'glasses' | 'activity'>('glasses')

  const renderScreen = () => {
    switch (activeScreen) {
      case 'sensor':
        return <NeuralSensorScreen />
      case 'glasses':
        return <SmartGlassesScreen />
      case 'activity':
        return <NeuralActivityScreen />
      default:
        return <SmartGlassesScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">NEURA</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {renderScreen()}
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setActiveScreen('sensor')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeScreen === 'sensor'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Neural Sensor
          </button>
          <button
            onClick={() => setActiveScreen('glasses')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeScreen === 'glasses'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Smart Glasses
          </button>
          <button
            onClick={() => setActiveScreen('activity')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeScreen === 'activity'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Neural Activity
          </button>
        </div>
      </div>
    </div>
  )
}

function NeuralSensorScreen() {
  return (
    <div className="lg:col-span-1 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 space-y-6">
        {/* Status Header */}
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">9:41</div>
          <h2 className="text-xl font-bold text-gray-900">NEURA</h2>
        </div>

        {/* Main Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-48 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="text-6xl">👤</div>
            {/* Glasses overlay */}
            <div className="absolute top-20 left-0 right-0 flex justify-center">
              <div className="text-4xl">👓</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">Neural Sensor</span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-700">Touch Control</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Signal Strength</div>
            <div className="text-lg font-bold text-gray-900">81%</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Response Accuracy</div>
            <div className="text-lg font-bold text-gray-900">94%</div>
          </div>
        </div>

        {/* Status Text */}
        <p className="text-xs text-gray-500 text-center">
          NEURA device is connected and working stably
        </p>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
            <span className="text-lg">→</span>
          </button>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <button className="w-12 h-12 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center">
            ○
          </button>
        </div>

        {/* Swipe Hint */}
        <button className="w-full py-3 text-gray-600 text-sm font-medium border-t border-gray-200 mt-4">
          Swipe to Start →
        </button>
      </div>
    </div>
  )
}

function SmartGlassesScreen() {
  return (
    <div className="lg:col-span-1 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 space-y-6">
        {/* Header with settings and avatar */}
        <div className="flex justify-between items-start">
          <div className="text-xs text-gray-500">9:41</div>
          <Settings className="w-5 h-5 text-gray-400" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-sm font-bold">
            👨
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Smart Glasses</h2>
          <p className="text-xs text-gray-400">ID: NRG-529965261</p>
        </div>

        {/* Product Image */}
        <div className="flex justify-center py-4">
          <div className="text-6xl">👓</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">87%</div>
            <p className="text-xs text-gray-500 mt-1">Focus Stability</p>
            <p className="text-xs text-gray-400">Camera stabilization</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">53%</div>
            <p className="text-xs text-gray-500 mt-1">Signal Drift</p>
            <p className="text-xs text-gray-400">Recalibration variance</p>
          </div>
        </div>

        {/* Battery Section */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Battery</h3>
            <button className="text-gray-400 hover:text-gray-600">↗</button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">84%</span>
            <span className="text-xs text-gray-500">Updated 12s ago</span>
          </div>
          {/* Battery Chart */}
          <div className="h-12 bg-white rounded-lg flex items-end gap-1 p-2">
            {[45, 60, 50, 65, 55, 70, 60, 75, 65, 80, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>DAY</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center gap-4 pt-4">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function NeuralActivityScreen() {
  return (
    <div className="lg:col-span-1 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-xs text-gray-500">9:41</div>
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
            🧠
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Neural</h2>
          <p className="text-lg text-gray-400">Activity</p>
        </div>

        {/* Angle Visualization */}
        <div className="flex justify-center items-center gap-8 py-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">-70°</div>
            <div className="text-xs text-gray-500 mt-1">Left</div>
          </div>
          <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">👓</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">90°</div>
            <div className="text-xs text-gray-500 mt-1">Right</div>
          </div>
        </div>

        {/* Center angle */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">360°</div>
          <div className="text-xs text-gray-500 mt-1">Full rotation</div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">Signal Clarity</p>
            <div className="text-3xl font-bold text-gray-900">96%</div>
            <p className="text-xs text-gray-400 mt-2">Indicates how clearly NEURA is reading neural patterns</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">Response Latency</p>
            <div className="text-3xl font-bold text-gray-900">142<span className="text-lg">ms</span></div>
            <p className="text-xs text-gray-400 mt-2">Time taken to interpret neural input</p>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask NEURA anything..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <button className="text-gray-400 hover:text-gray-600">
            <span>↗</span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center gap-4 pt-4">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
