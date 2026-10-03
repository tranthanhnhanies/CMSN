/**
 * Birthday Letter Website - Interactive Script
 * Features:
 * - Dynamic data loading from /api/letter with offline fallback
 * - Envelope opening 3D sequence
 * - Smooth typewriter & paragraph reveal effect
 * - Polaroid photo gallery with lightbox modal
 * - Audio engine (MP3 with Web Audio API Music Box synthesizer fallback)
 * - Canvas ambient warm dust & celebration particles
 */

// Default Fallback Data if API fails or running statically
const DEFAULT_LETTER_DATA = {
  meta: {
    title: "A Letter For You 💌 | Happy Birthday",
    sender: "Your Name",
    recipient: "Special Friend"
  },
  envelope: {
    to: "Vo Ngoc My Duyen",
    subtext: "A letter for you...",
    openButton: "Open the letter 💌",
    waxSealSymbol: "♥"
  },
  letter: {
    date: "October 5, 2026",
    greeting: "Dear MD,",
    paragraphs: [
      "Today is a special day. I hope you have a wonderful birthday, filled with happiness, peace, and plenty of reasons to smile. I don't really know how to put my wishes into words in a way that feels special enough, so I'll simply wish you all the best—not just today, but in all the days that are yet to come.",
      "Time really does pass quickly. Sometimes I suddenly realize that we have been through quite a lot together, from the simplest conversations to those little moments that I think I will still smile about when I look back on them someday. Perhaps we didn't think much of them at the time, but somehow, those ordinary little moments became memories worth holding on to.",
      "Those memories are still in my mind. There are things I may eventually forget, but there are also moments when, just by remembering them, the feelings of that day somehow come back. I think that is what makes memories so special—time may move forward, but the things that truly matter always remain somewhere within us.",
      "I also want to thank you. Thank you for being a part of my life, for all the conversations, all the laughter, all the things we shared, and even the ordinary moments we spent together. I may not have always said it, but I truly cherish this friendship and everything we once shared.",
      "There are moments in life that, once they have passed, can never be brought back. There are words that have already been spoken, things that have already happened, and sometimes, things that leave us with regrets that stay with us for a very long time. I've sometimes thought that if the word “if” could take us back to the moments before our decisions, if every word could be spoken one more time, perhaps things would have been different. But life doesn't always go the way we hope it will. There are highs and there are lows; there are people who enter our lives and stay, and there are people who were once so close, but eventually find themselves walking down different paths. I don't know where life will take us in the future, but if one day, somewhere along the long road of life, our paths happen to cross again, I only hope that by then, I can come to you with a purer heart, a more mature version of myself, and a deeper understanding that perhaps I didn't have enough of today.",
      "As you begin another year of your life, I hope you encounter many beautiful things. I hope you stay healthy, happy, and have the courage to pursue the things you truly want. And when life becomes difficult, I hope you will always find the strength to keep moving forward. If there are days when things don't go the way you want them to, don't forget that there are still so many beautiful things waiting for you ahead. I hope the years to come bring you countless wonderful experiences and memories that will make you smile whenever you look back on them.",
      "Finally, happy birthday. Thank you for becoming a part of some of the most beautiful memories in my life. Maybe someday, we will each walk our own paths, meet many new people, and experience many new things. But I still hope that when we look back on these years, we will remember that once upon a time, we shared a beautiful friendship. Happy Birthday, and I hope this new chapter of your life will be one worth remembering."
    ],
    quote: {
      en: "“Some things must come to an end, but I’ll always be grateful that they began.”",
      vi: "“Sẽ đến lúc nó đành phải kết thúc, nhưng luôn biết ơn vì nó đã bắt đầu.”"
    },
    closing: "With all my love & warmth,",
    signature: "Thanhnhan"
  },
  memories: {
    title: "memories...",
    photos: [
      {
        url: "anh 1.png",
        caption: "still",
        rotation: -3
      },
      {
        url: "anh 2.jpg",
        caption: "live",
        rotation: 2.5
      },
      {
        url: "anh 3.jpg",
        caption: "in my mind",
        rotation: -2
      }
    ]
  },
  ending: {
    preText: "That's all I wanted to say...",
    birthdayWish: "Happy Birthday ❤️",
    subWish: "May every single wish you make today come true ✨",
    credit: "Made with ❤️ just for you"
  },
  music: {
    src: "assets/music/music.mp3",
    volume: 0.35,
    hint: "Turn on music for a better experience 🎵"
  },
  reply: {
    enabled: true,
    title: "Leave a wish or message for me 💌",
    subtitle: "Is there something you'd like us to do together, a birthday wish, or just a small note to let me know you've read this...",
    placeholder: "Write your reply or wish here...",
    buttonText: "Send your reply 💌",
    successMessage: "Thank you! Your message has been sent to me ❤️",
    emailServiceUrl: ""
  }
};

let letterData = { ...DEFAULT_LETTER_DATA };
let isTypingInProgress = false;
let isLetterOpened = false;

/* ==========================================================================
   1. Application Initialization & Data Fetching
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  await loadLetterData();
  renderContent();
  initEnvelopeInteraction();
  initMusicController();
  initAmbientCanvas();
  initLightbox();
  initCelebration();
  initReplyForm();
  initScrollObservers();
});

async function loadLetterData() {
  const tryPaths = ['/api/letter', '/data/letter.json', 'data/letter.json', '../data/letter.json'];
  for (const p of tryPaths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        const data = await res.json();
        letterData = { ...DEFAULT_LETTER_DATA, ...data };
        return;
      }
    } catch (e) {
      // try next path
    }
  }
  console.log('Using embedded default letter content.');
}

/* ==========================================================================
   2. DOM Rendering
   ========================================================================== */
function renderContent() {
  // Page Title
  if (letterData.meta && letterData.meta.title) {
    document.title = letterData.meta.title;
  }

  // Envelope Details
  document.getElementById('env-recipient').textContent = letterData.envelope.to || letterData.meta.recipient;
  document.getElementById('env-subtext').textContent = letterData.envelope.subtext;
  document.getElementById('env-btn-text').textContent = letterData.envelope.openButton || "Mở lá thư 💌";
  document.getElementById('wax-symbol').textContent = letterData.envelope.waxSealSymbol || "♥";

  // Letter Header & Meta
  document.getElementById('letter-date').textContent = letterData.letter.date;
  document.getElementById('letter-greeting').textContent = letterData.letter.greeting;
  document.getElementById('letter-closing').textContent = letterData.letter.closing;
  document.getElementById('letter-signature').textContent = letterData.letter.signature;

  // Letter Quote
  if (letterData.letter.quote) {
    const quoteEn = document.getElementById('quote-line-en');
    const quoteVi = document.getElementById('quote-line-vi');
    if (quoteEn) {
      if (letterData.letter.quote.en) {
        quoteEn.textContent = letterData.letter.quote.en;
        quoteEn.style.display = 'block';
      } else {
        quoteEn.style.display = 'none';
      }
    }
    if (quoteVi) {
      if (letterData.letter.quote.vi) {
        quoteVi.textContent = letterData.letter.quote.vi;
        quoteVi.style.display = 'block';
      } else {
        quoteVi.style.display = 'none';
      }
    }
  }

  // Render Memories Polaroid Grid
  const polaroidGrid = document.getElementById('polaroid-grid');
  polaroidGrid.innerHTML = '';
  document.getElementById('memories-title').textContent = letterData.memories.title;

  if (letterData.memories.photos && letterData.memories.photos.length > 0) {
    letterData.memories.photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      const rot = photo.rotation || (idx % 2 === 0 ? -2.5 : 2.5);
      card.style.transform = `rotate(${rot}deg)`;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View photo: ${photo.caption}`);

      card.innerHTML = `
        <div class="polaroid-img-wrap">
          <img src="${photo.url}" alt="${photo.caption}" class="polaroid-img" loading="lazy" onerror="this.src='assets/images/memory1.svg'">
        </div>
        <p class="polaroid-caption">${photo.caption}</p>
      `;

      // Lightbox click handler
      card.addEventListener('click', () => openLightbox(photo.url, photo.caption));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(photo.url, photo.caption);
        }
      });

      polaroidGrid.appendChild(card);
    });
  }

  // Ending Section Details
  document.getElementById('ending-pretext').textContent = letterData.ending.preText;
  document.getElementById('ending-birthday-wish').textContent = letterData.ending.birthdayWish;
  document.getElementById('ending-sub-wish').textContent = letterData.ending.subWish;
  document.getElementById('ending-credit').textContent = letterData.ending.credit;

  // Reply Box Details
  if (letterData.reply && letterData.reply.enabled !== false) {
    const replyTitle = document.getElementById('reply-title');
    const replySub = document.getElementById('reply-subtitle');
    const replyMsg = document.getElementById('reply-message');
    const replyBtn = document.getElementById('reply-btn-text');
    const replySuccess = document.getElementById('reply-success-text');

    if (replyTitle) replyTitle.textContent = letterData.reply.title || "Leave a wish or message for me 💌";
    if (replySub) replySub.textContent = letterData.reply.subtitle || "Is there something you'd like us to do together, a birthday wish, or just a small note to let me know you've read this...";
    if (replyMsg) replyMsg.placeholder = letterData.reply.placeholder || "Write your reply or wish here...";
    if (replyBtn) replyBtn.textContent = letterData.reply.buttonText || "Send your reply 💌";
    if (replySuccess) replySuccess.textContent = letterData.reply.successMessage || "Thank you! Your message has been sent to me ❤️";
  } else {
    const replyCard = document.getElementById('reply-card-box');
    if (replyCard) replyCard.style.display = 'none';
  }
}

/* ==========================================================================
   3. Envelope Opening Animation Sequence
   ========================================================================== */
function initEnvelopeInteraction() {
  const envelope = document.getElementById('envelope');
  const btnOpen = document.getElementById('btn-open-letter');
  const waxSeal = document.getElementById('wax-seal');

  const triggerOpen = () => {
    if (isLetterOpened) return;
    openLetterSequence();
  };

  envelope.addEventListener('click', triggerOpen);
  btnOpen.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerOpen();
  });
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerOpen();
  });

  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerOpen();
    }
  });
}

function openLetterSequence() {
  isLetterOpened = true;
  const envelope = document.getElementById('envelope');
  const envelopeSection = document.getElementById('envelope-section');
  const letterSection = document.getElementById('letter-section');

  // Trigger flap open and letter slide
  envelope.classList.add('is-opening');

  // Start background music seamlessly upon user interaction
  playMusicOnOpen();

  // Burst small confetti / sparkle on opening
  spawnMiniSparkles();

  // Transition to paper sheet
  setTimeout(() => {
    envelopeSection.classList.add('hidden');
    letterSection.classList.add('visible');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Start gentle typewriter reveal of letter paragraphs
    setTimeout(() => {
      startParagraphsReveal();
    }, 400);

  }, 1400);
}

/* ==========================================================================
   4. Typewriter & Paragraph Reveal
   ========================================================================== */
let typewriterInterval = null;
let paragraphTimeouts = [];

function startParagraphsReveal() {
  const container = document.getElementById('letter-body');
  container.innerHTML = '';
  isTypingInProgress = true;

  const paragraphs = letterData.letter.paragraphs || [];
  let currentPIdx = 0;

  function renderParagraph(index) {
    if (index >= paragraphs.length) {
      finishTypewriter();
      return;
    }

    const pText = paragraphs[index];
    const pElem = document.createElement('p');
    pElem.className = 'letter-paragraph';
    container.appendChild(pElem);

    // Fast and smooth character reveal
    let charIdx = 0;
    const typingSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typing-cursor';

    pElem.appendChild(typingSpan);
    pElem.appendChild(cursorSpan);
    pElem.classList.add('revealed');

    // Typing speed: ~16ms for gentle fluid feeling
    typewriterInterval = setInterval(() => {
      if (charIdx < pText.length) {
        typingSpan.textContent += pText.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typewriterInterval);
        cursorSpan.remove();
        
        // Small pause between paragraphs
        const t = setTimeout(() => {
          renderParagraph(index + 1);
        }, 350);
        paragraphTimeouts.push(t);
      }
    }, 16);
  }

  renderParagraph(0);
}

function finishTypewriter() {
  isTypingInProgress = false;
  if (typewriterInterval) clearInterval(typewriterInterval);
  paragraphTimeouts.forEach(t => clearTimeout(t));

  const container = document.getElementById('letter-body');
  const paragraphs = letterData.letter.paragraphs || [];

  container.innerHTML = '';
  paragraphs.forEach(text => {
    const p = document.createElement('p');
    p.className = 'letter-paragraph revealed';
    p.textContent = text;
    container.appendChild(p);
  });

  // Reveal Quote Section
  const quoteElem = document.getElementById('letter-quote');
  if (quoteElem) {
    quoteElem.classList.add('revealed');
  }

  // Reveal Signoff
  document.getElementById('letter-signoff').classList.add('revealed');

  // Reveal memories & ending sections
  document.getElementById('memories-section').classList.add('revealed');
  document.getElementById('ending-section').classList.add('revealed');
}

function initScrollObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  const memories = document.getElementById('memories-section');
  const ending = document.getElementById('ending-section');
  if (memories) observer.observe(memories);
  if (ending) observer.observe(ending);
}

/* ==========================================================================
   5. Music Controller & Audio Synthesizer Fallback
   ========================================================================== */
let audioContext = null;
let isPlaying = false;
let synthTimer = null;

function initMusicController() {
  const toggleBtn = document.getElementById('music-toggle-btn');
  const audio = document.getElementById('bg-audio');
  const volumeSlider = document.getElementById('music-volume-slider');
  const volumeVal = document.getElementById('music-volume-val');

  audio.src = letterData.music?.src || 'assets/music/music.mp3';
  const initialVol = letterData.music?.volume !== undefined ? letterData.music.volume : 0.35;
  audio.volume = initialVol;
  if (volumeSlider) {
    volumeSlider.value = initialVol;
  }
  if (volumeVal) {
    volumeVal.textContent = Math.round(initialVol * 100) + '%';
  }

  // Volume slider interaction
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      audio.volume = vol;
      if (volumeVal) {
        volumeVal.textContent = Math.round(vol * 100) + '%';
      }
      // If user slides volume up from 0 while paused, resume smoothly
      if (vol > 0 && !isPlaying) {
        toggleMusic();
      }
    });

    // Prevent click on slider from toggling play/pause
    volumeSlider.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

function toggleMusic() {
  const controller = document.getElementById('music-controller');
  const icon = document.getElementById('music-icon');
  const audio = document.getElementById('bg-audio');

  if (isPlaying) {
    // Pause audio & synth
    audio.pause();
    stopMusicBoxSynth();
    isPlaying = false;
    controller.classList.remove('playing');
    icon.textContent = '🔇';
  } else {
    // Play MP3 or fallback to Music Box Synth
    isPlaying = true;
    controller.classList.add('playing');
    icon.textContent = '🎵';

    audio.play().catch(err => {
      console.log('MP3 not available or autoplay policy engaged, switching to soothing Music Box synth:', err.message);
      startMusicBoxSynth();
    });
  }
}

function playMusicOnOpen() {
  const audio = document.getElementById('bg-audio');
  const controller = document.getElementById('music-controller');
  const icon = document.getElementById('music-icon');

  if (!isPlaying) {
    isPlaying = true;
    controller.classList.add('playing');
    icon.textContent = '🎵';

    // Set initial volume lower and ramp up for smooth gentle start
    const targetVol = letterData.music?.volume !== undefined ? letterData.music.volume : 0.35;
    const volumeSlider = document.getElementById('music-volume-slider');
    const volumeVal = document.getElementById('music-volume-val');
    audio.volume = 0.05;

    audio.play().then(() => {
      // Smooth fade in volume
      let currentVol = 0.05;
      const fadeInterval = setInterval(() => {
        currentVol += 0.05;
        if (currentVol >= targetVol) {
          audio.volume = targetVol;
          if (volumeSlider) volumeSlider.value = targetVol;
          if (volumeVal) volumeVal.textContent = Math.round(targetVol * 100) + '%';
          clearInterval(fadeInterval);
        } else {
          audio.volume = currentVol;
          if (volumeSlider) volumeSlider.value = currentVol;
          if (volumeVal) volumeVal.textContent = Math.round(currentVol * 100) + '%';
        }
      }, 100);
    }).catch(err => {
      console.log('Audio playback prevented or missing file, using Music Box synth fallback:', err);
      startMusicBoxSynth();
    });
  }
}

/**
 * Built-in Web Audio API Music Box Synthesizer
 * Plays a delicate, soothing arpeggio lullaby chime (pentatonic & romantic)
 */
function startMusicBoxSynth() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioContext = new AudioCtx();
  }
  if (!audioContext) return;
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // Melodic notes in Hz (C Major pentatonic warm frequencies for music box)
  const notes = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50, // C6
    880.00, // A5
    783.99, // G5
    659.25, // E5
    587.33, // D5
    523.25, // C5
    659.25, // E5
    783.99, // G5
    1046.50  // C6
  ];

  let noteIdx = 0;

  function playNextChime() {
    if (!isPlaying) return;
    playMusicBoxNote(notes[noteIdx % notes.length]);
    noteIdx++;
    // Staggered timing for a charming music-box feel
    const delay = noteIdx % 4 === 0 ? 900 : 450;
    synthTimer = setTimeout(playNextChime, delay);
  }

  playNextChime();
}

function playMusicBoxNote(freq) {
  if (!audioContext) return;
  const now = audioContext.currentTime;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  // Sine wave with chime-like decay
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  // Soft envelope
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start(now);
  osc.stop(now + 1.6);
}

function stopMusicBoxSynth() {
  if (synthTimer) {
    clearTimeout(synthTimer);
    synthTimer = null;
  }
}

/* ==========================================================================
   6. Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close');

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function openLightbox(imgUrl, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  img.src = imgUrl;
  img.alt = caption;
  cap.textContent = caption;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

/* ==========================================================================
   7. Interactive Candle Blow, Fireworks & Birthday Celebration
   ========================================================================== */
let isCandleBlown = false;
let activeFireworks = [];

function initCelebration() {
  const btn = document.getElementById('btn-celebrate');
  const candle = document.getElementById('candle-container');

  const handleBlowAction = () => {
    blowOutCandle();
  };

  if (btn) btn.addEventListener('click', handleBlowAction);
  if (candle) {
    candle.addEventListener('click', handleBlowAction);
    candle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleBlowAction();
      }
    });
  }
}

function blowOutCandle() {
  if (isCandleBlown) return;
  const candle = document.getElementById('candle-container');
  const endingCard = document.getElementById('ending-card');
  const btnText = document.getElementById('btn-celebrate-text');
  const btn = document.getElementById('btn-celebrate');

  if (!candle) return;
  isCandleBlown = true;

  // Step 1: Immediately dim the room/card lights to create a romantic dark winter night ambiance
  if (endingCard) {
    endingCard.classList.add('is-dimmed');
  }
  if (btnText) {
    btnText.textContent = "Making a wish... 🎂";
  }

  // Step 2 (t = 650ms): Wind gust begins blowing across the candle flame with sound
  setTimeout(() => {
    playWindBlowSound();
    candle.classList.add('is-blowing');
  }, 650);

  // Step 3 (t = 1550ms): Extinguish the flame smoothly and release smoke wisps
  setTimeout(() => {
    candle.classList.remove('is-blowing');
    candle.classList.add('is-extinguished');
  }, 1550);

  // Step 4 (t = 2100ms): Launch Spectacular Fireworks Show across the night sky
  setTimeout(() => {
    launchFireworksShow();
  }, 2100);

  // Step 5 (t = 2700ms): Spawn floating celebration hearts, sparkles & stars
  setTimeout(() => {
    celebrateBirthday();
  }, 2700);

  // Step 6 (t = 3100ms): Joyous music box celebration fanfare & update button status
  setTimeout(() => {
    playCelebrationFanfare();
    if (btnText) {
      btnText.textContent = "✨ Wish made! Happy Birthday ❤️";
    }
    if (btn) {
      btn.classList.add('wish-made');
    }
  }, 3100);
}

function celebrateBirthday() {
  // Spawn floating hearts and gold sparkles gently over time
  for (let i = 0; i < 45; i++) {
    setTimeout(() => {
      spawnFloatingHeart();
    }, i * 45);
  }
}

function launchFireworksShow() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Staggered firework explosions across the screen for a stunning multi-burst display
  const fireworkSpots = [
    { x: w * 0.5, y: h * 0.26, colorSet: 0, delay: 0 },
    { x: w * 0.26, y: h * 0.32, colorSet: 1, delay: 450 },
    { x: w * 0.74, y: h * 0.29, colorSet: 2, delay: 900 },
    { x: w * 0.38, y: h * 0.20, colorSet: 3, delay: 1400 },
    { x: w * 0.62, y: h * 0.22, colorSet: 0, delay: 1850 },
    { x: w * 0.50, y: h * 0.34, colorSet: 1, delay: 2350 }
  ];

  fireworkSpots.forEach(spot => {
    setTimeout(() => {
      spawnFireworkExplosion(spot.x, spot.y, spot.colorSet);
    }, spot.delay);
  });
}

function spawnFireworkExplosion(x, y, colorSetIndex = 0) {
  const paletteList = [
    ['#ff9f43', '#feca57', '#ffffff', '#ff6b6b'], // Gold & Warm Sunset
    ['#ff9ff3', '#f368e0', '#54a0ff', '#ffffff'], // Rose & Starlight
    ['#1dd1a1', '#10ac84', '#feca57', '#ffffff'], // Emerald & Gold
    ['#ee5253', '#ff6b6b', '#ff9f43', '#feca57']  // Crimson & Gold Spark
  ];

  const colors = paletteList[colorSetIndex % paletteList.length];
  const particleCount = window.innerWidth < 600 ? 38 : 65;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 4.8 + 2.2;

    activeFireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.055,
      friction: 0.975,
      radius: Math.random() * 2.8 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.014 + 0.010
    });
  }
}

function playWindBlowSound() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioContext = new AudioCtx();
  }
  if (!audioContext) return;
  if (audioContext.state === 'suspended') audioContext.resume();

  try {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.75);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  } catch (e) {}
}

function playCelebrationFanfare() {
  if (!audioContext) return;
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C - E - G - C - E
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playMusicBoxNote(freq);
    }, i * 150);
  });
}

function spawnMiniSparkles() {
  for (let i = 0; i < 18; i++) {
    spawnFloatingHeart(true);
  }
}

function spawnFloatingHeart(isFast = false) {
  const heart = document.createElement('div');
  const symbols = ['♥', '💕', '💖', '✨', '🌸', '★'];
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  
  const startX = Math.random() * 90 + 5; // 5% to 95vw
  const size = Math.random() * 1.5 + 1.2;
  const duration = isFast ? (Math.random() * 1.5 + 1.5) : (Math.random() * 2.5 + 2.5);
  const drift = (Math.random() - 0.5) * 120;

  heart.style.position = 'fixed';
  heart.style.left = `${startX}vw`;
  heart.style.bottom = '-30px';
  heart.style.fontSize = `${size}rem`;
  heart.style.color = ['#e07a5f', '#d90429', '#ffb703', '#f4a261', '#e76f51'][Math.floor(Math.random() * 5)];
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '999';
  heart.style.opacity = '0.9';
  heart.style.transition = `transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${duration}s ease-out`;

  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = `translate(${drift}px, -110vh) scale(${Math.random() * 0.4 + 0.8}) rotate(${(Math.random() - 0.5) * 90}deg)`;
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
  }, duration * 1000 + 200);
}

/* ==========================================================================
   8. Reply / Wish Form Interaction
   ========================================================================== */
function initReplyForm() {
  const form = document.getElementById('reply-form');
  const textarea = document.getElementById('reply-message');
  const btn = document.getElementById('btn-send-reply');
  const btnText = document.getElementById('reply-btn-text');
  const successBox = document.getElementById('reply-success-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = textarea.value.trim();
    if (!msg) return;

    btn.disabled = true;
    if (btnText) btnText.textContent = "Sending... 💌";

    const sender = letterData.meta?.recipient || letterData.envelope?.to || "Recipient";
    const payload = {
      message: msg,
      senderName: sender,
      sentAt: new Date().toISOString()
    };

    // 1. Send to local/Express backend API (/api/reply)
    try {
      await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log('Local API save info:', err.message);
    }

    // 2. If configured with an Email Service (Formspree or Web3Forms)
    if (letterData.reply?.emailServiceUrl) {
      try {
        await fetch(letterData.reply.emailServiceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: sender,
            message: msg,
            _subject: `💌 New birthday reply from ${sender}!`
          })
        });
      } catch (emailErr) {
        console.warn('Email service webhook response:', emailErr.message);
      }
    }

    // Gentle delay for natural feel
    setTimeout(() => {
      // Trigger romantic sparkles & chimes
      celebrateBirthday();

      // Smoothly hide form and show heartfelt thank you message
      form.style.display = 'none';
      if (successBox) {
        successBox.classList.add('show');
      }
    }, 450);
  });

  // Handle "Send another message" button to allow unlimited replies
  const btnAnother = document.getElementById('btn-send-another');
  if (btnAnother) {
    btnAnother.addEventListener('click', () => {
      textarea.value = '';
      btn.disabled = false;
      if (btnText) btnText.textContent = letterData.reply?.buttonText || "Send your reply 💌";
      if (successBox) successBox.classList.remove('show');
      form.style.display = 'flex';
      textarea.focus();
    });
  }
}

/* ==========================================================================
   9. Romantic Winter Snow Particle Engine (Vibe Mùa Đông Tuyết Rơi)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  // Generate multi-layered snowflakes (foreground, midground, background)
  const isMobile = width < 600;
  const snowflakeCount = isMobile ? 45 : 85;
  const snowflakes = [];

  for (let i = 0; i < snowflakeCount; i++) {
    // 3 Layers of depth: 0: background (small, slow), 1: midground, 2: foreground (large, fluffy)
    const layer = Math.random() < 0.5 ? 0 : (Math.random() < 0.75 ? 1 : 2);
    
    let radius, speedY, opacity, swaySpeed, swayAmp;

    if (layer === 0) {
      // Distant tiny snow
      radius = Math.random() * 1.2 + 0.8;
      speedY = Math.random() * 0.4 + 0.3;
      opacity = Math.random() * 0.35 + 0.25;
      swaySpeed = Math.random() * 0.015 + 0.005;
      swayAmp = Math.random() * 0.6 + 0.3;
    } else if (layer === 1) {
      // Midground snow
      radius = Math.random() * 1.8 + 1.6;
      speedY = Math.random() * 0.6 + 0.5;
      opacity = Math.random() * 0.4 + 0.45;
      swaySpeed = Math.random() * 0.02 + 0.01;
      swayAmp = Math.random() * 1.0 + 0.6;
    } else {
      // Foreground soft fluffy snow
      radius = Math.random() * 2.5 + 3.0;
      speedY = Math.random() * 0.8 + 0.8;
      opacity = Math.random() * 0.35 + 0.6;
      swaySpeed = Math.random() * 0.025 + 0.015;
      swayAmp = Math.random() * 1.5 + 1.0;
    }

    snowflakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius,
      speedY,
      speedX: (Math.random() * 0.3 + 0.2), // gentle breeze drifting right
      opacity,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed,
      swayAmp,
      layer
    });
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let flake of snowflakes) {
      // Update sway & vertical fall
      flake.swayAngle += flake.swaySpeed;
      flake.y += flake.speedY;
      flake.x += Math.sin(flake.swayAngle) * flake.swayAmp + flake.speedX;

      // Wrap around edges seamlessly
      if (flake.y > height + 15) {
        flake.y = -10;
        flake.x = Math.random() * (width + 50) - 25;
      }
      if (flake.x > width + 15) {
        flake.x = -10;
      } else if (flake.x < -15) {
        flake.x = width + 10;
      }

      // Draw snowflake with soft radial winter glow
      if (flake.layer === 2) {
        // Soft glowing outer haze for foreground flakes
        const grad = ctx.createRadialGradient(
          flake.x, flake.y, 0,
          flake.x, flake.y, flake.radius * 2.2
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, flake.opacity * 1.2)})`);
        grad.addColorStop(0.4, `rgba(240, 245, 255, ${flake.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Crisp pure luminous snow for mid/background
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();
      }
    }

    // Update and render active Fireworks explosions
    if (activeFireworks.length > 0) {
      for (let i = activeFireworks.length - 1; i >= 0; i--) {
        const p = activeFireworks[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02) {
          activeFireworks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Little sparkling trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.radius * 0.8;
        ctx.stroke();

        ctx.restore();
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
