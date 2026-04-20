import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, Send, CheckCircle, Upload, X } from 'lucide-react';

const MVGFC_GREEN = '#2d5f3f';
const LIGHT_GREEN = '#e8f5e9';
const GOLD = '#ffd700';

// Your Google Apps Script Web App URL - REPLACE THIS
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9pRm_tRt9H2ZkTAl39FHRB6WnexoOCEBup4WADS-LXISwZm4w3u_eCyn-LWWYI66WVA/exec';

export default function GraduateTracerStudy() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [savedProgress, setSavedProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('mvgfc_tracer_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.data || {});
      setCurrentStep(parsed.step || 0);
      setSavedProgress(true);
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('mvgfc_tracer_progress', JSON.stringify({
        data: formData,
        step: currentStep,
        timestamp: new Date().toISOString()
      }));
    }
  }, [formData, currentStep]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { title: 'Welcome', icon: '📋' },
    { title: 'Personal Info', icon: '👤' },
    { title: 'Program Background', icon: '🎓' },
    { title: 'Student Experience', icon: '⭐' },
    { title: 'Employment Status', icon: '💼' },
    { title: 'Employment Details', icon: '📊' },
    { title: 'Skills & Competencies', icon: '🎯' },
    { title: 'Further Education', icon: '📚' },
    { title: 'Community', icon: '🤝' },
    { title: 'Alumni ID', icon: '💳' }
  ];

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField(field, {
        name: file.name,
        type: file.type,
        data: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const validateStep = () => {
    // Basic validation - expand as needed
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setSubmitted(true);
      localStorage.removeItem('mvgfc_tracer_progress');
    } catch (error) {
      alert('Submission error. Please try again or contact support.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center">
          <CheckCircle size={80} className="mx-auto mb-6 text-green-600" />
          <h1 className="text-4xl font-bold mb-4" style={{ color: MVGFC_GREEN }}>
            Thank You!
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Your Graduate Tracer Study response has been successfully submitted.
          </p>
          <p className="text-gray-600">
            Your feedback helps MVGFC improve our programs and better serve future graduates.
          </p>
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Please check your email for your Alumni ID details and partner discounts! 🎓
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header Banner */}
      <div className="w-full h-48 bg-gradient-to-r from-green-800 to-green-600 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-400 rounded-full translate-x-20 translate-y-20"></div>
        </div>
        <div className="text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            GRADUATE TRACER STUDY
          </h1>
          <p className="text-xl text-yellow-200">Batch 2023-2024</p>
          <p className="text-sm text-green-100 mt-2">Manuel V. Gallego Foundation Colleges, Inc.</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  idx === currentStep ? 'bg-green-600 text-white scale-110' :
                  idx < currentStep ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {idx < currentStep ? '✓' : step.icon}
                </div>
                <div className={`text-xs mt-2 text-center hidden md:block ${
                  idx === currentStep ? 'font-bold text-green-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`absolute h-1 w-full top-5 left-1/2 -z-10 ${
                    idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} style={{ width: 'calc(100% / 9)' }} />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {savedProgress && currentStep === 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-center">
                <Save className="text-yellow-600 mr-3" size={24} />
                <div>
                  <p className="font-semibold text-yellow-800">Progress Restored</p>
                  <p className="text-sm text-yellow-700">We've loaded your previous responses. Continue where you left off!</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 0: WELCOME & CONSENT */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4" style={{ color: MVGFC_GREEN }}>
                  Welcome, Dear Graduate! 🎓
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We kindly request you to complete this Graduate Tracer Study (GTS) questionnaire as accurately and completely as possible. 
                  The information you provide will be used solely for research purposes to assess the employability of our graduates and 
                  to help improve the academic programs of your alma mater, MV Gallego Foundation Colleges.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="font-bold text-lg mb-3" style={{ color: MVGFC_GREEN }}>
                  📧 Email Address
                </h3>
                <input
                  type="email"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="your.email@example.com"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-lg mb-3 text-blue-900">
                  🔒 Data Privacy Act of 2012 (RA 10173)
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  In accordance with Republic Act No. 10173, also known as the Data Privacy Act of 2012, 
                  do you authorize Manuel V. Gallego Foundation Colleges, Inc. – Cabanatuan City to collect 
                  and use your personal information (such as your full name, email address, and other relevant 
                  details) for school records and other documents related to the Graduate Tracer Study?
                </p>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    checked={formData.dataPrivacyConsent || false}
                    onChange={(e) => updateField('dataPrivacyConsent', e.target.checked)}
                  />
                  <span className="font-semibold text-gray-800">
                    I agree and give my consent
                  </span>
                </label>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>⏱️ Note:</strong> Your progress is automatically saved. You can complete this survey in multiple sessions.
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                👤 Personal Information
              </h2>

              <div>
                <label className="block font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.fullName || ''}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Gender *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Male', 'Female', 'With Diverse SOGIE', 'Prefer not to say'].map(option => (
                    <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.gender === option ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.gender === option ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="radio"
                        name="gender"
                        required
                        value={option}
                        checked={formData.gender === option}
                        onChange={(e) => updateField('gender', e.target.value)}
                        className="text-green-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Age (in years) *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Below 20', '20-24', '25-29', '30-34', '35-39', '40 and above'].map(option => (
                    <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.age === option ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.age === option ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="radio"
                        name="age"
                        required
                        value={option}
                        checked={formData.age === option}
                        onChange={(e) => updateField('age', e.target.value)}
                        className="text-green-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Civil Status *</label>
                <select
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.civilStatus || ''}
                  onChange={(e) => updateField('civilStatus', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Separated/Divorced</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Bachelor's Degree Earned *</label>
                <select
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.degree || ''}
                  onChange={(e) => updateField('degree', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>Bachelor of Elementary Education</option>
                  <option>Bachelor of Science in Business Administration</option>
                  <option>Bachelor of Science in Computer Science</option>
                  <option>Bachelor of Science in Criminology</option>
                  <option>Bachelor of Science in Information System</option>
                  <option>Bachelor of Science in Nursing</option>
                  <option>Bachelor of Secondary Education</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Year Graduated *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['2023', '2024', '2025'].map(year => (
                    <label key={year} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.yearGraduated === year ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.yearGraduated === year ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="radio"
                        name="yearGraduated"
                        required
                        value={year}
                        checked={formData.yearGraduated === year}
                        onChange={(e) => updateField('yearGraduated', e.target.value)}
                        className="text-green-600"
                      />
                      <span className="text-sm">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Academic Honors Received (if any)</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., Cum Laude, Dean's Lister"
                  value={formData.academicHonors || ''}
                  onChange={(e) => updateField('academicHonors', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: PROGRAM BACKGROUND */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                🎓 Program Background
              </h2>

              <div>
                <label className="block font-semibold mb-3">Reasons for Taking the Degree Program * (Select all that apply)</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'To gain knowledge and skills in my field of interest',
                    'To pursue personal growth and self-fulfillment',
                    'To prepare for advanced studies (master\'s/doctorate)',
                    'To improve employment opportunities',
                    'To qualify for a specific job/career path',
                    'To obtain professional licensure (e.g., board exam requirement)',
                    'To enhance promotion and career advancement prospects',
                    'Encouraged by parents/family',
                    'Inspired by peers/friends',
                    'Influence of teachers/guidance counselors',
                    'Availability of the program in the locality',
                    'Affordable tuition and fees',
                    'Availability of scholarships/financial assistance',
                    'Flexible schedule or accessibility of the institution',
                    'Commitment to serve the community or country',
                    'Alignment with personal values and advocacies'
                  ].map(reason => (
                    <label key={reason} className="flex items-start space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.degreeReasons?.includes(reason) ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.degreeReasons?.includes(reason) ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="checkbox"
                        checked={formData.degreeReasons?.includes(reason) || false}
                        onChange={(e) => {
                          const current = formData.degreeReasons || [];
                          if (e.target.checked) {
                            updateField('degreeReasons', [...current, reason]);
                          } else {
                            updateField('degreeReasons', current.filter(r => r !== reason));
                          }
                        }}
                        className="mt-1 text-green-600"
                      />
                      <span className="text-sm">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Have you taken the board exam? *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map(option => (
                    <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.boardExam === option ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.boardExam === option ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="radio"
                        name="boardExam"
                        required
                        value={option}
                        checked={formData.boardExam === option}
                        onChange={(e) => updateField('boardExam', e.target.value)}
                        className="text-green-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.boardExam === 'No' && (
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <label className="block font-semibold mb-3">If you did not yet pass the board examination, what do you think is/are the reason/s? * (Select all that apply)</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Lack of preparation/study time',
                      'Difficulty of the examination coverage',
                      'Lack of review materials/resources',
                      'Limited access to review centers',
                      'Health-related issues during examination period',
                      'Financial constraints',
                      'Work or family responsibilities interfered with review',
                      'High level of anxiety/stress during the examination',
                      'Did not take the examination seriously/procrastination',
                      'Lack of familiarity with process',
                      'Loss of recall',
                      'Quality of classroom instruction was inadequate',
                      'Limited exposure on real-life scenarios',
                      'Curriculum content did not fully match board exam coverage',
                      'Other'
                    ].map(reason => (
                      <label key={reason} className="flex items-start space-x-3 p-2 border rounded cursor-pointer hover:bg-yellow-100">
                        <input
                          type="checkbox"
                          checked={formData.boardExamFailReasons?.includes(reason) || false}
                          onChange={(e) => {
                            const current = formData.boardExamFailReasons || [];
                            if (e.target.checked) {
                              updateField('boardExamFailReasons', [...current, reason]);
                            } else {
                              updateField('boardExamFailReasons', current.filter(r => r !== reason));
                            }
                          }}
                          className="mt-1 text-yellow-600"
                        />
                        <span className="text-sm">{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-2">Scholarships or Financial Aid Availed During College *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="Specify scholarship name or 'None'"
                  value={formData.scholarship || ''}
                  onChange={(e) => updateField('scholarship', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Complete Permanent Address *</label>
                <textarea
                  required
                  rows="3"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.permanentAddress || ''}
                  onChange={(e) => updateField('permanentAddress', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Current Location (City, Province, Country) *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., Cabanatuan City, Nueva Ecija, Philippines"
                  value={formData.currentLocation || ''}
                  onChange={(e) => updateField('currentLocation', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Urban or Rural Resident *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Urban', 'Rural'].map(option => (
                    <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.urbanRural === option ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.urbanRural === option ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="radio"
                        name="urbanRural"
                        required
                        value={option}
                        checked={formData.urbanRural === option}
                        onChange={(e) => updateField('urbanRural', e.target.value)}
                        className="text-green-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Migration History *</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Stayed in home region', 'Moved to another region within the country', 'Moved abroad'].map(option => (
                    <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.migration === option ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.migration === option ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="radio"
                        name="migration"
                        required
                        value={option}
                        checked={formData.migration === option}
                        onChange={(e) => updateField('migration', e.target.value)}
                        className="text-green-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Parents' Highest Educational Attainment *</label>
                <select
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.parentsEducation || ''}
                  onChange={(e) => updateField('parentsEducation', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>Elementary level</option>
                  <option>Elementary graduate</option>
                  <option>High School level</option>
                  <option>High School graduate</option>
                  <option>College level</option>
                  <option>College graduate</option>
                  <option>Master's level</option>
                  <option>Master's degree holder</option>
                  <option>Doctoral level</option>
                  <option>Doctoral degree holder</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Household Income During College *</label>
                <select
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.householdIncome || ''}
                  onChange={(e) => updateField('householdIncome', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>Below Php 10,000</option>
                  <option>Php 10,000 – 20,000</option>
                  <option>Php 20,001 – 40,000</option>
                  <option>Php 40,001 – 60,000</option>
                  <option>Php 60,001 and above</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Languages Spoken *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., Tagalog, English, Ilocano"
                  value={formData.languages || ''}
                  onChange={(e) => updateField('languages', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Disability Status *</label>
                <select
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.disability || ''}
                  onChange={(e) => updateField('disability', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>None</option>
                  <option>Physical Disability</option>
                  <option>Visual/Hearing Impairment</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Membership in Professional Organizations *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="Specify organization name or 'None'"
                  value={formData.professionalOrg || ''}
                  onChange={(e) => updateField('professionalOrg', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-3">Social Media or Networking Platforms Used * (Select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Facebook', 'TikTok', 'Twitter/X', 'LinkedIn', 'Instagram', 'YouTube', 'Others'].map(platform => (
                    <label key={platform} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                      style={{
                        borderColor: formData.socialMedia?.includes(platform) ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.socialMedia?.includes(platform) ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="checkbox"
                        checked={formData.socialMedia?.includes(platform) || false}
                        onChange={(e) => {
                          const current = formData.socialMedia || [];
                          if (e.target.checked) {
                            updateField('socialMedia', [...current, platform]);
                          } else {
                            updateField('socialMedia', current.filter(p => p !== platform));
                          }
                        }}
                        className="text-green-600"
                      />
                      <span className="text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: STUDENT EXPERIENCE (Ratings) */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                ⭐ Student Experience
              </h2>
              
              <RatingSection
                title="A. Quality of Instruction"
                items={[
                  'Faculty demonstrated expertise and mastery in their subject areas',
                  'Faculty provided timely and constructive feedback',
                  'Teaching strategies were innovative and engaging',
                  'Courses were up-to-date with industry standards and trends',
                  'Integration of theory and practice was sufficient'
                ]}
                prefix="qualityInstruction"
                formData={formData}
                updateField={updateField}
                scale={['1 - Strongly Disagree', '2 - Disagree', '3 - Agree', '4 - Strongly Agree']}
              />

              <RatingSection
                title="B. Curriculum Relevance"
                items={[
                  'The curriculum was aligned with my career goals',
                  'I was exposed to current technologies and tools in my field',
                  'There was a balance between theoretical and practical components',
                  'The curriculum prepared me for professional certifications or licensure exams',
                  'Elective courses addressed emerging issues and industry trends'
                ]}
                prefix="curriculumRelevance"
                formData={formData}
                updateField={updateField}
                scale={['1 - Strongly Disagree', '2 - Disagree', '3 - Agree', '4 - Strongly Agree']}
              />

              <RatingSection
                title="C. Internships/OJTs/RLE"
                items={[
                  'Relevance of internship/OJT/RLE tasks to your field of study',
                  'Supervision and support provided by industry/company supervisors during internship/OJT/RLE',
                  'Duration and scheduling of the internship/OJT/RLE program',
                  'Alignment of internship/OJT/RLE experience with board/licensure examination requirements',
                  'Overall satisfaction with internship/OJT/RLE'
                ]}
                prefix="internships"
                formData={formData}
                updateField={updateField}
                scale={['1 - Very Poor', '2 - Poor', '3 - Good', '4 - Excellent']}
              />

              <RatingSection
                title="D. Extracurricular Activities"
                items={[
                  'Variety of extracurricular activities offered',
                  'Adequacy of facilities and resources for extracurricular activities',
                  'Opportunities for leadership, teamwork, and personal growth',
                  'Balance of extracurricular activities with academic workload',
                  'Overall satisfaction with extracurricular activities'
                ]}
                prefix="extracurricular"
                formData={formData}
                updateField={updateField}
                scale={['1 - Very Poor', '2 - Poor', '3 - Good', '4 - Excellent']}
              />

              <RatingSection
                title="E. Leadership Roles"
                items={[
                  'Availability of leadership development programs',
                  'Opportunities for students to hold leadership positions',
                  'Support and mentoring from faculty/staff for student leaders',
                  'Effectiveness of leadership activities in developing communication, decision-making, and teamwork skills',
                  'Overall satisfaction with the school\'s leadership programs and activities'
                ]}
                prefix="leadership"
                formData={formData}
                updateField={updateField}
                scale={['1 - Very Poor', '2 - Poor', '3 - Good', '4 - Excellent']}
              />

              <RatingSection
                title="F. Facilities"
                items={[
                  'Classrooms and Lecture Halls',
                  'Laboratories and Equipment',
                  'Library Resources and Databases',
                  'Computer and Internet Access',
                  'Study Spaces and Lounges'
                ]}
                prefix="facilities"
                formData={formData}
                updateField={updateField}
                scale={['1 - Very Inadequate', '2 - Inadequate', '3 - Adequate', '4 - Excellent']}
              />

              <RatingSection
                title="G. Support Services"
                items={[
                  'Academic Advising and Mentoring',
                  'Career Counseling and Placement Services',
                  'Guidance and Psychological Support Services',
                  'Scholarship and Financial Assistance Programs',
                  'Student Affairs and Administrative Support',
                  'Health and Wellness Services'
                ]}
                prefix="supportServices"
                formData={formData}
                updateField={updateField}
                scale={['1 - Very Inadequate', '2 - Inadequate', '3 - Adequate', '4 - Excellent']}
              />
            </div>
          )}

          {/* STEP 4: EMPLOYMENT STATUS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                💼 Employment Status
              </h2>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
                <label className="block font-semibold mb-3 text-lg">Present Employment Status *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Employed (full-time)',
                    'Employed (part-time)',
                    'Self-employed',
                    'Unemployed (actively looking)',
                    'Unemployed (not looking)'
                  ].map(option => (
                    <label key={option} className="flex items-center space-x-3 p-4 bg-white border-2 rounded-lg cursor-pointer hover:shadow-md transition-all"
                      style={{
                        borderColor: formData.employmentStatus === option ? MVGFC_GREEN : '#ddd',
                        backgroundColor: formData.employmentStatus === option ? LIGHT_GREEN : 'white'
                      }}>
                      <input
                        type="radio"
                        name="employmentStatus"
                        required
                        value={option}
                        checked={formData.employmentStatus === option}
                        onChange={(e) => updateField('employmentStatus', e.target.value)}
                        className="text-green-600"
                      />
                      <span className="font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.employmentStatus?.startsWith('Unemployed') && (
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <p className="text-blue-900 font-semibold mb-2">
                    Thank you for your response. The following employment sections will be skipped.
                  </p>
                  <p className="text-sm text-blue-700">
                    You can proceed to the Skills & Competencies section by clicking Next.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: EMPLOYMENT DETAILS (Conditional) */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {formData.employmentStatus?.startsWith('Employed') || formData.employmentStatus === 'Self-employed' ? (
                <>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                    📊 Employment Details
                  </h2>

                  <div>
                    <label className="block font-semibold mb-2">What is your present employment status? *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.presentEmploymentType || ''}
                      onChange={(e) => updateField('presentEmploymentType', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Regular/Permanent</option>
                      <option>Contractual/Project-based</option>
                      <option>Probationary</option>
                      <option>Self-employed/Entrepreneur</option>
                      <option>Part-time</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">How long did it take you to land your first job after graduation? *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.timeToFirstJob || ''}
                      onChange={(e) => updateField('timeToFirstJob', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Less than 3 months</option>
                      <option>3–6 months</option>
                      <option>7–12 months</option>
                      <option>More than 1 year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">What was your starting monthly salary in your first job after graduation? *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.startingSalary || ''}
                      onChange={(e) => updateField('startingSalary', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Below ₱10,000</option>
                      <option>₱10,001–₱20,000</option>
                      <option>₱20,001–₱30,000</option>
                      <option>₱30,001–₱40,000</option>
                      <option>₱40,001–₱50,000</option>
                      <option>Above ₱50,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">How did you find your first job? * (Select all that apply)</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'School placement/Referral',
                        'Walk-in application',
                        'Job fair',
                        'Online job sites/social media',
                        'Family/Relatives/Friends',
                        'Other'
                      ].map(method => (
                        <label key={method} className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                          style={{
                            borderColor: formData.jobFindMethod?.includes(method) ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.jobFindMethod?.includes(method) ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="checkbox"
                            checked={formData.jobFindMethod?.includes(method) || false}
                            onChange={(e) => {
                              const current = formData.jobFindMethod || [];
                              if (e.target.checked) {
                                updateField('jobFindMethod', [...current, method]);
                              } else {
                                updateField('jobFindMethod', current.filter(m => m !== method));
                              }
                            }}
                            className="text-green-600"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Is your present job the same as your first job after graduation? *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Yes', 'No'].map(option => (
                        <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                          style={{
                            borderColor: formData.sameJob === option ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.sameJob === option ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="radio"
                            name="sameJob"
                            required
                            value={option}
                            checked={formData.sameJob === option}
                            onChange={(e) => updateField('sameJob', e.target.value)}
                            className="text-green-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">What is the name of your present company/organization? *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.companyName || ''}
                      onChange={(e) => updateField('companyName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">What is your job title/designation? *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.jobTitle || ''}
                      onChange={(e) => updateField('jobTitle', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">What industry/sector are you working in? *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.industry || ''}
                      onChange={(e) => updateField('industry', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Agriculture, Fisheries & Environment</option>
                      <option>Arts/Media/Communication</option>
                      <option>Business/Finance/Administration</option>
                      <option>Education/Training</option>
                      <option>Government/Public Service</option>
                      <option>Health/Medical Services</option>
                      <option>Information Technology/Digital Services</option>
                      <option>Law Enforcement/Criminal Justice/Public Safety</option>
                      <option>NGO/International Organization</option>
                      <option>Tourism, Hospitality & Services</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">What is the nature of your employment? *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Local (within the Philippines)', 'Overseas'].map(option => (
                        <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                          style={{
                            borderColor: formData.employmentNature === option ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.employmentNature === option ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="radio"
                            name="employmentNature"
                            required
                            value={option}
                            checked={formData.employmentNature === option}
                            onChange={(e) => updateField('employmentNature', e.target.value)}
                            className="text-green-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">What is your present monthly income range? *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.presentIncome || ''}
                      onChange={(e) => updateField('presentIncome', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Below ₱10,000</option>
                      <option>₱10,001–₱20,000</option>
                      <option>₱20,001–₱30,000</option>
                      <option>₱30,001–₱40,000</option>
                      <option>₱40,001–₱50,000</option>
                      <option>Above ₱50,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Is your present job related to your degree program? *</label>
                    <div className="grid grid-cols-1 gap-3">
                      {['Yes, highly related', 'Somewhat related', 'Not related'].map(option => (
                        <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                          style={{
                            borderColor: formData.jobRelation === option ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.jobRelation === option ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="radio"
                            name="jobRelation"
                            required
                            value={option}
                            checked={formData.jobRelation === option}
                            onChange={(e) => updateField('jobRelation', e.target.value)}
                            className="text-green-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.jobRelation === 'Not related' && (
                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                      <label className="block font-semibold mb-3">If not related, what is the reason? * (Select all that apply)</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'No available job related to my course',
                          'Better compensation in another field',
                          'Developed new interest/skills after graduation',
                          'Other'
                        ].map(reason => (
                          <label key={reason} className="flex items-center space-x-3 p-2 border rounded cursor-pointer hover:bg-yellow-100">
                            <input
                              type="checkbox"
                              checked={formData.notRelatedReason?.includes(reason) || false}
                              onChange={(e) => {
                                const current = formData.notRelatedReason || [];
                                if (e.target.checked) {
                                  updateField('notRelatedReason', [...current, reason]);
                                } else {
                                  updateField('notRelatedReason', current.filter(r => r !== reason));
                                }
                              }}
                              className="text-yellow-600"
                            />
                            <span className="text-sm">{reason}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <RatingSection
                    title="Relevance of Education to Job"
                    items={[
                      'Classroom instruction',
                      'Internship/OJT/RLE',
                      'Extracurricular activities',
                      'Research/Thesis/Capstone',
                      'Faculty mentoring and guidance'
                    ]}
                    prefix="educationRelevance"
                    formData={formData}
                    updateField={updateField}
                    scale={['1 - Poor', '2 - Fair', '3 - Good', '4 - Excellent']}
                  />

                  <RatingSection
                    title="Program Preparation for Competencies"
                    items={[
                      'Communication skills',
                      'Problem-solving and critical thinking',
                      'Technical skills related to your field',
                      'Leadership and management skills',
                      'Research and analytical skills',
                      'Information technology/digital literacy',
                      'Work ethics and professionalism',
                      'Teamwork and collaboration',
                      'Adaptability/flexibility'
                    ]}
                    prefix="competencyPrep"
                    formData={formData}
                    updateField={updateField}
                    scale={['1 - Poor', '2 - Fair', '3 - Good', '4 - Excellent']}
                  />

                  <RatingSection
                    title="Job Satisfaction"
                    items={[
                      'Salary/compensation',
                      'Job security/stability',
                      'Career advancement opportunities',
                      'Work-life balance',
                      'Alignment with personal goals/values',
                      'Overall job satisfaction'
                    ]}
                    prefix="jobSatisfaction"
                    formData={formData}
                    updateField={updateField}
                    scale={['1 - Very Dissatisfied', '2 - Dissatisfied', '3 - Satisfied', '4 - Very Satisfied']}
                  />

                  <div>
                    <label className="block font-semibold mb-2">Have you received promotions or advancements in your job since you started? *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Yes', 'No'].map(option => (
                        <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                          style={{
                            borderColor: formData.receivedPromotions === option ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.receivedPromotions === option ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="radio"
                            name="receivedPromotions"
                            required
                            value={option}
                            checked={formData.receivedPromotions === option}
                            onChange={(e) => updateField('receivedPromotions', e.target.value)}
                            className="text-green-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Have you experienced an increase in your salary since you started working? *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Yes', 'No'].map(option => (
                        <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                          style={{
                            borderColor: formData.salaryIncrease === option ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.salaryIncrease === option ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="radio"
                            name="salaryIncrease"
                            required
                            value={option}
                            checked={formData.salaryIncrease === option}
                            onChange={(e) => updateField('salaryIncrease', e.target.value)}
                            className="text-green-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.salaryIncrease === 'Yes' && (
                    <div>
                      <label className="block font-semibold mb-2">If yes, what is the estimated total increase in your monthly salary? *</label>
                      <select
                        required
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={formData.salaryIncreaseAmount || ''}
                        onChange={(e) => updateField('salaryIncreaseAmount', e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option>Below ₱5,000</option>
                        <option>₱5,001–₱10,000</option>
                        <option>₱10,001–₱20,000</option>
                        <option>₱20,001–₱30,000</option>
                        <option>₱30,001 and above</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold mb-2">Do you plan to stay in your present job for the next 2–3 years? *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Yes', 'No', 'Not Sure'].map(option => (
                        <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all"
                          style={{
                            borderColor: formData.stayInJob === option ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.stayInJob === option ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="radio"
                            name="stayInJob"
                            required
                            value={option}
                            checked={formData.stayInJob === option}
                            onChange={(e) => updateField('stayInJob', e.target.value)}
                            className="text-green-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">What are your future career plans? *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.careerPlans || ''}
                      onChange={(e) => updateField('careerPlans', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Stay and advance in current job</option>
                      <option>Change job within the same field</option>
                      <option>Change career to a different field</option>
                      <option>Pursue higher studies</option>
                      <option>Migrate/work abroad</option>
                      <option>Start my own business</option>
                      <option>Other</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">
                    This section is for employed graduates only.
                  </p>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: MVGFC_GREEN }}
                  >
                    Skip to Next Section
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: SKILLS & COMPETENCIES */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                🎯 Skills & Competencies
              </h2>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Instructions:</strong> Rate the importance of these competencies in your work (or future work), 
                  and how well your degree program prepared you.
                </p>
              </div>

              <RatingSection
                title="Importance at Work (1 - Not Important to 4 - Very Important)"
                items={[
                  'Adaptability/Flexibility',
                  'Conflict management and negotiation',
                  'Creativity and innovation',
                  'Critical thinking',
                  'Data analysis and interpretation',
                  'Digital/Media literacy',
                  'Ethics and professional responsibility',
                  'Industry-specific technical skills',
                  'Initiative and self-direction',
                  'Intercultural skills',
                  'Interpersonal skills',
                  'Leadership potential and initiative',
                  'Lifelong learning orientation',
                  'Negotiation skills',
                  'Oral communication skills',
                  'Planning and organizing',
                  'Problem-solving and decision-making',
                  'Productivity',
                  'Professionalism',
                  'Project/Time management',
                  'Resilience/Stress management',
                  'Service orientation/Community engagement',
                  'Teamwork/Collaboration',
                  'Written communication skills'
                ]}
                prefix="skillsImportance"
                formData={formData}
                updateField={updateField}
                scale={['1 - Not Important', '2 - Slightly Important', '3 - Important', '4 - Very Important']}
              />

              <RatingSection
                title="Program Preparation (1 - Very Poor to 4 - Excellent)"
                items={[
                  'Adaptability/Flexibility',
                  'Conflict management and negotiation',
                  'Creativity and innovation',
                  'Critical thinking',
                  'Data analysis and interpretation',
                  'Digital/Media literacy',
                  'Ethics and professional responsibility',
                  'Industry-specific technical skills',
                  'Initiative and self-direction',
                  'Intercultural skills',
                  'Interpersonal skills',
                  'Leadership potential and initiative',
                  'Lifelong learning orientation',
                  'Negotiation skills',
                  'Oral communication skills',
                  'Planning and organizing',
                  'Problem-solving and decision-making',
                  'Productivity',
                  'Professionalism',
                  'Project/Time management',
                  'Resilience/Stress management',
                  'Service orientation/Community engagement',
                  'Teamwork/Collaboration',
                  'Written communication skills'
                ]}
                prefix="skillsPreparation"
                formData={formData}
                updateField={updateField}
                scale={['1 - Very Poor', '2 - Poor', '3 - Good', '4 - Excellent']}
              />
            </div>
          )}

          {/* STEP 7: FURTHER EDUCATION */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                📚 Further Education & Training
              </h2>

              <div>
                <label className="block font-semibold mb-2">Are you currently pursuing further studies? *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="Specify program/field or 'No'"
                  value={formData.furtherStudies || ''}
                  onChange={(e) => updateField('furtherStudies', e.target.value)}
                />
              </div>

              {formData.furtherStudies && formData.furtherStudies.toLowerCase() !== 'no' && formData.furtherStudies.toLowerCase() !== 'none' && (
                <>
                  <div>
                    <label className="block font-semibold mb-2">Level of study *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.studyLevel || ''}
                      onChange={(e) => updateField('studyLevel', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Master's level</option>
                      <option>Doctorate</option>
                      <option>Post-graduate diploma</option>
                      <option>Microcredential Certification</option>
                      <option>Licensure review</option>
                      <option>Professional training (e.g., CPD units)</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Primary reason for pursuing further studies *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.studyReason || ''}
                      onChange={(e) => updateField('studyReason', e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Requirement for current job/promotion</option>
                      <option>To gain specialized knowledge/skills</option>
                      <option>To change/shift career</option>
                      <option>Personal growth/interest</option>
                      <option>Other</option>
                    </select>
                  </div>
                </>
              )}

              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="font-bold text-lg mb-4" style={{ color: MVGFC_GREEN }}>
                  Trainings/Seminars/Certifications (within last 24 months)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Title of Training/Seminar/Certification *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.trainingTitle || ''}
                      onChange={(e) => updateField('trainingTitle', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Provider *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.trainingProvider || ''}
                      onChange={(e) => updateField('trainingProvider', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Duration (in hours) *</label>
                    <input
                      type="number"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      value={formData.trainingDuration || ''}
                      onChange={(e) => updateField('trainingDuration', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Relevance *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['1 - Not Relevant', '2 - Slightly Relevant', '3 - Relevant', '4 - Highly Relevant'].map(option => (
                        <label key={option} className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-all text-sm"
                          style={{
                            borderColor: formData.trainingRelevance === option ? MVGFC_GREEN : '#ddd',
                            backgroundColor: formData.trainingRelevance === option ? LIGHT_GREEN : 'white'
                          }}>
                          <input
                            type="radio"
                            name="trainingRelevance"
                            required
                            value={option}
                            checked={formData.trainingRelevance === option}
                            onChange={(e) => updateField('trainingRelevance', e.target.value)}
                            className="text-green-600"
                          />
                          <span>{option.split(' - ')[1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <RatingSection
                title="Impact of Further Studies/Training on Career"
                items={[
                  'Improved knowledge/skills in my profession',
                  'Better job performance',
                  'Career advancement/promotion',
                  'Increased employability/job opportunities',
                  'Higher earning potential',
                  'Expanded professional network',
                  'No noticeable impact'
                ]}
                prefix="trainingImpact"
                formData={formData}
                updateField={updateField}
                scale={['No Impact', '2 - Low Impact', '3 - Moderate Impact', '4 - High Impact']}
              />
            </div>
          )}

          {/* STEP 8: COMMUNITY CONTRIBUTION */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                🤝 Contribution to Society & Community
              </h2>

              <RatingSection
                title="How often do you contribute to society and community?"
                items={[
                  'Active membership in professional organization',
                  'Outreach activities (health missions, education, disaster relief)',
                  'Civic and religious groups',
                  'NGO/Nonprofit projects',
                  'Established a business or enterprise',
                  'Provided employment for others',
                  'Supported local suppliers, products, or services',
                  'Introduced sustainable or socially responsible business practices',
                  'Membership in school boards, local councils, or barangay committees',
                  'Advocacy and policy participation',
                  'Leadership roles in civic or community-based organization'
                ]}
                prefix="communityContribution"
                formData={formData}
                updateField={updateField}
                scale={['1 - Never', '2 - Rarely', '3 - Often', '4 - Always']}
              />
            </div>
          )}

          {/* STEP 9: ALUMNI ID */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6" style={{ color: MVGFC_GREEN }}>
                💳 MVGFC Alumni ID Information
              </h2>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-lg border-2 border-yellow-300 mb-6">
                <h3 className="font-bold text-lg mb-3 text-amber-900">
                  ✨ Enjoy Exclusive Discounts & Perks! ✨
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  Present your Alumni ID at our partner establishments:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-900">
                  <div>• Marj Aesthetic Clinic and Training Center</div>
                  <div>• Prism SuperClub</div>
                  <div>• 7 Strokes Massage and Spa</div>
                  <div>• MetroCab</div>
                  <div>• Vince Catacutan Films</div>
                  <div>• Air Cruiser Travel and Tours</div>
                  <div>• EZ Shoppy – Home of Ako Ay May Lobo</div>
                  <div>• Peninsula Beauty Massage and Spa</div>
                  <div>• Double Up Bar and Lounge</div>
                  <div>• Hearnet Photographics</div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Date of Birth *</label>
                <input
                  type="date"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Citizenship *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  value={formData.citizenship || ''}
                  onChange={(e) => updateField('citizenship', e.target.value)}
                />
              </div>

              <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                <h3 className="font-bold text-lg mb-4 text-red-900">
                  Emergency Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Name of Contact Person *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      value={formData.emergencyContactName || ''}
                      onChange={(e) => updateField('emergencyContactName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Contact Number *</label>
                    <input
                      type="tel"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      value={formData.emergencyContactNumber || ''}
                      onChange={(e) => updateField('emergencyContactNumber', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Relationship *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder="e.g., Mother, Father, Spouse, Sibling"
                      value={formData.emergencyRelationship || ''}
                      onChange={(e) => updateField('emergencyRelationship', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Address *</label>
                    <textarea
                      required
                      rows="2"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      value={formData.emergencyAddress || ''}
                      onChange={(e) => updateField('emergencyAddress', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Upload your formal 2x2 picture (For Alumni ID) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => handleFileUpload('photo2x2', e.target.files[0])}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                    <p className="text-sm text-gray-600">
                      {formData.photo2x2 ? (
                        <span className="text-green-600 font-semibold">✓ {formData.photo2x2.name}</span>
                      ) : (
                        'Click to upload 2x2 photo'
                      )}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Upload your e-signature (For Alumni ID) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => handleFileUpload('eSignature', e.target.files[0])}
                    className="hidden"
                    id="signature-upload"
                  />
                  <label htmlFor="signature-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                    <p className="text-sm text-gray-600">
                      {formData.eSignature ? (
                        <span className="text-green-600 font-semibold">✓ {formData.eSignature.name}</span>
                      ) : (
                        'Click to upload e-signature'
                      )}
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
                <p className="text-lg font-semibold text-green-900 mb-2">
                  🎓 You're almost done!
                </p>
                <p className="text-sm text-green-700">
                  Review your responses and click Submit to complete the survey.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                <ChevronLeft size={20} />
                <span>Previous</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="ml-auto flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: MVGFC_GREEN }}
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto flex items-center space-x-2 px-8 py-4 rounded-lg text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
                style={{ backgroundColor: MVGFC_GREEN }}
              >
                {isSubmitting ? (
                  <>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    <span>Submit Survey</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Auto-save Indicator */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              <Save size={14} className="inline mr-1" />
              Progress automatically saved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rating Section Component
function RatingSection({ title, items, prefix, formData, updateField, scale }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
      <h3 className="font-bold text-lg mb-4" style={{ color: MVGFC_GREEN }}>
        {title}
      </h3>
      
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="font-medium mb-3 text-sm">{item}</p>
            <div className="grid grid-cols-4 gap-2">
              {scale.map((option, optIdx) => {
                const value = (optIdx + 1).toString();
                const fieldName = `${prefix}_${idx}`;
                return (
                  <label key={optIdx} className="flex flex-col items-center p-2 border-2 rounded cursor-pointer hover:bg-green-50 transition-all text-xs"
                    style={{
                      borderColor: formData[fieldName] === value ? MVGFC_GREEN : '#ddd',
                      backgroundColor: formData[fieldName] === value ? LIGHT_GREEN : 'white'
                    }}>
                    <input
                      type="radio"
                      name={fieldName}
                      required
                      value={value}
                      checked={formData[fieldName] === value}
                      onChange={(e) => updateField(fieldName, e.target.value)}
                      className="mb-1 text-green-600"
                    />
                    <span className="text-center">{option.split(' - ')[1] || option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}