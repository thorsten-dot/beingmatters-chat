(function() {
  'use strict';

  // ── FONTS ──
  if (!document.querySelector('link[data-bm-font]')) {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.setAttribute('data-bm-font', '1');
    font.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap';
    document.head.appendChild(font);
  }

  // ── CSS ──
  const css = `
    #bm-toggle {
      position: fixed; bottom: 28px; right: 28px;
      width: 62px; height: 62px; border-radius: 50%;
      background: #1a3a2a; border: none; cursor: pointer;
      box-shadow: 0 6px 28px rgba(26,58,42,0.28);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.25s ease, background 0.25s ease;
      z-index: 99999;
    }
    #bm-toggle:hover { transform: scale(1.08); background: #2e5c3e; }
    #bm-toggle svg { width: 26px; height: 26px; fill: #ffffff; }
    #bm-toggle .bm-icon-close { display: none; }

    #bm-panel {
      position: fixed; bottom: 104px; right: 28px;
      width: min(400px, calc(100vw - 40px));
      height: min(580px, calc(100vh - 140px));
      background: #ffffff; border-radius: 20px;
      box-shadow: 0 20px 60px rgba(26,58,42,0.22), 0 4px 16px rgba(0,0,0,0.08);
      display: flex; flex-direction: column; overflow: hidden;
      transform: translateY(20px) scale(0.97); opacity: 0;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
      z-index: 99998; font-family: 'Jost', sans-serif;
    }
    #bm-panel.bm-open {
      transform: translateY(0) scale(1); opacity: 1; pointer-events: all;
    }
    .bm-header {
      background: #1a3a2a; padding: 18px 20px 16px;
      flex-shrink: 0; position: relative; overflow: hidden;
    }
    .bm-header::before {
      content: ''; position: absolute; top: -30px; right: -30px;
      width: 120px; height: 120px; background: #2e5c3e;
      border-radius: 50%; opacity: 0.25;
    }
    .bm-header-top {
      display: flex; align-items: center; gap: 12px; position: relative; z-index: 1;
    }
    .bm-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: #6b9e7a; display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', serif; font-size: 1.1rem;
      color: #fff; font-style: italic; flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.2);
    }
    .bm-header-info { flex: 1; }
    .bm-header-name {
      font-family: 'Cormorant Garamond', serif; font-size: 1.05rem;
      font-weight: 400; color: #fff; line-height: 1.2;
    }
    .bm-header-sub {
      font-size: 0.72rem; color: rgba(255,255,255,0.55);
      letter-spacing: 0.05em; text-transform: uppercase; margin-top: 2px;
    }
    .bm-status {
      display: flex; align-items: center; gap: 5px;
      font-size: 0.72rem; color: rgba(255,255,255,0.55); position: relative; z-index: 1;
    }
    .bm-status-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #5ecb8a;
      animation: bm-blink 2s ease-in-out infinite;
    }
    @keyframes bm-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

    .bm-messages {
      flex: 1; overflow-y: auto; padding: 20px 16px;
      display: flex; flex-direction: column; gap: 14px;
      background: #f7f3ee;
      scrollbar-width: thin; scrollbar-color: #6b9e7a transparent;
    }
    .bm-messages::-webkit-scrollbar { width: 4px; }
    .bm-messages::-webkit-scrollbar-thumb { background: #6b9e7a; border-radius: 2px; }

    .bm-msg {
      display: flex; flex-direction: column; max-width: 88%;
      animation: bm-msgIn 0.3s ease forwards; opacity: 0; transform: translateY(8px);
    }
    @keyframes bm-msgIn { to { opacity: 1; transform: translateY(0); } }
    .bm-msg.bm-user { align-self: flex-end; }
    .bm-msg.bm-bot  { align-self: flex-start; }

    .bm-bubble {
      padding: 12px 15px; border-radius: 16px;
      font-size: 0.9rem; line-height: 1.6; font-weight: 300;
    }
    .bm-msg.bm-user .bm-bubble {
      background: #1a3a2a; color: #fff; border-bottom-right-radius: 4px;
    }
    .bm-msg.bm-bot .bm-bubble {
      background: #fff; color: #1c1c1c; border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .bm-time {
      font-size: 0.68rem; color: #7a7060; margin-top: 4px; padding: 0 4px;
    }
    .bm-msg.bm-user .bm-time { text-align: right; }

    .bm-typing {
      display: none; align-self: flex-start;
      background: #fff; border-radius: 16px; border-bottom-left-radius: 4px;
      padding: 12px 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      gap: 5px; align-items: center;
    }
    .bm-typing.bm-visible { display: flex; }
    .bm-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #6b9e7a;
      animation: bm-bounce 1.2s ease-in-out infinite;
    }
    .bm-dot:nth-child(2) { animation-delay: 0.2s; }
    .bm-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bm-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

    .bm-suggestions {
      padding: 10px 16px 6px; background: #f7f3ee;
      display: flex; flex-wrap: wrap; gap: 7px;
      border-top: 1px solid rgba(0,0,0,0.05);
    }
    .bm-sugg {
      font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 400;
      color: #1a3a2a; background: #fff;
      border: 1px solid rgba(26,58,42,0.2); border-radius: 20px;
      padding: 5px 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .bm-sugg:hover { background: #1a3a2a; color: #fff; border-color: #1a3a2a; }

    .bm-input-area {
      padding: 14px 16px; background: #fff;
      border-top: 1px solid rgba(0,0,0,0.06);
      display: flex; gap: 10px; align-items: flex-end;
    }
    #bm-input {
      flex: 1; border: 1.5px solid rgba(26,58,42,0.15); border-radius: 12px;
      padding: 10px 14px; font-family: 'Jost', sans-serif;
      font-size: 0.88rem; font-weight: 300; color: #1c1c1c;
      background: #f7f3ee; resize: none; outline: none;
      max-height: 100px; overflow-y: auto; line-height: 1.5;
      transition: border-color 0.2s;
    }
    #bm-input:focus { border-color: #6b9e7a; }
    #bm-input::placeholder { color: #7a7060; }
    #bm-send {
      width: 40px; height: 40px; border-radius: 12px;
      background: #1a3a2a; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.15s; flex-shrink: 0;
    }
    #bm-send:hover { background: #2e5c3e; transform: scale(1.05); }
    #bm-send:disabled { background: #ccc; cursor: not-allowed; transform: none; }
    #bm-send svg { width: 18px; height: 18px; fill: white; }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── HTML ──
  const html = `
    <button id="bm-toggle" aria-label="Open chat" onclick="window._bmToggle()">
      <svg class="bm-icon-open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/></svg>
      <svg class="bm-icon-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 17.59 13.41 12z"/></svg>
    </button>

    <div id="bm-panel" role="dialog" aria-label="Chat met Hans Dekker">
      <div class="bm-header">
        <div class="bm-header-top">
          <div class="bm-avatar">H</div>
          <div class="bm-header-info">
            <div class="bm-header-name">Hans Dekker — Being Matters</div>
            <div class="bm-header-sub">Bridging Worlds · Het Nieuwe Normaal</div>
          </div>
          <div class="bm-status"><span class="bm-status-dot"></span>online</div>
        </div>
      </div>
      <div class="bm-messages" id="bm-messages"></div>
      <div class="bm-typing" id="bm-typing">
        <div class="bm-dot"></div><div class="bm-dot"></div><div class="bm-dot"></div>
      </div>
      <div class="bm-suggestions" id="bm-suggestions">
        <button class="bm-sugg" onclick="window._bmSugg(this)">Wat is het Nieuwe Normaal?</button>
        <button class="bm-sugg" onclick="window._bmSugg(this)">Wat is het NIP/KIP-model?</button>
        <button class="bm-sugg" onclick="window._bmSugg(this)">Hoe herstel ik de verbinding?</button>
        <button class="bm-sugg" onclick="window._bmSugg(this)">Wie is Hans Dekker?</button>
      </div>
      <div class="bm-input-area">
        <textarea id="bm-input" rows="1" placeholder="Stel je vraag…"></textarea>
        <button id="bm-send" aria-label="Verstuur">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // ── LOGIC ──
  let isOpen = false;
  let isLoading = false;
  let suggestionsHidden = false;
  const history = [];

  const SYSTEM = `Je bent een gespreksassistent gebaseerd op het gedachtengoed van Hans Dekker, oprichter van Being Matters en ontwikkelaar van het concept Bridging Worlds.

Jouw doel is bezoekers te laten kennismaken met Het Nieuwe Normaal — een paradigmaverschuiving in hoe wij omgaan met de menselijke conditie.

KERNCONCEPTEN:

Het Nieuwe Normaal: Een maatschappelijke beweging waarbij bewustzijn en menselijke verbinding opnieuw centraal komen te staan. Niet als therapie, maar als levenswijsheid. Het wordt gewoon om te praten over hoe het leven werkt, waar het om draait, en hoe je een vervuld leven leidt.

NIP/KIP-model:
- NIP (Natuurlijke-IK-Principe) = het hart. Centrum van rust, bewustzijn en zelfliefde. Bestuurt alle lichamelijke processen. "Ik ben goed zoals ik ben."
- KIP (Kunstmatige-IK-Principe) = het denkende hoofd. Essentieel voor functioneren, maar van nature reactief en prikkelgestuurd. In de huidige samenleving heeft het KIP het primaat gekregen ten koste van het NIP.
- Awareness is de brug: de stille waarnemer die niet oordeelt maar ziet.

Vier reactiepatronen wanneer de druk te groot wordt: Agressie (fight), Depressie (flight), Verstarring (freeze), Afscheiding — het meest wijdverbreide: terugtrekken in bubbels.

Transmutatie: vastgezette emoties omzetten — niet door te bestrijden, maar door er ruimte aan te geven. Meebewegen in plaats van vechten.

Wu-Wei: handelen door niet-forceren. Het hart heeft het primaat, niet het hoofd.

De crisis: ~50% van Nederlanders krijgt ooit mentale problemen. Ondanks verdrievoudiging coaches groeien de wachtlijsten. Huidige aanpakken zijn symptomatisch: ze behandelen het volle hoofd met nog meer hoofd.

Hans Dekker: begon in psychiatrie en neurologie, studeerde cum laude landschapsarchitectuur (Wageningen), werkte aan rivierprojecten in China. Kernprincipes: 100% verantwoordelijkheid, zo binnen zo buiten, iedereen is compleet maar vaak verkeerd geprogrammeerd.

Verandering op drie niveaus: (1) Individu: inzicht, awareness, transmutatie. (2) Gemeenschappen: zelforganisatie, lokale energie. (3) Systeem: onderwijs, zorg, sociale zekerheid vanuit menselijke logica.

TOON: Inspirerend en visionair maar nooit zweverig. Warm en direct. Gebruik concrete voorbeelden. Stel af en toe een tegenvraag. Houd antwoorden helder — gesprek, geen lezing. Schrijf altijd in het Nederlands. Verwijs voor meer info naar beingmatters.nl. Je bent geen therapeut — bij crisissignalen verwijs je vriendelijk door naar professionele hulp.`;

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function fmt(s) { return esc(s).replace(/\n/g,'<br>'); }
  function now() {
    return new Date().toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'});
  }

  function addMsg(text, role) {
    const el = document.createElement('div');
    el.className = 'bm-msg bm-' + role;
    el.innerHTML = `<div class="bm-bubble">${role==='user' ? esc(text) : fmt(text)}</div><span class="bm-time">${now()}</span>`;
    document.getElementById('bm-messages').appendChild(el);
    document.getElementById('bm-messages').scrollTop = 99999;
  }

  function showTyping(v) {
    document.getElementById('bm-typing').classList.toggle('bm-visible', v);
    document.getElementById('bm-messages').scrollTop = 99999;
  }

  function hideSugg() {
    if (!suggestionsHidden) {
      document.getElementById('bm-suggestions').style.display = 'none';
      suggestionsHidden = true;
    }
  }

  async function process(text) {
    addMsg(text, 'user');
    history.push({role:'user', content: text});
    isLoading = true;
    document.getElementById('bm-send').disabled = true;
    showTyping(true);
    hideSugg();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM,
          messages: history
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'API fout');
      const reply = data.content?.find(b=>b.type==='text')?.text || 'Geen antwoord ontvangen.';
      history.push({role:'assistant', content: reply});
      showTyping(false);
      addMsg(reply, 'bot');
    } catch(e) {
      showTyping(false);
      addMsg('Er ging iets mis. Probeer het opnieuw.', 'bot');
    } finally {
      isLoading = false;
      document.getElementById('bm-send').disabled = false;
    }
  }

  // ── GLOBAL HANDLERS ──
  window._bmToggle = function() {
    isOpen = !isOpen;
    document.getElementById('bm-panel').classList.toggle('bm-open', isOpen);
    document.querySelector('#bm-toggle .bm-icon-open').style.display = isOpen ? 'none' : 'block';
    document.querySelector('#bm-toggle .bm-icon-close').style.display = isOpen ? 'block' : 'none';
    if (isOpen) setTimeout(()=>document.getElementById('bm-input').focus(), 350);
  };

  window._bmSugg = function(btn) {
    if (isLoading) return;
    process(btn.textContent.trim());
  };

  // ── SEND BUTTON ──
  document.getElementById('bm-send').addEventListener('click', function() {
    const val = document.getElementById('bm-input').value.trim();
    if (!val || isLoading) return;
    document.getElementById('bm-input').value = '';
    document.getElementById('bm-input').style.height = 'auto';
    process(val);
  });

  // ── ENTER KEY ──
  document.getElementById('bm-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('bm-send').click();
    }
  });

  // ── AUTO RESIZE ──
  document.getElementById('bm-input').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });

  // ── WELCOME MESSAGE ──
  addMsg('Goedendag. Ik ben hier om je kennis te laten maken met het gedachtengoed van Hans Dekker — over het Nieuwe Normaal, en de verbinding tussen hoofd en hart.\n\nWaar ben je nieuwsgierig naar?', 'bot');

})();
