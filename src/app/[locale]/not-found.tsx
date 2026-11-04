import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
    const t = await getTranslations('notFound');
    return (
        <div className="wrap flex min-h-[80svh] flex-col justify-center pb-24 pt-36">
            <p className="display num text-[clamp(4rem,14vw,11rem)] leading-none text-line">404</p>
            <h1 className="display mt-6 text-h2">{t('title')}</h1>
            <p className="prose-measure mt-5 text-lead text-mist">{t('text')}</p>
            <Link href="/" className="btn btn-solid mt-10 self-start">
                {t('home')}
            </Link>
        </div>
    );
}
