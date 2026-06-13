export default function StepIndicator({ currentStep, totalSteps = 4 }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div className="step-item" key={step}>
          <div
            className={`step-circle ${
              step === currentStep ? 'active' : step < currentStep ? 'completed' : ''
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`step-line ${
                step < currentStep ? 'completed' : step === currentStep ? 'active' : ''
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
