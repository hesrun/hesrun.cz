/** Site mark: a pair of curly braces around a dot in the accent colour. */
export default function Mark({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 28 24" className={className} aria-hidden="true" fill="none">
            <path
                d="M8 2.5c-2.6 0-3.4 1.2-3.4 3.4v3.3c0 1.7-.9 2.8-2.6 2.8 1.7 0 2.6 1.1 2.6 2.8v3.3c0 2.2.8 3.4 3.4 3.4M20 2.5c2.6 0 3.4 1.2 3.4 3.4v3.3c0 1.7.9 2.8 2.6 2.8-1.7 0-2.6 1.1-2.6 2.8v3.3c0 2.2-.8 3.4-3.4 3.4"
                stroke="var(--color-paper)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="14" cy="12" r="2.6" fill="var(--color-accent)" />
        </svg>
    );
}
