import { getTranslations } from 'next-intl/server';

const ITEMS = ['tehmart', 'stmaria', 'helpmed'] as const;

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
                                    {key === 'stmaria' && (
                                        <div className="mt-10 flex flex-col gap-2">
                                            <p className="display num text-[clamp(3rem,7vw,6rem)] leading-none text-accent">
                                                <span data-count="400">400</span>–<span data-count="500">500</span>
                                            </p>
                                            <p className="max-w-[26rem] text-small leading-snug text-mist">
                                                {t('items.stmaria.statLabel')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
