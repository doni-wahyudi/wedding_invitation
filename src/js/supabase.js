// ============================================
// SUPABASE CLIENT MODULE
// ============================================

import { createClient } from '@supabase/supabase-js';

// ---- Configuration ----
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://bjuxscxcmvtsyebxqhtb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqdXhzY3hjbXZ0c3llYnhxaHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDg0MTcsImV4cCI6MjA4ODA4NDQxN30.k_7-4mk-DlXPR-sPpS6momIyiz-0J_HqAsskaS85gQk';

let supabase = null;
let isConfigured = false;

// ---- Initialize ----
export function initSupabase() {
    try {
        if (SUPABASE_URL === 'https://your-project.supabase.co') {
            console.warn('⚠️ Supabase belum dikonfigurasi. Silakan update SUPABASE_URL dan SUPABASE_ANON_KEY di src/js/supabase.js');
            isConfigured = false;
            return;
        }
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        isConfigured = true;
        console.log('✅ Supabase connected');
    } catch (error) {
        console.error('❌ Supabase initialization error:', error);
        isConfigured = false;
    }
}

// ---- Verify Guest by Slug ----
export async function verifyGuest(slug) {
    if (!isConfigured || !slug) return null;

    try {
        const { data, error } = await supabase
            .from('guests')
            .select('*')
            .eq('slug', slug.toLowerCase().trim())
            .maybeSingle();

        if (error) throw error;
        return data; // null if not found, guest object if found
    } catch (error) {
        console.error('Error verifying guest:', error);
        return null;
    }
}

// ---- Submit Message ----
export async function submitMessage({ name, message }) {
    if (!isConfigured) {
        // Offline mode: save locally and show in feed
        saveLocalMessage({ name, message });
        return { success: true, offline: true };
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([{ name, message }])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error submitting message:', error);
        // Fallback to local
        saveLocalMessage({ name, message });
        return { success: true, offline: true };
    }
}

// ---- Load Messages ----
export async function loadMessages() {
    const feedEl = document.getElementById('messages-feed');
    const loadingEl = document.getElementById('messages-loading');

    if (!feedEl) return;

    let messages = [];

    if (isConfigured) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            messages = data || [];
        } catch (error) {
            console.error('Error loading messages:', error);
            messages = getLocalMessages();
        }
    } else {
        messages = getLocalMessages();
    }

    // Clear loading
    if (loadingEl) loadingEl.style.display = 'none';

    // Render messages
    if (messages.length === 0) {
        feedEl.innerHTML = `
      <div class="messages-loading">
        <span>Belum ada ucapan. Jadilah yang pertama! 💌</span>
      </div>
    `;
        return;
    }

    feedEl.innerHTML = messages.map(msg => createMessageCard(msg)).join('');
}

// ---- Submit RSVP ----
export async function submitRSVP({ name, attendance, guest_count, message }) {
    if (!isConfigured) {
        // Save locally
        saveLocalRSVP({ name, attendance, guest_count, message });
        return { success: true, offline: true };
    }

    try {
        const { data, error } = await supabase
            .from('rsvp')
            .insert([{ name, attendance, guest_count, message }])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        saveLocalRSVP({ name, attendance, guest_count, message });
        return { success: true, offline: true };
    }
}

// ---- Helper: Create Message Card HTML ----
function createMessageCard(msg) {
    const initials = msg.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const time = msg.created_at
        ? formatTimeAgo(new Date(msg.created_at))
        : 'Baru saja';

    return `
    <div class="message-card">
      <div class="message-card-header">
        <div class="message-avatar">${initials}</div>
        <div>
          <div class="message-name">${escapeHtml(msg.name)}</div>
          <div class="message-time">${time}</div>
        </div>
      </div>
      <p class="message-text">${escapeHtml(msg.message)}</p>
    </div>
  `;
}

// ---- Local Storage Fallback ----
function saveLocalMessage({ name, message }) {
    const messages = getLocalMessages();
    messages.unshift({
        id: Date.now(),
        name,
        message,
        created_at: new Date().toISOString(),
    });
    localStorage.setItem('wedding_messages', JSON.stringify(messages.slice(0, 50)));
}

function getLocalMessages() {
    try {
        return JSON.parse(localStorage.getItem('wedding_messages') || '[]');
    } catch {
        return [];
    }
}

function saveLocalRSVP({ name, attendance, guest_count, message }) {
    const rsvps = getLocalRSVPs();
    rsvps.push({
        id: Date.now(),
        name,
        attendance,
        guest_count,
        message,
        created_at: new Date().toISOString(),
    });
    localStorage.setItem('wedding_rsvp', JSON.stringify(rsvps));
}

function getLocalRSVPs() {
    try {
        return JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
    } catch {
        return [];
    }
}

// ---- Utility ----
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 30) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
