/* ============================================================
   KOTS — AI Chat Assistant for Gud Space Gym
   Fully self-contained — safe to add to any page
   ============================================================ */

(function () {
  'use strict';

  /* ---- CONFIG ---- */
  const API_URL = 'https://gudspace-gym-backend.onrender.com/api/ai/kots';

  const SYSTEM_PROMPT = `You are Kots, the AI assistant of Gud Space Gym. You are helpful, friendly, and direct. You speak like a real person — not a robot. Keep answers short and clear. No bullet point overload. No emojis. If you don't know something, say so honestly and point them to the owners.

Gym Information:
- Name: Gud Space Gym
- Location: 9 E. Rodriguez corner Lakandula St., Parang, Marikina City, Philippines 1708
- Operating Hours: Open daily, 6:30 AM to 11:00 PM
- Owners: Rommelle Olaer Bungay and Mara De Guzman
- Owner FB (Rommelle): https://web.facebook.com/rommelle.bungay/
- Owner FB (Mara): https://web.facebook.com/mkarizzle
- Official FB Page: https://web.facebook.com/gudspacegym
- FB Community Group: https://web.facebook.com/groups/1052213886173595/members
- Locker rental: available for 200 pesos per month
- Showers: not available
- Trainers/Coaches: For inquiries, message the owners directly on Facebook.
- Equipment: For the full list, visit the gym or message the owners.

Membership Pricing:
- Walk-in rate: 100 pesos per session (no commitment, perfect for first-timers)
- Monthly: 900 pesos/month (unlimited access, full portal access, workout and nutrition tracking). Includes a 100-peso key card deposit — one-time, refundable.
- 4-Month Package: 3,400 pesos total. Months 1-2: 2,000 pesos. Months 3-4: 1,400 pesos.
- 6-Month Package: 5,400 pesos total. Includes 1 free month. Months 1-3: 3,000 pesos. Months 4-6: 2,400 pesos.
- 1-Year Package: 10,500 pesos total. Includes 3 free months. Months 1-5: 5,000 pesos. Months 6-12: 5,500 pesos.
- All memberships are non-transferable and non-refundable.

Registration: Users can register at gudspacegym.com. For in-person registration, visit the gym during operating hours.

About the Creator:
If asked who built or developed this website or portal, respond with something like this (you can vary the wording, keep it natural):
"The portal was built by Ed Gerard Aquino — a Licensed Professional Teacher, National Lecturer, and developer based in Marikina. He's trained over 3,000 reviewees nationwide, graduated Summa Cum Laude, and topped national board examinations. Safe to say the person behind this knows what they're doing."
Do not share his portfolio link or resume. Do not make it sound like a bio read from a document. Make it sound like you're genuinely impressed but keeping it casual.

Tone Rules:
- Sound like a real person, not a chatbot.
- Be conversational but not too casual. Think: smart friend who knows the gym well.
- Short answers are better than long ones. Get to the point.
- Do not say "Certainly!", "Of course!", "Great question!", or any AI filler phrases.
- Do not use bullet points unless it genuinely helps (like listing prices).
- If something is funny or absurd, you can acknowledge it briefly before redirecting.

Handling Off-Topic or Nonsense Questions:
- If the question is clearly a joke or nonsense: give a short witty reply, then bring it back to the gym.
- If the question is rude or offensive: decline politely and say something like "That's not really something I can help with. Anything gym-related I can answer for you?"
- If the user says something offensive or inappropriate repeatedly: say "I'll pretend I didn't read that. Anything gym-related I can answer for you? Keep it clean — the creator's watching."
- For completely off-topic general questions: answer briefly using your general knowledge, then offer to help with gym-related topics.

Facebook / Updates:
- For latest announcements or promos: direct them to https://web.facebook.com/gudspacegym
- For community and member discussions: https://web.facebook.com/groups/1052213886173595/members
- For direct inquiries: message the owners on Facebook.

If you are ever unsure about something specific (like current promos, events, or equipment details), say: "I'm not 100% sure on that one — best to check the gym's Facebook page or message the owners directly."`;

  const FAQ_PRIMARY = [
    { label: 'Membership Prices',  prompt: 'What are the membership prices?' },
    { label: 'Operating Hours',    prompt: 'What are your operating hours?' },
    { label: 'Location',           prompt: 'Where is the gym located?' },
    { label: 'How to Register',    prompt: 'How do I register or sign up?' },
    { label: 'Walk-in Rate',       prompt: 'Is there a walk-in fee?' },
    { label: 'Locker / Facilities',prompt: 'Do you have lockers or facilities?' },
    { label: 'Contact the Gym',    prompt: 'How can I contact or message the gym?' },
    { label: 'About the Gym',      prompt: 'Tell me about Gud Space Gym.' },
  ];

  const FAQ_MORE = [
    { label: 'Do you have a trainer?',  prompt: 'Do you have a coach or personal trainer?' },
    { label: 'Latest Updates',          prompt: 'Where can I find the latest gym updates and announcements?' },
    { label: 'Join Community',          prompt: 'Is there a community group I can join?' },
    { label: 'Beginner-friendly?',      prompt: 'Is the gym beginner-friendly? Do you accept beginners?' },
    { label: 'Can I visit first?',      prompt: 'Can I visit the gym first before signing up?' },
    { label: 'Who owns the gym?',       prompt: 'Who are the owners of the gym?' },
    { label: 'Who made this?',          prompt: 'Who created or developed this website?' },
    { label: 'How to Check In',         prompt: 'How do I check in using the portal?' },
  ];

  /* ---- STORAGE KEY (per-page so each page has its own memory) ---- */
  const STORAGE_KEY = 'kots_convo_' + (window.location.pathname.split('/').pop() || 'index');

  /* ---- STATE ---- */
  let isOpen        = false;
  let isThinking    = false;
  let showingMore   = false;
  let conversation  = []; // { role, content }

  /* ---- MEMORY: save & load conversation ---- */
  function saveConvo() {
    try {
      const toSave = conversation.slice(-20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch(e) { /* fail silently */ }
  }

  function loadConvo() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) || [];
    } catch(e) { return []; }
  }

  /* ---- HELPERS ---- */
  function getToken() {
    try {
      const raw = localStorage.getItem('gudspace_currentUser');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed ? parsed.token : null;
    } catch { return null; }
  }

  function getTime() {
    const now = new Date();
    let h = now.getHours(), m = String(now.getMinutes()).padStart(2,'0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function formatResponse(text) {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    return escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(urlRegex, '<a href="$1" target="_blank" rel="noopener" style="color:#FF1A5E;text-decoration:underline;">$1</a>');
  }

  /* ---- BUILD UI ---- */
  function buildUI() {
    // Pill
    const pill = document.createElement('div');
    pill.id = 'kots-pill';
    pill.innerHTML = '<span class="kots-pill-dot"></span> Ask Kots';
    pill.addEventListener('click', openChat);
    document.body.appendChild(pill);

    // Window
    const win = document.createElement('div');
    win.id = 'kots-window';
    win.style.display = 'none';
    win.innerHTML = `
      <div id="kots-header">
        <div class="kots-header-left">
          <div class="kots-avatar">K</div>
          <div>
            <div class="kots-name">Kots</div>
            <div class="kots-status"><span class="kots-status-dot"></span>Online</div>
          </div>
        </div>
        <button class="kots-minimize-btn" id="kotsMinBtn" title="Minimize">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14"/>
          </svg>
        </button>
      </div>

      <div id="kots-messages"></div>

      <div id="kots-faq"></div>

      <div id="kots-input-wrap">
        <textarea id="kots-input" rows="1" placeholder="Ask Kots anything..."></textarea>
        <button id="kots-send-btn" title="Send">
          <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(win);

    // Events
    document.getElementById('kotsMinBtn').addEventListener('click', closeChat);
    document.getElementById('kots-send-btn').addEventListener('click', handleSend);
    document.getElementById('kots-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    // Auto-resize textarea
    document.getElementById('kots-input').addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });

    renderChips(showingMore);

    // Restore saved conversation if any
    const saved = loadConvo();
    if (saved.length > 0) {
      conversation = saved;
      // Render saved messages in UI
      saved.forEach(function(msg) {
        appendMessage(msg.role === 'assistant' ? 'kots' : 'user', msg.content);
      });
    } else {
      sendWelcome();
    }
  }

  /* ---- CHIPS ---- */
  function renderChips(showAll) {
    const faqEl = document.getElementById('kots-faq');
    if (!faqEl) return;
    faqEl.innerHTML = '';

    const chips = showAll ? [...FAQ_PRIMARY, ...FAQ_MORE] : FAQ_PRIMARY;
    chips.forEach(function(chip) {
      const btn = document.createElement('button');
      btn.className = 'kots-chip';
      btn.textContent = chip.label;
      btn.addEventListener('click', function() {
        sendMessage(chip.prompt, chip.label);
      });
      faqEl.appendChild(btn);
    });

    if (!showAll) {
      const more = document.createElement('button');
      more.id = 'kots-see-more';
      more.textContent = 'More';
      more.addEventListener('click', function() {
        showingMore = true;
        renderChips(true);
      });
      faqEl.appendChild(more);
    } else {
      const less = document.createElement('button');
      less.id = 'kots-see-more';
      less.textContent = 'See Less';
      less.addEventListener('click', function() {
        showingMore = false;
        renderChips(false);
      });
      faqEl.appendChild(less);
    }
  }

  /* ---- OPEN / CLOSE ---- */
  function openChat() {
    isOpen = true;
    document.getElementById('kots-pill').style.display   = 'none';
    document.getElementById('kots-window').style.display = 'flex';
    scrollToBottom();
    document.getElementById('kots-input').focus();
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('kots-window').style.display = 'none';
    document.getElementById('kots-pill').style.display   = 'flex';
  }

  /* ---- MESSAGES ---- */
  function appendMessage(role, text, isHtml) {
    const container = document.getElementById('kots-messages');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'kots-msg ' + role;

    const bubble = document.createElement('div');
    bubble.className = 'kots-bubble';

    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      bubble.innerHTML = role === 'kots'
        ? formatResponse(text)
        : escapeHtml(text);
    }

    const time = document.createElement('div');
    time.className = 'kots-msg-time';
    time.textContent = getTime();

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    container.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  function showTyping() {
    const container = document.getElementById('kots-messages');
    if (!container) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'kots-msg kots kots-typing';
    wrapper.id = 'kots-typing-indicator';
    wrapper.innerHTML = `
      <div class="kots-bubble">
        <div class="kots-typing-dot"></div>
        <div class="kots-typing-dot"></div>
        <div class="kots-typing-dot"></div>
      </div>
    `;
    container.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  function removeTyping() {
    const el = document.getElementById('kots-typing-indicator');
    if (el) el.remove();
  }

  function scrollToBottom() {
    const container = document.getElementById('kots-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function sendWelcome() {
    const hour = new Date().getHours();
    let greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    appendMessage('kots', `${greet}. I'm Kots, your Gud Space Gym assistant. What can I help you with?`);
  }

  /* ---- SEND ---- */
  function handleSend() {
    const input = document.getElementById('kots-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text || isThinking) return;
    input.value = '';
    input.style.height = 'auto';
    sendMessage(text, text);
  }

  function sendMessage(prompt, displayText) {
    if (isThinking) return;

    // Show user bubble
    appendMessage('user', displayText);

    // Add to conversation history
    conversation.push({ role: 'user', content: prompt });

    // Keep history to last 20 messages to avoid token overload
    if (conversation.length > 20) {
      conversation = conversation.slice(conversation.length - 20);
    }

    saveConvo();
    callKots();
  }

  async function callKots() {
    isThinking = true;
    const typing = showTyping();

    try {
      const token = getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          messages: conversation,
          systemPrompt: SYSTEM_PROMPT
        })
      });

      const data = await res.json();
      removeTyping();

      if (data.error) throw new Error(data.error);

      const reply = data.reply || "I'm having a bit of trouble right now. Try again in a moment.";
      conversation.push({ role: 'assistant', content: reply });
      saveConvo();
      appendMessage('kots', reply);

    } catch (err) {
      removeTyping();
      appendMessage('kots', "Something went wrong on my end. Give it another shot.");
    } finally {
      isThinking = false;
      scrollToBottom();
    }
  }

  /* ---- INIT ---- */
  function init() {
    // Inject CSS if not already present
    if (!document.getElementById('kots-css')) {
      const link = document.createElement('link');
      link.id   = 'kots-css';
      link.rel  = 'stylesheet';
      link.href = 'kots.css';
      document.head.appendChild(link);
    }
    buildUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
