'use client';

import emailjs from '@emailjs/browser';
import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import { z } from 'zod';

const TYPES = ['sites', 'apps', 'ai', 'motion', 'performance', 'other'] as const;
const BUDGETS = ['s', 'm', 'l', 'xl', 'unsure'] as const;
const TIMELINES = ['asap', 'quarter', 'later'] as const;
const MIN_MESSAGE = 30;

const schema = z.object({
    name: z.string().trim().min(1, 'name'),
    email: z.email('email'),
    company: z.string().trim().optional(),
    type: z.enum(TYPES, 'type'),
    budget: z.enum(BUDGETS).optional(),
    timeline: z.enum(TIMELINES).optional(),
    message: z.string().trim().min(MIN_MESSAGE, 'message'),
});

type Field = 'name' | 'email' | 'type' | 'message';
type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldClass =
    'mt-2 block w-full rounded-md border border-line bg-ink-2 px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-mist/60 hover:border-mist/50 focus:border-accent aria-[invalid=true]:border-[#e88a7d]';

export default function CollabForm() {
    const t = useTranslations('contact.form');
    const uid = useId();
    const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
    const [status, setStatus] = useState<Status>('idle');

    const id = (name: string) => `${uid}-${name}`;
    const errorText = (f: Field) =>
        errors[f] ? (
            <p id={id(`${f}-error`)} className="mt-2 text-small text-[#f0a397]">
                {errors[f]}
            </p>
        ) : null;
    const describedBy = (f: Field) => (errors[f] ? id(`${f}-error`) : undefined);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const raw = Object.fromEntries(new FormData(form));
        const parsed = schema.safeParse({
            ...raw,
            budget: raw.budget || undefined,
            timeline: raw.timeline || undefined,
        });

        if (!parsed.success) {
            const next: Partial<Record<Field, string>> = {};
            for (const issue of parsed.error.issues) {
                const f = issue.path[0] as Field;
                if (!next[f]) next[f] = t(`errors.${f}`);
            }
            setErrors(next);
            const first = (['name', 'email', 'type', 'message'] as Field[]).find((f) => next[f]);
            form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
            return;
        }

        setErrors({});
        setStatus('sending');
        const d = parsed.data;
        const summary = [
            `Type: ${t(`types.${d.type}`)}`,
            d.budget && `Budget: ${t(`budgets.${d.budget}`)}`,
            d.timeline && `Launch: ${t(`timelines.${d.timeline}`)}`,
            d.company && `Company: ${d.company}`,
        ]
            .filter(Boolean)
            .join('\n');

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
                {
                    name: d.name,
                    email: d.email,
                    message: `${summary}\n\n${d.message}`,
                    company: d.company ?? '',
                    project_type: d.type,
                    budget: d.budget ?? '',
                    timeline: d.timeline ?? '',
                },
                { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '' },
            );
            form.reset();
            setStatus('success');
        } catch {
            // Keep what the visitor typed so they can retry.
            setStatus('error');
        }
    }

    return (
        <form onSubmit={onSubmit} noValidate className="grid gap-8">
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <label htmlFor={id('name')} className="text-small text-mist">
                        {t('name')}
                    </label>
                    <input
                        id={id('name')}
                        name="name"
                        autoComplete="name"
                        className={fieldClass}
                        aria-invalid={!!errors.name}
                        aria-describedby={describedBy('name')}
                    />
                    {errorText('name')}
                </div>
                <div>
                    <label htmlFor={id('email')} className="text-small text-mist">
                        {t('email')}
                    </label>
                    <input
                        id={id('email')}
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={fieldClass}
                        aria-invalid={!!errors.email}
                        aria-describedby={describedBy('email')}
                    />
                    {errorText('email')}
                </div>
            </div>

            <div>
                <label htmlFor={id('company')} className="text-small text-mist">
                    {t('company')} <span className="text-mist/70">({t('optional')})</span>
                </label>
                <input id={id('company')} name="company" autoComplete="organization" className={fieldClass} />
            </div>

            <fieldset aria-describedby={describedBy('type')}>
                <legend className="text-small text-mist">{t('type')}</legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                    {TYPES.map((type) => (
                        <label key={type} className="cursor-pointer">
                            <input type="radio" name="type" value={type} className="peer sr-only" />
                            <span className="inline-flex min-h-11 items-center rounded-full border border-line px-4 py-2 transition-colors hover:border-mist/60 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-ink-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                                {t(`types.${type}`)}
                            </span>
                        </label>
                    ))}
                </div>
                {errorText('type')}
            </fieldset>

            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <label htmlFor={id('budget')} className="text-small text-mist">
                        {t('budget')} <span className="text-mist/70">({t('optional')})</span>
                    </label>
                    <select id={id('budget')} name="budget" defaultValue="" className={fieldClass}>
                        <option value="">—</option>
                        {BUDGETS.map((b) => (
                            <option key={b} value={b}>
                                {t(`budgets.${b}`)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor={id('timeline')} className="text-small text-mist">
                        {t('timeline')} <span className="text-mist/70">({t('optional')})</span>
                    </label>
                    <select id={id('timeline')} name="timeline" defaultValue="" className={fieldClass}>
                        <option value="">—</option>
                        {TIMELINES.map((tl) => (
                            <option key={tl} value={tl}>
                                {t(`timelines.${tl}`)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor={id('message')} className="text-small text-mist">
                    {t('message')}
                </label>
                <textarea
                    id={id('message')}
                    name="message"
                    rows={7}
                    placeholder={t('messageHint')}
                    className={`${fieldClass} resize-y`}
                    aria-invalid={!!errors.message}
                    aria-describedby={describedBy('message')}
                    data-lenis-prevent
                />
                {errorText('message')}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <button type="submit" className="btn btn-solid cursor-pointer" disabled={status === 'sending'}>
                    {status === 'sending' ? t('sending') : t('submit')}
                </button>
                <p role="status" aria-live="polite" className="max-w-[32rem] text-small">
                    {status === 'success' && <span className="text-accent">{t('success')}</span>}
                    {status === 'error' && <span className="text-[#f0a397]">{t('error')}</span>}
                </p>
            </div>
        </form>
    );
}
