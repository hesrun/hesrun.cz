import { getTranslations } from 'next-intl/server';

const ITEMS = ['tehmart', 'stmaria', 'helpmed'] as const;

/**
 * One result in messages (experience.items.*.stats). A numeric `value` counts
 * up on scroll; `text` is shown as is for results that are not a number.
 */
type Stat = { value?: number; text?: string; prefix?: string; suffix?: string; label: string; was?: string };

function Stats({ stats }: { stats: Stat[] }) {
    return (
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
            {stats.map((s) => (
                // Long text results (e.g. "iOS + Android") take two columns to stay on one line.
                <div key={s.label} className={`flex flex-col gap-2 ${(s.text?.length ?? 0) > 8 ? 'col-span-2' : ''}`}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="display num whitespace-nowrap text-[clamp(2.25rem,4.5vw,3.75rem)] leading-none text-accent">
                        {s.prefix}
                        {s.value !== undefined ? <span data-count={s.value}>{s.value}</span> : s.text}
                        {s.suffix}
                    </dd>
                    <dd className="max-w-[16rem] text-small leading-snug text-mist" aria-hidden="true">
                        {s.label}
                        {s.was && <span className="mt-1 block text-paper/60">{s.was}</span>}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default async function Experience() {
    const t = await getTranslations('experience');

    return (
        <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 py-24 md:py-36">
            <div className="wrap">
                <div className="spine-indent">
                    <h2 id="experience-title" data-spine-node data-fx="title" className="display section-title">
                        {t('title')}
                    </h2>
                    {/* The intro reads as a statement: words light up while it scrolls past. */}
                    <p
                        data-fx="words"
                        className="mt-10 max-w-[22ch] text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] sm:max-w-[28ch]"
                    >
                        {t('intro')}
                    </p>

                    <ol className="mt-24 md:mt-36">
                        {ITEMS.map((key) => (
                            <li
                                key={key}
                                data-fx="rise"
                                className="grid gap-x-12 gap-y-3 border-t border-line py-12 md:grid-cols-[11rem_1fr] md:py-16"
                            >
                                <p data-spine-node className="num pt-1.5 text-small text-mist">
                                    {t(`items.${key}.period`)}
                                </p>
                                <div>
                                    <h3 className="text-h3 font-semibold leading-tight [font-stretch:112%]">
                                        {t(`items.${key}.company`)}
                                    </h3>
                                    <p className="mt-1 text-mist">{t(`items.${key}.role`)}</p>
                                    <p className="prose-measure mt-5">{t(`items.${key}.text`)}</p>
                                    <Stats stats={t.raw(`items.${key}.stats`) as Stat[]} />
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
