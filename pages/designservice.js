import { useState, useEffect, useRef } from 'react';

export default function DesignService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [enabledSteps, setEnabledSteps] = useState([1]); // Step 1 enabled initially

  const designFormRef = useRef(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    console.log('Form submitted:', data);
    setShowProjectForm(false);
    completeStep(1);
    updateProgress(2);
    enableStep(2);
    alert('Form submitted successfully! You can now book your consultation.');
  };

  // Step helpers
  function completeStep(stepNumber) {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepNumber)) return [...prev, stepNumber];
      return prev;
    });
  }

  function enableStep(stepNumber) {
    setEnabledSteps((prev) => {
      if (!prev.includes(stepNumber)) return [...prev, stepNumber];
      return prev;
    });
  }

  function updateProgress(stepNumber) {
    setCurrentStep(stepNumber);
  }

  // Button click handlers
  function showForm() {
    setShowProjectForm(true);
    setTimeout(() => {
      if (designFormRef.current) {
        designFormRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  function hideForm() {
    setShowProjectForm(false);
  }

  function bookConsultation() {
    setShowConsultationModal(true);
  }

  function selectTimeSlot(slot) {
    setSelectedTimeSlot(slot);
  }

  function confirmConsultation() {
    if (!selectedTimeSlot) return;
    setShowConsultationModal(false);
    completeStep(2);
    updateProgress(3);
    enableStep(3);
    alert(`Consultation booked for ${selectedTimeSlot}! We'll send you a calendar invite shortly.`);
  }

  function reviewDraft() {
    setShowDraftModal(true);
  }

  function submitFeedback() {
    if (feedback.trim()) {
      console.log('Feedback submitted:', feedback);
      setShowDraftModal(false);
      completeStep(3);
      updateProgress(4);
      enableStep(4);
      alert("Feedback submitted! We'll incorporate your changes and have the final design ready soon.");
      setFeedback('');
    } else {
      alert('Please provide your feedback before submitting.');
    }
  }

  function getFinalProduct() {
    setShowFinalModal(true);
    completeStep(4);
    updateProgress(4);
  }

  function closeModal() {
    setShowConsultationModal(false);
    setShowDraftModal(false);
    setShowFinalModal(false);
  }

  // Close modals on clicking outside modal content
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        closeModal();
      }
    }
    if (showConsultationModal || showDraftModal || showFinalModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConsultationModal, showDraftModal, showFinalModal]);

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="container">
      <div className="header">
        <h1>Design Service</h1>
        <p>Transform your vision into reality with our simple 4-step process</p>
      </div>

      <div className="progress-bar" style={{ border: '1px solid #ccc', height: '10px', width: '100%', marginBottom: '20px' }}>
        <div
          id="progressFill"
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Steps */}
      <div className="steps-container">
        {[1, 2, 3, 4].map((step) => {
          const stepInfo = {
            1: {
              title: 'Fill Out Form',
              description:
                'Tell us about your project requirements, preferences, and goals so we can understand your vision perfectly.',
              buttonText: completedSteps.includes(1) ? '✓ Completed' : 'Start Project',
              buttonAction: showForm,
            },
            2: {
              title: 'Book Consultation',
              description:
                'Schedule a quick 10-minute call to discuss your project details and clarify any questions.',
              buttonText: completedSteps.includes(2) ? '✓ Completed' : 'Book Call',
              buttonAction: bookConsultation,
            },
            3: {
              title: 'Review First Draft',
              description:
                'Receive your initial design draft and provide feedback for any changes or improvements needed.',
              buttonText: completedSteps.includes(3) ? '✓ Completed' : 'View Draft',
              buttonAction: reviewDraft,
            },
            4: {
              title: 'Receive Final Product',
              description:
                'Get your polished, final design delivered in all the formats you need for immediate use.',
              buttonText: completedSteps.includes(4) ? '✓ Completed' : 'Download Files',
              buttonAction: getFinalProduct,
            },
          };

          const isDisabled = !enabledSteps.includes(step) || completedSteps.includes(step);

          return (
            <div className="step-card" id={`step${step}`} key={step} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
              <div className="step-number" style={{ fontWeight: 'bold', fontSize: '20px' }}>{step}</div>
              <h3>{stepInfo[step].title}</h3>
              <p>{stepInfo[step].description}</p>
              <button
                className="step-button"
                onClick={stepInfo[step].buttonAction}
                disabled={isDisabled}
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
              >
                {stepInfo[step].buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Project Form */}
      {showProjectForm && (
        <div className="form-container" id="projectForm" ref={designFormRef}>
          <h2>Project Information Form</h2>
          <form id="designForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="company">Company/Organization</label>
              <input type="text" id="company" name="company" />
            </div>

            <div className="form-group">
              <label htmlFor="projectType">Project Type *</label>
              <select id="projectType" name="projectType" required defaultValue="">
                <option value="" disabled>
                  Select project type
                </option>
                <option value="logo">Logo Design</option>
                <option value="website">Website Design</option>
                <option value="branding">Brand Identity</option>
                <option value="print">Print Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget">Budget Range *</label>
                <select id="budget" name="budget" required defaultValue="">
                  <option value="" disabled>
                    Select budget
                  </option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="timeline">Timeline *</label>
                <select id="timeline" name="timeline" required defaultValue="">
                  <option value="" disabled>
                    Select timeline
                  </option>
                  <option value="1-2weeks">1-2 weeks</option>
                  <option value="2-4weeks">2-4 weeks</option>
                  <option value="1-2months">1-2 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="projectDescription">Project Description *</label>
              <textarea id="projectDescription" name="projectDescription" required></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="inspiration">Inspiration/References</label>
              <textarea id="inspiration" name="inspiration"></textarea>
            </div>

            <div className="form-actions" style={{ marginTop: '15px' }}>
              <button type="button" className="step-button cancel-btn" onClick={hideForm}>
                Cancel
              </button>
              <button type="submit" className="step-button">
                Submit Form
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Consultation Modal */}
      {showConsultationModal && (
        <div className="modal" style={modalBackdropStyle}>
          <div className="modal-content" style={modalContentStyle} ref={modalRef}>
            <button
              className="close"
              onClick={closeModal}
              style={modalCloseButtonStyle}
              aria-label="Close consultation modal"
            >
              &times;
            </button>
            <h2>Book Your Consultation</h2>
            <p>
              Great! We've received your project details. Please select a convenient time for your 10-minute
              consultation call.
            </p>
            <div className="time-slots" style={{ marginBottom: '15px' }}>
              {['Today 2:00 PM', 'Today 4:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 2:00 PM'].map((slot) => (
                <button
                  key={slot}
                  className={`time-slot ${selectedTimeSlot === slot ? 'selected' : ''}`}
                  onClick={() => selectTimeSlot(slot)}
                  style={{
                    marginRight: '8px',
                    padding: '8px 12px',
                    backgroundColor: selectedTimeSlot === slot ? '#4caf50' : '#eee',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button
              className="step-button"
              id="confirmConsultation"
              disabled={!selectedTimeSlot}
              onClick={confirmConsultation}
              style={{
                cursor: selectedTimeSlot ? 'pointer' : 'not-allowed',
                padding: '10px 20px',
              }}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <div className="modal" style={modalBackdropStyle}>
          <div className="modal-content" style={modalContentStyle} ref={modalRef}>
            <button
              className="close"
              onClick={closeModal}
              style={modalCloseButtonStyle}
              aria-label="Close draft modal"
            >
              &times;
            </button>
            <h2>First Draft Ready!</h2>
            <p>Your initial design is complete. Please review and provide your feedback.</p>
            <div className="draft-preview" style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
              <div className="draft-placeholder" style={{ fontSize: '30px', textAlign: 'center' }}>
                📋 Design Preview
              </div>
            </div>
            <textarea
              placeholder="Your feedback and change requests..."
              id="draftFeedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ width: '100%', height: '100px', marginBottom: '15px' }}
            />
            <button className="step-button" onClick={submitFeedback} style={{ padding: '10px 20px' }}>
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* Final Modal */}
      {showFinalModal && (
        <div className="modal" style={modalBackdropStyle}>
          <div className="modal-content" style={modalContentStyle} ref={modalRef}>
            <button
              className="close"
              onClick={closeModal}
              style={modalCloseButtonStyle}
              aria-label="Close final modal"
            >
              &times;
            </button>
            <h2>Final Design Complete!</h2>
            <p>Your project is finished! Download your files below.</p>
            <div className="download-links" style={{ display: 'flex', gap: '10px' }}>
              <button className="step-button" style={{ padding: '10px 15px' }}>
                Download PNG
              </button>
              <button className="step-button" style={{ padding: '10px 15px' }}>
                Download PDF
              </button>
              <button className="step-button" style={{ padding: '10px 15px' }}>
                Download Source Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
