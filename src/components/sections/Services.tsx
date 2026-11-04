import { getTranslations } from 'next-intl/server';
import { SERVICE_KEYS } from '@/data/services';

/** Services as big lines; the one in the middle of the screen is lit, the rest dim. */
export default async function Services() {
    const t = await getTranslations('services');

    return (
        <section id="services" aria-labelledby="services-title" className="scroll-mt-20 py-24 md:py-36">
            <div className="wrap">
                <div className="spine-indent">
                    <h2 id="services-title" data-spine-node data-fx="title" className="display section-title">
                        {t('title')}
                    </h2>
                    <p data-fx="rise" className="prose-measure mt-6 text-lead text-mist">
                        {t('intro')}
                    </p>

                    <div className="mt-16 md:mt-24">
                        {SERVICE_KEYS.map((key) => (
                            <article key={key} data-fx="focus" className="py-10 md:py-14">
                                <div className="rule mb-10 md:mb-14" data-draw />
                                <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end">
                                    <h3 className="text-[clamp(2.1rem,4.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                                        {t(`items.${key}.title`)}
                                    </h3>
                                    <div>
                                        <p className="prose-measure text-lead leading-relaxed text-mist">
                                            {t(`items.${key}.text`)}
                                        </p>
                                        <p className="mt-4 text-small text-paper">{t(`items.${key}.stack`)}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
