import { FiFilm, FiGrid, FiCreditCard, FiCheck } from 'react-icons/fi';

export default function BookingStepper({ currentStep = 1 }) {
  const steps = [
    { num: 1, label: 'Select Show', icon: FiFilm },
    { num: 2, label: 'Pick Seats', icon: FiGrid },
    { num: 3, label: 'Checkout', icon: FiCreditCard },
    { num: 4, label: 'Confirmed', icon: FiCheck },
  ];

  return (
    <nav className="im-stepper" aria-label="Booking Progress">
      <ol className="im-stepper-list">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          const statusClass = isDone ? 'done' : isCurrent ? 'active' : 'upcoming';

          return (
            <li key={s.num} className={`im-step-item ${statusClass}`}>
              <div className="im-step-icon">
                {isDone ? <FiCheck /> : <Icon />}
              </div>
              <span className="im-step-label">{s.label}</span>
              {idx < steps.length - 1 && <span className="im-step-line" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
