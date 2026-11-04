import { getTranslations } from 'next-intl/server';
import HeroIntro from '@/components/hero/HeroIntro';
import HeroVisual from '@/components/hero/HeroVisual';
import { Link } from '@/i18n/navigation';

export default async function Hero() {
    const t = await getTranslations('hero');
    const prefix = t('rolePrefix');

    return (
        <section className="relative isolate overflow-hidden pt-16">
            {/* Light and texture behind everything */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
                <div className="glow -right-[50vw] -top-[20vh] h-[70vh] w-[130vw] opacity-70 md:-right-[18vw] md:h-[80vh] md:w-[60vw] md:opacity-80" />
                <div className="glow -bottom-[30vh] -left-[50vw] h-[60vh] w-[130vw] opacity-50 md:-left-[20vw] md:h-[75vh] md:w-[55vw] md:opacity-60" />
                <p className="hero-ghost ghost-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[34vw]">
                    {t('accent')}
                </p>
            </div>
            <div className="absolute inset-0 -z-10">
                <HeroVisual />
            </div>

            <HeroIntro>
                <div className="hero-content wrap flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-20 text-center">
                    <h1 className="text-[clamp(2.5rem,7.2vw,6.75rem)] font-medium leading-[1.02] tracking-[-0.035em]">
                        <span className="block overflow-hidden pb-[0.06em]">
                            <span className="hero-line block">{t('greeting')}</span>
                        </span>
                        <span className="block overflow-hidden pb-[0.06em]">
                            <span className="hero-line block">
                                {prefix && `${prefix} `}
                                <span className="text-accent">{t('accent')}</span> {t('roleSuffix')}
                            </span>
                        </span>
                    </h1>
                    <p className="hero-reveal mx-auto mt-8 max-w-[34rem] text-lead leading-snug text-mist">
                        {t('lead')}
                    </p>
                    <div className="hero-reveal mt-10 flex flex-wrap justify-center gap-3">
                        <Link href="/contact" className="btn btn-solid">
                            {t('ctaPrimary')}
                        </Link>
                        <Link href="/work" className="btn btn-ghost text-paper">
                            {t('ctaSecondary')}
                        </Link>
                    </div>
                </div>
            </HeroIntro>
        </section>
    );
}
