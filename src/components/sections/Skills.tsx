import { getTranslations } from 'next-intl/server';
import { skillGroups, tech, type TechId } from '@/data/tech';

function Row({ items, hidden = false }: { items: TechId[]; hidden?: boolean }) {
    return (
        <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-x-10 pr-10 md:gap-x-16 md:pr-16">
            {items.map((id) => {
                const { name, icon: Icon } = tech[id];
                return (
                    <li key={id} className="flex items-center gap-4 whitespace-nowrap">
                        {Icon ? (
                            <Icon aria-hidden="true" className="size-[0.7em] shrink-0 text-accent" />
                        ) : (
                            <span aria-hidden="true" className="size-[0.22em] shrink-0 rounded-full bg-accent" />
                        )}
                        {name}
                    </li>
                );
            })}
        </ul>
    );
}

/**
 * Each group is one oversized line that slides sideways as you scroll,
 * alternating direction. The second copy of a line only fills the gap and
 * is hidden from screen readers.
 */
export default async function Skills() {
    const t = await getTranslations('skills');
    const groups = skillGroups.filter((g) => g.key !== 'earlier');

    return (
        <section id="skills" aria-labelledby="skills-title" className="scroll-mt-20 overflow-hidden py-24 md:py-36">
            <div className="wrap">
                <div className="spine-indent">
                    <h2 id="skills-title" data-spine-node data-fx="title" className="display section-title">
                        {t('title')}
                    </h2>
                    <p data-fx="rise" className="prose-measure mt-6 text-lead text-mist">
                        {t('intro')}
                    </p>
                </div>
            </div>

            <dl className="mt-16 md:mt-24">
                {groups.map((group, i) => (
                    <div key={group.key} className="relative border-t border-line bg-ink py-8 md:py-10">
                        <dt className="wrap">
                            <span className="spine-indent block text-small text-mist">{t(`groups.${group.key}`)}</span>
                        </dt>
                        <dd className="mt-4 overflow-hidden">
                            <div
                                data-fx="marquee"
                                data-dir={i % 2 === 0 ? 1 : -1}
                                className="flex w-max text-[clamp(1.9rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.02em]"
                            >
                                <Row items={group.items} />
                                <Row items={group.items} hidden />
                            </div>
                            {group.note && (
                                <p className="wrap mt-6">
                                    <span className="spine-indent prose-measure block text-mist">
                                        {t(`notes.${group.key}`)}
                                    </span>
                                </p>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="wrap">
                <p className="spine-indent border-t border-line pt-8 text-mist">
                    <span className="font-medium text-paper [font-stretch:112%]">{t('languagesLabel')}:</span>{' '}
                    {t('languages')}
                </p>
            </div>
        </section>
    );
}
