"use client";

export default function Privacy() {
  return (
    <section id="privacy" className="py-xl px-margin-mobile tablet:px-margin-desktop bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display-md text-display-md mb-lg">
          Your Privacy is Our <span className="text-primary italic font-display-md">Sanctuary</span>
        </h2>
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-primary">security</span>
            </div>
            <h4 className="font-title-md mb-xs">End-to-End</h4>
            <p className="font-body-md text-secondary">
              Your journals are yours alone, encrypted at every step.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-primary">visibility_off</span>
            </div>
            <h4 className="font-title-md mb-xs">Zero Tracking</h4>
            <p className="font-body-md text-secondary">
              We never sell your data. We aren&rsquo;t an ad company.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-primary">verified_user</span>
            </div>
            <h4 className="font-title-md mb-xs">You Control</h4>
            <p className="font-body-md text-secondary">
              Delete any memory or interaction instantly, forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
