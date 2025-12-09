
// We'll initialize toggle behavior after DOM is ready to ensure elements exist.
// function initSidebarToggle() {
//     const sidebar = document.getElementById('sidebar');
//     const toggleBtn = document.querySelector('.sidebar_toggle');
//     if (!sidebar || !toggleBtn) return;

//     // Ensure initial ARIA attributes
//     const isClosed = sidebar.classList.contains('closed');
//     toggleBtn.setAttribute('aria-expanded', isClosed ? 'false' : 'true');
//     sidebar.setAttribute('aria-hidden', isClosed ? 'true' : 'false');

//     let overlay = null;
//     let escHandler = null;

//     function createOverlay() {
//         if (document.getElementById('sidebar-overlay')) return document.getElementById('sidebar-overlay');
//         overlay = document.createElement('div');
//         overlay.id = 'sidebar-overlay';
//         overlay.setAttribute('aria-hidden', 'true');
//         Object.assign(overlay.style, {
//             position: 'fixed',
//             left: '0',
//             top: '0',
//             right: '0',
//             bottom: '0',
//             background: 'rgba(0,0,0,0.25)',
//             zIndex: '1000'
//         });
//         overlay.addEventListener('click', closeSidebar);
//         document.body.appendChild(overlay);
//         return overlay;
//     }

//     function removeOverlay() {
//         const el = document.getElementById('sidebar-overlay');
//         if (el) el.remove();
//         overlay = null;
//     }

//     function openSidebar() {
//         sidebar.classList.remove('closed');
//         toggleBtn.setAttribute('aria-expanded', 'true');
//         sidebar.setAttribute('aria-hidden', 'false');
//         // Only create an overlay on small screens (mobile) where the sidebar slides over content
//         if ((window.innerWidth || document.documentElement.clientWidth) < 768) {
//             createOverlay();
//         }
//         // set up escape listener
//         escHandler = (e) => { if (e.key === 'Escape') closeSidebar(); };
//         document.addEventListener('keydown', escHandler);
//         // move focus into sidebar (first focusable)
//         const focusable = sidebar.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
//         if (focusable) focusable.focus();
//     }

//     function closeSidebar() {
//         sidebar.classList.add('closed');
//         toggleBtn.setAttribute('aria-expanded', 'false');
//         sidebar.setAttribute('aria-hidden', 'true');
//         removeOverlay();
//         if (escHandler) {
//             document.removeEventListener('keydown', escHandler);
//             escHandler = null;
//         }
//         // return focus to toggle
//         try { toggleBtn.focus(); } catch (e) {}
//     }

//     function toggle() {
//         if (sidebar.classList.contains('closed')) openSidebar(); else closeSidebar();
//     }

//     // attach click handler
//     toggleBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         toggle();
//     });

//     // responsive behavior: ensure overlay removed on large screens
//     window.addEventListener('resize', () => {
//         const width = window.innerWidth
//         if (width >= 768) {
//             removeOverlay();
//             if (sidebar.classList.contains("closed")) {
//                 sidebar.classList.remove("closed")
//             }
//         }
//     });
// }

// function formatCurrency(v) {
//     if (v === null || v === undefined) return '-';
//     return '$' + Number(v).toFixed(2);
// }

async function fetchPriceDataWalmart() {
    const walmartString = fetch("walmart.json")
    return (await walmartString).json()
}

async function fetchPriceDataCostco() {
    const costcoString = fetch("costco.json")
    return (await costcoString).json()
}

async function fetchPriceDataSamsclub() {
    const samsclubString = fetch("samsclub.json")
    return (await samsclubString).json()
}

function getPrice(walmart, samsclub, costco) {
    function renderPriceTable(walmart, costco, samsclub) {
        const tableBodyEl = document.querySelector(".tableBody")
        tableBodyEl.innerHTML = ""
        console.log(walmart)
        console.log(costco)
        console.log(samsclub)
        for (let i=0; i < walmart.length || i < costco.length || i< samsclub.length; i++) {
            let walmartRow, samsclubRow, costcoRow;
            if (walmart[i]) {
                walmartRow = `<td>${walmart[i].title} $${walmart[i].price}</td>`
            } else {
                walmartRow = `<td></td>`
            }
            if (samsclub[i]) {
                samsclubRow = `<td>${samsclub[i].name} $${samsclub[i].price}</td>`
            } else {
                samsclubRow = `<td></td>`
            }
            if (costco[i]) {
                costcoRow = `<td>${costco[i].name} $${costco[i].price}</td>`
            } else {
                costcoRow = `<td></td>`
            }
            const tableHtml = `<tr class="price-table-row">
            ${walmartRow}
            ${samsclubRow}
            ${costcoRow}
            </tr>`
            tableBodyEl.insertAdjacentHTML("beforeend", tableHtml)
        }
    }

    function searchHandler(event) {
        event.preventDefault()
        const inputEl = document.querySelector(".search-bar")
        const query = inputEl.value.toLowerCase()
        const walmartFiltered = walmart.filter(dict => {
            return dict.title.toLowerCase().includes(query)
        });
        const costcoFiltered = costco.filter(dict => {
            return dict.name.toLowerCase().includes(query)
        });
        const samsclubFiltered = samsclub.filter(dict => {
            return dict.name.toLowerCase().includes(query)
        });
        renderPriceTable(walmartFiltered, costcoFiltered, samsclubFiltered)
    }

    const searchButton = document.querySelector(".searchButton")
    searchButton.addEventListener("click", searchHandler)
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const walmartData = await fetchPriceDataWalmart();
        const costcoData = await fetchPriceDataCostco();
        const samsclubData = await fetchPriceDataSamsclub();
        getPrice(walmartData, samsclubData, costcoData);
    } catch (err) {
        console.error('Error fetching price data', err);
    } finally {
        if (loading) loading.style.display = 'none';
    }
});