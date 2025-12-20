'use client';
import React, { useState, useMemo } from 'react';

// 1. Configuration - Easy to update or move to a database later
const STEPS_CONFIG = [
  { id: 1, title: 'Fill Out Form', desc: 'Tell us about your project requirements.' },
  { id: 2, title: 'Book Consultation', desc: 'Schedule a quick 10-minute discovery call.' },
  { id: 3, title: 'Review First Draft', desc: 'Provide feedback on our initial designs.' },
  { id: 4, title: 'Receive Final Product', desc: 'Download your polished, final assets.' },
];

export default function DesignService() {
  // Current progress (1-4)
  const [currentStep, setCurrentStep] = useState(1);
  // Which modal is currently open (null, 'form', 'booking', 'draft', 'final')
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});

  // Derived state: Progress %
  const progressPercent = useMemo(() => ((currentStep - 1) / (STEPS_CONFIG.length - 1)) * 100, [currentStep]);

  // Actions
  const advanceStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS_CONFIG.length + 1));
    setActiveModal(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    setFormData(data);
    advanceStep();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Design Service</h1>
        <p className="text-gray-600">Transform your vision into reality in 4 simple steps</p>
      </header>

      {/* Modern Progress Bar */}
      <div className="relative mb-12 px-4">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-4">
          {STEPS_CONFIG.map(step => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors 
                ${currentStep >= step.id ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className="text-xs mt-2 font-medium text-gray-500">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid gap-4">
        {STEPS_CONFIG.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div key={step.id} className={`p-6 rounded-xl border-2 transition-all 
              ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white opacity-80'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-lg font-bold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>{step.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{step.desc}</p>
                </div>
                <button
                  disabled={!isActive}
                  onClick={() => setActiveModal(step.id)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all
                    ${isCompleted ? 'bg-green-100 text-green-700' : 
                      isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400'}`}
                >
                  {isCompleted ? 'Completed ✓' : isActive ? 'Get Started' : 'Locked'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL ENGINE --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600">&times;</button>
            
            {activeModal === 1 && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Project Brief</h2>
                <input name="firstName" placeholder="First Name" required className="w-full p-3 border rounded-lg" />
                <select name="projectType" required className="w-full p-3 border rounded-lg">
                  <option value="">Select Project Type</option>
                  <option value="logo">Logo Design</option>
                  <option value="web">Web Design</option>
                </select>
                <textarea name="desc" placeholder="Project Description" className="w-full p-3 border rounded-lg h-32"></textarea>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Submit Brief</button>
              </form>
            )}

            {activeModal === 2 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Book Consultation</h2>
                <p className="mb-6">Pick a slot for your 10-minute strategy call.</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {['10:00 AM', '02:00 PM'].map(time => (
                    <button key={time} onClick={advanceStep} className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500">Tomorrow {time}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Other modals follow the same pattern... */}
          </div>
        </div>
      )}
    </div>
  );
}