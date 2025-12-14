import { useState } from 'react';

export default function CircularTimePicker({ onSubmit, onCancel }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState('PM');
  const [mode, setMode] = useState('hour'); // 'hour' or 'minute'

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleClockClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;
    
    if (mode === 'hour') {
      const hour = Math.round(angle / 30) || 12;
      setSelectedHour(hour);
    } else {
      const minute = Math.round(angle / 30) * 5;
      setSelectedMinute(minute === 60 ? 0 : minute);
    }
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    const hour24 = period === 'AM' 
      ? (selectedHour === 12 ? 0 : selectedHour)
      : (selectedHour === 12 ? 12 : selectedHour + 12);
    const time = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onSubmit(selectedDate, time);
  };

  const getNumberPosition = (index, total) => {
    const angle = (index * 360 / total - 90) * (Math.PI / 180);
    const radius = 85;
    return {
      x: Math.cos(angle) * radius + 110,
      y: Math.sin(angle) * radius + 110
    };
  };

  const getHandAngle = () => {
    if (mode === 'hour') {
      return (selectedHour % 12) * 30 - 90;
    } else {
      return (selectedMinute / 5) * 30 - 90;
    }
  };

  const numbers = mode === 'hour' ? hours : minutes;

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div>
        <label className="block text-[#7a8a99] text-xs font-inter font-semibold uppercase tracking-wider mb-3">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 bg-[#0f1923] border-2 border-[#2a3a47] rounded-lg text-white font-inter text-base focus:border-[#7c4dff] focus:outline-none"
        />
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setMode('hour')}
          className={`px-6 py-3 rounded-lg font-mono text-3xl transition-all ${
            mode === 'hour' 
              ? 'bg-[#7c4dff] text-white' 
              : 'bg-[#2a3a47] text-[#7a8a99] hover:bg-[#3a4554]'
          }`}
        >
          {selectedHour.toString().padStart(2, '0')}
        </button>
        <span className="text-white text-3xl font-mono">:</span>
        <button
          onClick={() => setMode('minute')}
          className={`px-6 py-3 rounded-lg font-mono text-3xl transition-all ${
            mode === 'minute' 
              ? 'bg-[#7c4dff] text-white' 
              : 'bg-[#2a3a47] text-[#7a8a99] hover:bg-[#3a4554]'
          }`}
        >
          {selectedMinute.toString().padStart(2, '0')}
        </button>
        <button
          onClick={() => setPeriod(period === 'AM' ? 'PM' : 'AM')}
          className="ml-2 px-4 py-3 bg-[#7c4dff] text-white rounded-lg font-mono text-lg hover:bg-[#6a3de8] transition-all"
        >
          {period}
        </button>
      </div>

      {/* Circular Clock */}
      <div className="flex justify-center">
        <div className="relative">
          <svg
            width="240"
            height="240"
            onClick={handleClockClick}
            className="cursor-pointer"
          >
            {/* Clock background */}
            <circle
              cx="120"
              cy="120"
              r="110"
              fill="#e5e7eb"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            
            {/* Clock numbers */}
            {numbers.map((num, index) => {
              const pos = getNumberPosition(index, numbers.length);
              const isSelected = mode === 'hour' 
                ? num === selectedHour 
                : num === selectedMinute;
              
              return (
                <g key={num}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="16"
                    fill={isSelected ? '#7c4dff' : 'transparent'}
                    className="transition-all"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-sm font-medium select-none ${
                      isSelected ? 'fill-white' : 'fill-gray-600'
                    }`}
                  >
                    {mode === 'hour' ? num : num.toString().padStart(2, '0')}
                  </text>
                </g>
              );
            })}

            {/* Clock hand */}
            <line
              x1="120"
              y1="120"
              x2={120 + Math.cos(getHandAngle() * Math.PI / 180) * 85}
              y2={120 + Math.sin(getHandAngle() * Math.PI / 180) * 85}
              stroke="#7c4dff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Center dot */}
            <circle cx="120" cy="120" r="5" fill="#7c4dff" />
            
            {/* End dot */}
            <circle
              cx={120 + Math.cos(getHandAngle() * Math.PI / 180) * 85}
              cy={120 + Math.sin(getHandAngle() * Math.PI / 180) * 85}
              r="20"
              fill="#7c4dff"
            />
          </svg>
        </div>
      </div>

      {/* Mode indicator */}
      <div className="text-center">
        <span className="text-[#7a8a99] text-xs font-inter uppercase tracking-wider">
          Select {mode === 'hour' ? 'Hour' : 'Minute'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-[#2a3a47] hover:bg-[#3a4554] font-valorant text-sm tracking-wider text-white rounded-lg transition-all uppercase"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-3 bg-[#00d4aa] hover:bg-[#00c29a] font-valorant text-sm tracking-wider text-[#0f1923] rounded-lg transition-all shadow-lg shadow-[#00d4aa]/30 uppercase"
        >
          Add Slot
        </button>
      </div>
    </div>
  );
}
