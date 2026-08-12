const STEPS = ['Pending', 'Preparing', 'Out for delivery', 'Delivered'];

export default function StatusTimeline({ status, compact = false }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <ol className={`flex items-center ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {STEPS.map((step, i) => {
        const passed = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 items-center gap-2 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={[
                  'flex items-center justify-center rounded-full border font-mono text-[10px]',
                  compact ? 'h-4 w-4' : 'h-6 w-6',
                  passed || active
                    ? 'border-forest bg-forest text-paper'
                    : 'border-ink/25 bg-transparent text-ink/40',
                  active ? 'animate-pulse-dot' : '',
                ].join(' ')}
                aria-hidden="true"
              >
                {passed ? '✓' : i + 1}
              </span>
              {!compact && (
                <span className={`text-center text-[11px] leading-tight ${active ? 'text-forest font-semibold' : 'text-ink/50'}`}>
                  {step}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 ${passed ? 'bg-forest' : 'bg-ink/15'}`} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
