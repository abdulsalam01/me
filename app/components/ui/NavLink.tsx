type Props = {
    href: string;
    label: string;
    onClick?: () => void;
};

export default function NavLink({ href, label, onClick }: Props) {
    return (
        <a
            href={href}
            onClick={onClick}
            className="group relative inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-white/80 transition
                 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
            <span className="relative z-10">{label}</span>
            <span
                className="absolute inset-0 -z-0 rounded-full bg-white/5 opacity-0 blur-sm transition duration-300
                   group-hover:opacity-100"
                aria-hidden="true"
            />
            <span
                className="absolute left-3 right-3 bottom-1 h-px scale-x-0 bg-gradient-to-r from-transparent via-white/60 to-transparent
                   transition duration-300 group-hover:scale-x-100"
                aria-hidden="true"
            />
        </a>
    );
}
