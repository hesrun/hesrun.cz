import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;
export type IconComponent = (props: IconProps) => React.JSX.Element;

/** Base for the site's own icons: 1em square, filled with currentColor, hidden from screen readers by default. */
export function Svg({ children, ...props }: IconProps) {
    return (
        <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
            {children}
        </svg>
    );
}
