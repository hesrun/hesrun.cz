import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Cta() {
    const t = await getTranslations('cta');

    return (
        <section
            aria-labelledby="cta-title"
            className="relative overflow-hidden border-t border-line bg-ink-2 py-28 md:py-44"
        >
            <div aria-hidden="true" className="glow -bottom-1/2 left-1/2 h-[120%] w-[90vw] -translate-x-1/2 opacity-60" />
            <div data-fx="grow" className="wrap relative flex flex-col items-center text-center">
                <h2
                    id="cta-title"
                    className="max-w-[16ch] text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.98] tracking-[-0.04em]"
                >
                    {t('title')}
                </h2>
                <p className="prose-measure mt-8 text-lead text-mist">{t('text')}</p>
                <Link href="/contact" className="btn btn-solid mt-10">
                    {t('button')}
                </Link>
            </div>
        </section>
    );
}
