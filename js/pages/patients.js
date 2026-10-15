import { toggleLoading } from '../components/loader.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { renderTable } from '../components/table.js';
import { initializeSidebar } from '../components/sidebar.js';
import * as api from '../services/api.js';

// No fallback arrays used
export function initPatients() {
    if (!api.isAuthenticated()) { window.location.replace('login.html'); return; }
    initializeSidebar();
    
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchPatient');
    const addPatientBtn = document.getElementById('addPatientBtn');
    const patientForm = document.getElementById('patientForm');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    loadPatients();
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadPatients);
    }

    if (searchInput) {
        let searchTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => loadPatients(e.target.value.trim()), 250);
        });
    }

    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', () => {
            if (patientForm) patientForm.reset();
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = 'Register New Patient';
            const patientIdInput = document.getElementById('patientId');
            if(patientIdInput) patientIdInput.value = '';
            openModal('patientModal');
        });
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            closeModal('patientModal');
        });
    }

    if (patientForm) {
        patientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(patientForm);
            const patientData = Object.fromEntries(formData.entries());
            
            try {
                toggleLoading(true, 'Saving Patient...');
                const patientIdInput = document.getElementById('patientId');
                const patientId = patientIdInput ? patientIdInput.value : '';
                
                if (patientId) {
                    await api.updatePatient(patientId, patientData);
                    showToast('success', 'Success', 'Patient updated successfully');
                } else {
                    await api.createPatient(patientData);
                    showToast('success', 'Success', 'Patient registered successfully');
                }
                
                closeModal('patientModal');
                await loadPatients();
            } catch (error) {
                showToast('error', 'Error', error.message || 'Failed to save patient. Please try again.');
            } finally {
                toggleLoading(false);
            }
        });
    }
}

async function loadPatients(query = '') {
    const patientTableBody = document.getElementById('patientTableBody');
    const tableContainer = document.getElementById('tableContainer');
    const emptyState = document.getElementById('emptyState');
    const patientForm = document.getElementById('patientForm');
    
    try {
        toggleLoading(true, 'Loading Patients...');
        const patients = query ? await api.searchPatients(query) : await api.getPatients();
        renderTable(patientTableBody, tableContainer, emptyState, patients, loadPatients, patientForm);
    } catch (error) {
        if (tableContainer) tableContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        showToast('error', 'Error', error.message || 'Failed to load patients.');
    } finally {
        toggleLoading(false);
    }
}
