
// We'll initialize toggle behavior after DOM is ready to ensure elements exist.
function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.sidebar_toggle');
    if (!sidebar || !toggleBtn) return;

    // Ensure initial ARIA attributes
    const isClosed = sidebar.classList.contains('closed');
    toggleBtn.setAttribute('aria-expanded', isClosed ? 'false' : 'true');
    sidebar.setAttribute('aria-hidden', isClosed ? 'true' : 'false');

    let overlay = null;
    let escHandler = null;
    let resizeTimer = null;

    function createOverlay() {
        if (document.getElementById('sidebar-overlay')) return document.getElementById('sidebar-overlay');
        overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        Object.assign(overlay.style, {
            position: 'fixed',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.25)',
            zIndex: '1000'
        });
        overlay.addEventListener('click', closeSidebar);
        document.body.appendChild(overlay);
        return overlay;
    }

    function removeOverlay() {
        const el = document.getElementById('sidebar-overlay');
        if (el) el.remove();
        overlay = null;
    }

    function openSidebar() {
        sidebar.classList.remove('closed');
        toggleBtn.setAttribute('aria-expanded', 'true');
        sidebar.setAttribute('aria-hidden', 'false');
        // Only create an overlay on small screens (mobile) where the sidebar slides over content
        if ((window.innerWidth || document.documentElement.clientWidth) < 768) {
            createOverlay();
        }
        // set up escape listener
        escHandler = (e) => { if (e.key === 'Escape') closeSidebar(); };
        document.addEventListener('keydown', escHandler);
        // move focus into sidebar (first focusable)
        const focusable = sidebar.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
    }

    function closeSidebar() {
        sidebar.classList.add('closed');
        toggleBtn.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
        removeOverlay();
        if (escHandler) {
            document.removeEventListener('keydown', escHandler);
            escHandler = null;
        }
        // return focus to toggle
        try { toggleBtn.focus(); } catch (e) {}
    }

    function toggle() {
        if (sidebar.classList.contains('closed')) openSidebar(); else closeSidebar();
    }

    // attach click handler
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
    });

    // responsive behavior: ensure overlay removed on large screens
    window.addEventListener('resize', () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const width = window.innerWidth || document.documentElement.clientWidth;
            if (width >= 768) {
                // on larger screens, remove overlay and ensure sidebar isn't hidden by overlay state
                removeOverlay();
                // ensure aria reflects visible sidebar on large screens
                if (!sidebar.classList.contains('closed')) {
                    toggleBtn.setAttribute('aria-expanded', 'true');
                    sidebar.setAttribute('aria-hidden', 'false');
                }
            }
        }, 150);
    });
}

// Mock fetch function - replace with real API calls later
async function fetchPriceData() {
    // Example mock data format. Each product has prices per store.
    return [
        {
            id: 'p1',
            name: 'Organic Bananas (1 lb)',
            prices: {
                Walmart: 0.59,
                Target: 0.69,
                Kroger: 0.63
            },
            urls: {
                Walmart: '#',
                Target: '#',
                Kroger: '#'
            }
        },
        {
            id: 'p2',
            name: 'Free-range Eggs (12 ct)',
            prices: {
                Walmart: 3.49,
                Target: 3.99,
                Kroger: 3.29
            },
            urls: {
                Walmart: '#',
                Target: '#',
                Kroger: '#'
            }
        },
        {
            id: 'p3',
            name: 'Greek Yogurt (32 oz)',
            prices: {
                Walmart: 4.99,
                Target: 5.49,
                Kroger: 4.49
            },
            urls: {
                Walmart: '#',
                Target: '#',
                Kroger: '#'
            }
        }
    ];
}

function formatCurrency(v) {
    if (v === null || v === undefined) return '-';
    return '$' + Number(v).toFixed(2);
}

function renderPriceTable(products) {
    const table = document.getElementById('price-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    products.forEach(p => {
        const walmart = p.prices?.Walmart ?? null;
        const target = p.prices?.Target ?? null;
        const kroger = p.prices?.Kroger ?? null;
        const prices = [walmart, target, kroger].filter(v => typeof v === 'number');
        const lowest = prices.length ? Math.min(...prices) : null;
        const highest = prices.length ? Math.max(...prices) : null;
        const delta = (lowest !== null && highest !== null) ? (highest - lowest) : null;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding:12px;border-bottom:1px solid var(--border-color);">${p.name}</td>
            <td style="text-align:right;padding:12px;border-bottom:1px solid var(--border-color);">${formatCurrency(walmart)}</td>
            <td style="text-align:right;padding:12px;border-bottom:1px solid var(--border-color);">${formatCurrency(target)}</td>
            <td style="text-align:right;padding:12px;border-bottom:1px solid var(--border-color);">${formatCurrency(kroger)}</td>
            <td style="text-align:right;padding:12px;border-bottom:1px solid var(--border-color);font-weight:600;color:var(--secondary-color);">${formatCurrency(lowest)}</td>
            <td style="text-align:center;padding:12px;border-bottom:1px solid var(--border-color);">${delta !== null ? formatCurrency(delta) : '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Bootstrapping: fetch mock data and render table. Replace with real API integration later.
document.addEventListener('DOMContentLoaded', async () => {
    // initialize sidebar toggle (wiring and aria)
    try { initSidebarToggle(); } catch (e) { console.warn('initSidebarToggle failed', e); }
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
    try {
        const data = await fetchPriceData();
        renderPriceTable(data);
    } catch (err) {
        console.error('Error fetching price data', err);
    } finally {
        if (loading) loading.style.display = 'none';
    }
});