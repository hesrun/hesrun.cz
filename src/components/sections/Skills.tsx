import { getTranslations } from 'next-intl/server';
import { skillGroups, tech, type TechId } from '@/data/tech';

function Row({ items, hidden = false }: { items: TechId[]; hidden?: boolean }) {
    return (
        <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-x-10 pr-10 md:gap-x-16 md:pr-16">
            {items.map((id) => {
                const { name, icon: Icon, color } = tech[id];
                return (
                    <li key={id} className="flex items-center gap-4 whitespace-nowrap">
                        {Icon ? (
                            <Icon className="size-[0.75em] shrink-0" style={{ color }} />
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
 * Each group is one oversized line that drifts sideways on its own (faster while you scroll),
 * alternating direction. The second copy of a line only fills the gap and
 * is hidden from screen readers.
 */
export default async function Skills() {
    const t = await getTranslations('skills');

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

            <dl className="mt-16 border-b border-line md:mt-24">
                {skillGroups.map((group, i) => (
                    <div key={group.key} className="relative border-t border-line bg-ink pb-12 pt-16 md:pb-16 md:pt-20">
                        {/* Label sits on the divider, centred, and cuts the line like a tab. */}
                        <dt className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                            <span className="inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-accent/40 bg-ink-2 px-6 py-3 text-[clamp(1rem,1.6vw,1.375rem)] font-medium leading-none tracking-[-0.01em] shadow-[0_0_0_8px_var(--color-ink),0_0_32px_-6px_color-mix(in_oklab,var(--color-accent)_45%,transparent)] md:px-8 md:py-4">
                                <span className="num text-small text-accent">{String(i + 1).padStart(2, '0')}</span>
                                <span aria-hidden="true" className="h-4 w-px bg-accent/40" />
                                {t(`groups.${group.key}`)}
                            </span>
                        </dt>
                        <dd className="overflow-hidden">
                            <div
                                data-fx="marquee"
                                data-dir={i % 2 === 0 ? 1 : -1}
                                className="flex w-max text-[clamp(1.9rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.02em]"
                            >
                                {/* Four copies so the loop never shows a gap, even on wide screens. */}
                                <Row items={group.items} />
                                <Row items={group.items} hidden />
                                <Row items={group.items} hidden />
                                <Row items={group.items} hidden />
                            </div>
                            {group.note && (
                                <p className="wrap mt-6">
                                    <span className="prose-measure mx-auto block text-center text-mist">
                                        {t(`notes.${group.key}`)}
                                    </span>
                                </p>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
