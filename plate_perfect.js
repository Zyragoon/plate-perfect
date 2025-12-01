function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');
}

document.querySelector(".sidebar_toggle").addEventListener("click", toggleSidebar)