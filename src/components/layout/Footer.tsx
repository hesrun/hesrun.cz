import { getTranslations } from 'next-intl/server';
import { PERSON } from '@/lib/site';

export default async function Footer() {
    const t = await getTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-line bg-ink-2">
            <div className="wrap flex flex-col items-center gap-6 py-10 text-center text-small text-mist md:flex-row md:justify-between md:text-left">
                <p className="num">
                    © {year} {t('rights')}
                </p>
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <li>
                        <a className="transition-colors hover:text-accent focus-visible:text-accent" href={`mailto:${PERSON.email}`}>
                            {PERSON.email}
                        </a>
                    </li>
                    <li>
                        <a className="transition-colors hover:text-accent focus-visible:text-accent" href={PERSON.github} rel="me noopener" target="_blank">
                            GitHub
                        </a>
                    </li>
                    <li>
                        <a className="transition-colors hover:text-accent focus-visible:text-accent" href={PERSON.linkedin} rel="me noopener" target="_blank">
                            LinkedIn
                        </a>
                    </li>
                </ul>
                <p>{t('built')}</p>
            </div>
        </footer>
    );
}
