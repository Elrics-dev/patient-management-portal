import { initializeSidebar } from '../components/sidebar.js';
import * as api from '../services/api.js';
import { showToast } from '../components/toast.js';

export function initDashboard() {
    if (!api.isAuthenticated()) { window.location.replace('login.html'); return; }
    initializeSidebar();
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', dateOptions);
    }
    api.getCurrentUser().then(user => {
        const avatar = document.querySelector('.avatar');
        if (avatar) {
            const name = user.fullName || user.username;
            avatar.alt = name;
            avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;
        }
    }).catch(error => {
        showToast('error', 'Session expired', error.message);
        api.logout().finally(() => window.location.replace('login.html'));
    });
}
