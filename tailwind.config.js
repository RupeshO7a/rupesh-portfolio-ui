tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                paper: 'var(--color-paper)',
                ink: 'var(--color-ink)',
                bgLight: 'var(--color-bgLight)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Space Mono', 'monospace'],
                display: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                '2d': '8px 8px 0px 0px var(--color-ink)',
                '2d-hover': '12px 12px 0px 0px var(--color-ink)',
                '2d-sm': '4px 4px 0px 0px var(--color-ink)'
            }
        }
    }
}