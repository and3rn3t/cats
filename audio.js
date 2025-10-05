/**
 * Audio Manager for Cat Collector
 * Handles all game sounds using Web Audio API
 * 
 * Features:
 * - Procedural sound generation (no audio files needed)
 * - Volume control with localStorage persistence
 * - Mute/unmute toggle
 * - Respects user preferences (prefers-reduced-motion)
 * - Easy to extend with real audio files later
 * 
 * @version 2.2.0
 */

// Audio context and settings
let audioContext = null;
let masterGainNode = null;

// Audio state
const audioState = {
    muted: false,
    volume: 0.5, // 0 to 1
    initialized: false,
    respectMotionPreference: true
};

/**
 * Initialize the audio system
 * Creates AudioContext and sets up gain node
 */
function initAudio() {
    if (audioState.initialized) return;
    
    try {
        // Create audio context (lazy initialization for better mobile support)
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create master gain node for volume control
        masterGainNode = audioContext.createGain();
        masterGainNode.connect(audioContext.destination);
        
        // Load saved preferences
        loadAudioPreferences();
        
        // Set initial volume
        updateMasterVolume();
        
        audioState.initialized = true;
        console.log('🔊 Audio system initialized');
    } catch (error) {
        console.error('Failed to initialize audio:', error);
        audioState.initialized = false;
    }
}

/**
 * Load audio preferences from localStorage
 */
function loadAudioPreferences() {
    try {
        const saved = localStorage.getItem('audioPreferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            audioState.muted = prefs.muted || false;
            audioState.volume = prefs.volume !== undefined ? prefs.volume : 0.5;
        }
        
        // Check for prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('⚠️ Reduced motion preference detected - sounds will be subtle');
            audioState.volume = Math.min(audioState.volume, 0.3);
        }
    } catch (error) {
        console.error('Failed to load audio preferences:', error);
    }
}

/**
 * Save audio preferences to localStorage
 */
function saveAudioPreferences() {
    try {
        localStorage.setItem('audioPreferences', JSON.stringify({
            muted: audioState.muted,
            volume: audioState.volume
        }));
    } catch (error) {
        console.error('Failed to save audio preferences:', error);
    }
}

/**
 * Update master volume based on current settings
 */
function updateMasterVolume() {
    if (masterGainNode) {
        masterGainNode.gain.value = audioState.muted ? 0 : audioState.volume;
    }
}

/**
 * Play a simple tone
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
 * @param {number} volumeMultiplier - Volume adjustment (0 to 1)
 */
function playTone(frequency, duration, type = 'sine', volumeMultiplier = 1) {
    if (!audioState.initialized || audioState.muted) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        // Envelope: attack, sustain, release
        const now = audioContext.currentTime;
        const attackTime = 0.01;
        const releaseTime = 0.05;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volumeMultiplier * 0.3, now + attackTime);
        gainNode.gain.setValueAtTime(volumeMultiplier * 0.3, now + duration - releaseTime);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    } catch (error) {
        console.error('Failed to play tone:', error);
    }
}

/**
 * Play multiple tones in sequence (melody)
 * @param {Array} notes - Array of {frequency, duration, delay} objects
 * @param {string} type - Oscillator type
 */
function playMelody(notes, type = 'sine') {
    if (!audioState.initialized || audioState.muted) return;
    
    notes.forEach(note => {
        setTimeout(() => {
            playTone(note.frequency, note.duration, type, note.volume || 1);
        }, note.delay);
    });
}

/**
 * Play a button click sound
 */
function playButtonClick() {
    playTone(800, 0.05, 'sine', 0.3);
}

/**
 * Play a success sound (happy ascending melody)
 */
function playSuccess() {
    const melody = [
        { frequency: 523.25, duration: 0.1, delay: 0, volume: 0.4 },     // C5
        { frequency: 659.25, duration: 0.1, delay: 100, volume: 0.4 },   // E5
        { frequency: 783.99, duration: 0.2, delay: 200, volume: 0.5 }    // G5
    ];
    playMelody(melody, 'sine');
}

/**
 * Play a failure sound (descending tones)
 */
function playFailure() {
    const melody = [
        { frequency: 493.88, duration: 0.15, delay: 0, volume: 0.3 },    // B4
        { frequency: 369.99, duration: 0.25, delay: 150, volume: 0.3 }   // F#4
    ];
    playMelody(melody, 'triangle');
}

/**
 * Play a cat meow sound based on rarity
 * @param {string} rarity - Cat rarity level
 */
function playCatMeow(rarity) {
    const meows = {
        common: [
            { frequency: 400, duration: 0.15, delay: 0, volume: 0.4 },
            { frequency: 500, duration: 0.1, delay: 150, volume: 0.3 }
        ],
        uncommon: [
            { frequency: 450, duration: 0.15, delay: 0, volume: 0.4 },
            { frequency: 550, duration: 0.12, delay: 150, volume: 0.35 },
            { frequency: 600, duration: 0.08, delay: 280, volume: 0.3 }
        ],
        rare: [
            { frequency: 500, duration: 0.15, delay: 0, volume: 0.5 },
            { frequency: 650, duration: 0.15, delay: 150, volume: 0.45 },
            { frequency: 700, duration: 0.1, delay: 300, volume: 0.4 }
        ],
        epic: [
            { frequency: 550, duration: 0.12, delay: 0, volume: 0.5 },
            { frequency: 700, duration: 0.12, delay: 120, volume: 0.5 },
            { frequency: 800, duration: 0.15, delay: 240, volume: 0.55 },
            { frequency: 650, duration: 0.08, delay: 390, volume: 0.4 }
        ],
        legendary: [
            { frequency: 600, duration: 0.1, delay: 0, volume: 0.6 },
            { frequency: 750, duration: 0.1, delay: 100, volume: 0.6 },
            { frequency: 900, duration: 0.15, delay: 200, volume: 0.65 },
            { frequency: 800, duration: 0.1, delay: 350, volume: 0.5 },
            { frequency: 1000, duration: 0.12, delay: 450, volume: 0.6 }
        ]
    };
    
    const melody = meows[rarity] || meows.common;
    playMelody(melody, 'sawtooth');
}

/**
 * Play energy gain sound (soft ping)
 */
function playEnergyGain() {
    playTone(880, 0.1, 'sine', 0.2);
}

/**
 * Play exploration sound (adventure start)
 */
function playExplore() {
    const melody = [
        { frequency: 523.25, duration: 0.08, delay: 0, volume: 0.3 },
        { frequency: 659.25, duration: 0.08, delay: 80, volume: 0.3 },
        { frequency: 783.99, duration: 0.12, delay: 160, volume: 0.35 }
    ];
    playMelody(melody, 'triangle');
}

/**
 * Play encounter sound (mysterious)
 */
function playEncounter() {
    const melody = [
        { frequency: 440, duration: 0.15, delay: 0, volume: 0.3 },
        { frequency: 523.25, duration: 0.15, delay: 150, volume: 0.3 },
        { frequency: 659.25, duration: 0.2, delay: 300, volume: 0.35 }
    ];
    playMelody(melody, 'sine');
}

/**
 * Play ambient background sound (soft nature)
 * Plays a gentle, repeating ambient tone
 */
function startAmbientSound() {
    if (!audioState.initialized || audioState.muted) return;
    
    function playAmbientCycle() {
        if (audioState.muted) return;
        
        // Soft nature-like tones
        const melody = [
            { frequency: 220, duration: 2, delay: 0, volume: 0.05 },
            { frequency: 165, duration: 2, delay: 1000, volume: 0.04 },
            { frequency: 196, duration: 2, delay: 2000, volume: 0.05 }
        ];
        
        playMelody(melody, 'sine');
        
        // Repeat every 8 seconds
        if (!audioState.muted) {
            setTimeout(playAmbientCycle, 8000);
        }
    }
    
    // Start after a short delay
    setTimeout(playAmbientCycle, 1000);
}

/**
 * Toggle mute on/off
 * @returns {boolean} New mute state
 */
function toggleMute() {
    audioState.muted = !audioState.muted;
    updateMasterVolume();
    saveAudioPreferences();
    updateMuteButton();
    
    console.log(`🔊 Audio ${audioState.muted ? 'muted' : 'unmuted'}`);
    return audioState.muted;
}

/**
 * Set volume level
 * @param {number} volume - Volume level (0 to 1)
 */
function setVolume(volume) {
    audioState.volume = Math.max(0, Math.min(1, volume));
    updateMasterVolume();
    saveAudioPreferences();
    
    console.log(`🔊 Volume set to ${Math.round(audioState.volume * 100)}%`);
}

/**
 * Get current mute state
 * @returns {boolean} Current mute state
 */
function isMuted() {
    return audioState.muted;
}

/**
 * Get current volume
 * @returns {number} Current volume (0 to 1)
 */
function getVolume() {
    return audioState.volume;
}

/**
 * Update mute button UI
 */
function updateMuteButton() {
    const btn = document.getElementById('mute-btn');
    if (btn) {
        btn.textContent = audioState.muted ? '🔇 Unmute' : '🔊 Mute';
        btn.setAttribute('aria-label', audioState.muted ? 'Unmute sounds' : 'Mute sounds');
    }
}

/**
 * Initialize audio UI controls
 */
function initAudioUI() {
    // Add mute button to controls
    const controls = document.getElementById('controls');
    if (controls && !document.getElementById('mute-btn')) {
        const muteBtn = document.createElement('button');
        muteBtn.id = 'mute-btn';
        muteBtn.className = 'main-btn';
        muteBtn.textContent = audioState.muted ? '🔇 Unmute' : '🔊 Mute';
        muteBtn.setAttribute('aria-label', audioState.muted ? 'Unmute sounds' : 'Mute sounds');
        muteBtn.addEventListener('click', () => {
            toggleMute();
            playButtonClick();
        });
        
        // Insert before help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            controls.insertBefore(muteBtn, helpBtn);
        } else {
            controls.appendChild(muteBtn);
        }
    }
    
    // Add volume control to help modal
    addVolumeControl();
}

/**
 * Add volume slider to help modal
 */
function addVolumeControl() {
    const helpModal = document.getElementById('help-modal');
    if (!helpModal) return;
    
    const modalContent = helpModal.querySelector('.modal-content');
    if (!modalContent || document.getElementById('volume-control-section')) return;
    
    const volumeSection = document.createElement('div');
    volumeSection.id = 'volume-control-section';
    volumeSection.className = 'help-section';
    volumeSection.innerHTML = `
        <h3>🔊 Sound Settings</h3>
        <label for="volume-slider">Volume: <span id="volume-display">${Math.round(audioState.volume * 100)}%</span></label>
        <input 
            type="range" 
            id="volume-slider" 
            min="0" 
            max="100" 
            value="${Math.round(audioState.volume * 100)}"
            aria-label="Adjust volume"
        >
        <p style="margin-top: var(--space-sm); font-size: var(--font-sm); color: var(--color-gray-dark);">
            Sounds are generated using Web Audio API. Adjust to your preference!
        </p>
    `;
    
    // Insert before the reset section
    const resetSection = Array.from(modalContent.querySelectorAll('.help-section'))
        .find(section => section.textContent.includes('Reset Game'));
    
    if (resetSection) {
        modalContent.insertBefore(volumeSection, resetSection);
    } else {
        modalContent.appendChild(volumeSection);
    }
    
    // Add event listener
    const slider = document.getElementById('volume-slider');
    const display = document.getElementById('volume-display');
    
    if (slider && display) {
        slider.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            setVolume(volume);
            display.textContent = `${e.target.value}%`;
            
            // Play a test sound
            playTone(523.25, 0.1, 'sine', 0.5);
        });
    }
}

// Auto-initialize on page load (with user interaction requirement for mobile)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for first user interaction to initialize (required by browsers)
        document.addEventListener('click', () => {
            if (!audioState.initialized) {
                initAudio();
                initAudioUI();
            }
        }, { once: true });
    });
} else {
    document.addEventListener('click', () => {
        if (!audioState.initialized) {
            initAudio();
            initAudioUI();
        }
    }, { once: true });
}
