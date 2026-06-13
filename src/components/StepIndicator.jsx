export default function StepIndicator({ currentStep, totalSteps = 4 }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 my-8">
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div className="flex items-center" key={step}>
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border transition-all ${
                isCompleted
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                  : isActive
                  ? 'bg-zinc-900 text-zinc-100 border-zinc-100 ring-2 ring-zinc-800'
                  : 'bg-zinc-950 text-zinc-550 border-zinc-850'
              }`}
            >
              {isCompleted ? '✓' : step}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-8 sm:w-16 md:w-20 h-0.5 ml-2 md:ml-4 transition-all ${
                  isCompleted ? 'bg-zinc-100' : 'bg-zinc-850'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
