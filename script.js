// Voice Recognition Setup
let recognition;
let isListening = false;
let currentMood = null;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
} else {
    console.log('Speech recognition not supported');
}

// DOM Elements
const elements = {
    voiceBtn: document.getElementById('voiceBtn'),
    voiceText: document.getElementById('voiceText'),
    aiResponse: document.getElementById('aiResponse'),
    moodCards: document.querySelectorAll('.mood-card'),
    musicSuggestions: document.getElementById('musicSuggestions'),
    videoSuggestions: document.getElementById('videoSuggestions'),
    navLinks: document.querySelectorAll('.nav-link')
};

// Mood-based content suggestions
const contentDatabase = {
    happy: {
        music: [
            {
                title: "Happy",
                artist: "Pharrell Williams",
                description: "Feel-good vibes to keep your happiness flowing",
                spotifyUrl: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH",
                icon: "fas fa-music"
            },
            {
                title: "Can't Stop the Feeling!",
                artist: "Justin Timberlake",
                description: "Upbeat energy that matches your joyful mood",
                spotifyUrl: "https://open.spotify.com/track/20I6sIOMTCkB6w7ryavxtO",
                icon: "fas fa-music"
            },
            {
                title: "Good Vibes",
                artist: "Various Artists",
                description: "A playlist full of positive energy",
                spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
                icon: "fas fa-list-music"
            }
        ],
        videos: [
            {
                title: "Funny Cat Compilation",
                description: "Hilarious cat videos to make you smile even more",
                youtubeUrl: "https://www.youtube.com/watch?v=hFZFjoX2cGg",
                icon: "fas fa-laugh"
            },
            {
                title: "Feel Good Movie Clips",
                description: "Best movie moments that spread joy",
                youtubeUrl: "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
                icon: "fas fa-film"
            }
        ]
    },
    sad: {
        music: [
            {
                title: "Someone Like You",
                artist: "Adele",
                description: "A beautiful ballad that understands your emotions",
                spotifyUrl: "https://open.spotify.com/track/4orfKHBJqhEJqzpQdnBGWs",
                icon: "fas fa-music"
            },
            {
                title: "The Night We Met",
                artist: "Lord Huron",
                description: "Melancholic melody for reflective moments",
                spotifyUrl: "https://open.spotify.com/track/0BKkKa0q8z5GvfPEqhOfRb",
                icon: "fas fa-music"
            },
            {
                title: "Sad Songs Playlist",
                artist: "Various Artists",
                description: "Songs that help you process emotions",
                spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1",
                icon: "fas fa-list-music"
            }
        ],
        videos: [
            {
                title: "Relaxing Nature Sounds",
                description: "Peaceful rain and ocean sounds for comfort",
                youtubeUrl: "https://www.youtube.com/watch?v=YQHsXMglC9A",
                icon: "fas fa-leaf"
            },
            {
                title: "Meditation for Emotional Healing",
                description: "Guided meditation to help process feelings",
                youtubeUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
                icon: "fas fa-heart"
            }
        ]
    },
    energetic: {
        music: [
            {
                title: "Thunder",
                artist: "Imagine Dragons",
                description: "High-energy anthem to fuel your excitement",
                spotifyUrl: "https://open.spotify.com/track/0NN4dUkbJDQ0e7fUJNu7AX",
                icon: "fas fa-music"
            },
            {
                title: "Pump It",
                artist: "The Black Eyed Peas",
                description: "Get your adrenaline pumping with this beat",
                spotifyUrl: "https://open.spotify.com/track/4WEjsH7oiWz5FnI2V3hP7I",
                icon: "fas fa-music"
            },
            {
                title: "Workout Hits",
                artist: "Various Artists",
                description: "High-energy playlist for maximum motivation",
                spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWSJHnPb1f0Hz",
                icon: "fas fa-list-music"
            }
        ],
        videos: [
            {
                title: "Epic Workout Motivation",
                description: "Intense workout videos to channel your energy",
                youtubeUrl: "https://www.youtube.com/watch?v=wnHW6o8WMas",
                icon: "fas fa-dumbbell"
            },
            {
                title: "Adventure Sports Compilation",
                description: "Thrilling extreme sports to match your energy",
                youtubeUrl: "https://www.youtube.com/watch?v=lsSC2vx7zFQ",
                icon: "fas fa-mountain"
            }
        ]
    },
    calm: {
        music: [
            {
                title: "Clair de Lune",
                artist: "Claude Debussy",
                description: "Peaceful classical music for relaxation",
                spotifyUrl: "https://open.spotify.com/track/4Tr0oGLCqj4GiWle6tJ2z9",
                icon: "fas fa-music"
            },
            {
                title: "Weightless",
                artist: "Marconi Union",
                description: "Scientifically designed to reduce anxiety",
                spotifyUrl: "https://open.spotify.com/track/3jbCr8EfLCR6W9jlqNruby",
                icon: "fas fa-music"
            },
            {
                title: "Peaceful Piano",
                artist: "Various Artists",
                description: "Gentle piano melodies for tranquility",
                spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
                icon: "fas fa-list-music"
            }
        ],
        videos: [
            {
                title: "Ocean Wave Sounds",
                description: "Soothing ocean waves for deep relaxation",
                youtubeUrl: "https://www.youtube.com/watch?v=V1bFr2SWP1I",
                icon: "fas fa-water"
            },
            {
                title: "Guided Meditation",
                description: "10-minute mindfulness meditation",
                youtubeUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
                icon: "fas fa-om"
            }
        ]
    },
    romantic: {
        music: [
            {
                title: "Perfect",
                artist: "Ed Sheeran",
                description: "Beautiful love song for romantic moments",
                spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
                icon: "fas fa-music"
            },
            {
                title: "All of Me",
                artist: "John Legend",
                description: "Heartfelt ballad perfect for love",
                spotifyUrl: "https://open.spotify.com/track/3U4isOIWM3VvDubwSI28M2",
                icon: "fas fa-music"
            },
            {
                title: "Love Songs Playlist",
                artist: "Various Artists",
                description: "Romantic classics and modern love songs",
                spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuljGoP2",
                icon: "fas fa-list-music"
            }
        ],
        videos: [
            {
                title: "Romantic Movie Scenes",
                description: "Most beautiful love scenes from movies",
                youtubeUrl: "https://www.youtube.com/watch?v=1E4_SyLfQ8Q",
                icon: "fas fa-heart"
            },
            {
                title: "Sunset Timelapses",
                description: "Romantic sunset views from around the world",
                youtubeUrl: "https://www.youtube.com/watch?v=DDU-rZs-Ic4",
                icon: "fas fa-sun"
            }
        ]
    },
    motivated: {
        music: [
            {
                title: "Eye of the Tiger",
                artist: "Survivor",
                description: "Classic motivation anthem for success",
                spotifyUrl: "https://open.spotify.com/track/2HHtWyy5CgaQbC7XSoOb0e",
                icon: "fas fa-music"
            },
            {
                title: "Stronger",
                artist: "Kanye West",
                description: "Powerful track to boost your confidence",
                spotifyUrl: "https://open.spotify.com/track/6mWfGJTqIqS0NiEBAa8hvC",
                icon: "fas fa-music"
            },
            {
                title: "Motivational Hip-Hop",
                artist: "Various Artists",
                description: "Inspiring rap and hip-hop for hustle mode",
                spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
                icon: "fas fa-list-music"
            }
        ],
        videos: [
            {
                title: "Success Motivation",
                description: "Inspiring speeches from successful people",
                youtubeUrl: "https://www.youtube.com/watch?v=Lp7E973zozc",
                icon: "fas fa-trophy"
            },
            {
                title: "Achievement Stories",
                description: "Real stories of people overcoming challenges",
                youtubeUrl: "https://www.youtube.com/watch?v=mgmVOuLgFB0",
                icon: "fas fa-star"
            }
        ]
    }
};

// AI Responses for different moods
const aiResponses = {
    happy: "I can sense your positive energy! 😊 That's wonderful! I've curated some upbeat music and joyful videos that will amplify your happiness. Music has the power to enhance our mood, so let's keep those good vibes flowing!",
    sad: "I understand you're going through a tough time. 💙 It's okay to feel sad - emotions are a natural part of life. I've selected some comforting music and peaceful videos that might help you process these feelings. Remember, this feeling will pass.",
    energetic: "Wow, I can feel your energy! ⚡ You're ready to conquer the world! I've got some high-energy music and exciting videos that will match your enthusiasm. Let's channel that energy into something amazing!",
    calm: "I sense you're in a peaceful state of mind. 🌱 That's beautiful! I've chosen some tranquil music and relaxing videos that will help maintain your serenity. Sometimes we all need moments of calm in our busy lives.",
    romantic: "Ah, love is in the air! 💕 I can feel the romantic energy. I've selected some beautiful love songs and romantic content that will perfectly complement your mood. Enjoy these tender moments!",
    motivated: "I can feel your determination! 🔥 You're ready to achieve great things! I've put together some powerful motivational music and inspiring videos that will fuel your ambition. Go out there and make it happen!"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    displayDefaultContent();
    smoothScrollForNav();
}

function setupEventListeners() {
    // Voice button
    if (elements.voiceBtn && recognition) {
        elements.voiceBtn.addEventListener('click', toggleVoiceRecognition);
        setupSpeechRecognition();
    }

    // Mood cards
    elements.moodCards.forEach(card => {
        card.addEventListener('click', () => {
            const mood = card.dataset.mood;
            selectMood(mood);
        });
    });

    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            scrollToSection(target);
            updateActiveNav(link);
        });
    });
}

function setupSpeechRecognition() {
    recognition.onstart = () => {
        isListening = true;
        elements.voiceBtn.classList.add('listening');
        elements.voiceBtn.querySelector('.voice-status').textContent = 'Listening...';
        elements.voiceText.textContent = 'I\'m listening... speak now!';
        playNotificationSound();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        elements.voiceText.textContent = `You said: "${transcript}"`;
        processVoiceInput(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        elements.voiceText.textContent = 'Sorry, I couldn\'t understand. Please try again.';
        resetVoiceButton();
    };

    recognition.onend = () => {
        resetVoiceButton();
    };
}

function toggleVoiceRecognition() {
    if (!recognition) {
        elements.voiceText.textContent = 'Speech recognition is not supported in your browser.';
        return;
    }

    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function resetVoiceButton() {
    isListening = false;
    elements.voiceBtn.classList.remove('listening');
    elements.voiceBtn.querySelector('.voice-status').textContent = 'Click to speak';
}

function processVoiceInput(transcript) {
    // Detect mood from voice input
    const detectedMood = detectMoodFromText(transcript);
    
    if (detectedMood) {
        selectMood(detectedMood);
        updateAIResponse(`I heard "${transcript}". ${aiResponses[detectedMood]}`);
    } else {
        // General AI response
        const response = generateAIResponse(transcript);
        updateAIResponse(response);
    }
}

function detectMoodFromText(text) {
    const moodKeywords = {
        happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'fantastic', 'wonderful', 'cheerful', 'glad'],
        sad: ['sad', 'down', 'depressed', 'upset', 'blue', 'unhappy', 'melancholy', 'gloomy'],
        energetic: ['energetic', 'pumped', 'hyped', 'active', 'dynamic', 'vigorous', 'lively'],
        calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'quiet', 'zen', 'chill'],
        romantic: ['romantic', 'love', 'romance', 'affection', 'tender', 'intimate', 'loving'],
        motivated: ['motivated', 'determined', 'focused', 'driven', 'ambitious', 'inspired', 'confident']
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return mood;
        }
    }
    return null;
}

function generateAIResponse(transcript) {
    const responses = [
        `I heard you say "${transcript}". How are you feeling today?`,
        `Thanks for sharing! Based on what you said, how would you describe your current mood?`,
        `That's interesting! Tell me more about how you're feeling right now.`,
        `I'm here to help! What kind of mood are you in today?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function selectMood(mood) {
    currentMood = mood;
    
    // Update UI
    updateMoodSelection(mood);
    changeMoodTheme(mood);
    updateAIResponse(aiResponses[mood]);
    displayMoodContent(mood);
    
    // Smooth scroll to content
    setTimeout(() => {
        scrollToSection('#music');
    }, 500);
}

function updateMoodSelection(mood) {
    elements.moodCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.mood === mood) {
            card.classList.add('active');
        }
    });
}

function changeMoodTheme(mood) {
    // Remove all mood classes
    document.body.className = '';
    // Add new mood class
    document.body.classList.add(mood);
    
    // Add animation class
    document.body.classList.add('fade-in');
    setTimeout(() => {
        document.body.classList.remove('fade-in');
    }, 500);
}

function updateAIResponse(message) {
    const aiMessage = elements.aiResponse.querySelector('.ai-message p');
    aiMessage.textContent = message;
    elements.aiResponse.classList.add('fade-in');
    setTimeout(() => {
        elements.aiResponse.classList.remove('fade-in');
    }, 500);
}

function displayMoodContent(mood) {
    const content = contentDatabase[mood];
    if (!content) return;

    // Display music suggestions
    displayMusicSuggestions(content.music);
    // Display video suggestions
    displayVideoSuggestions(content.videos);
}

function displayMusicSuggestions(musicList) {
    elements.musicSuggestions.innerHTML = '';
    
    musicList.forEach(music => {
        const musicCard = createSuggestionCard(music, 'music');
        elements.musicSuggestions.appendChild(musicCard);
    });
}

function displayVideoSuggestions(videoList) {
    elements.videoSuggestions.innerHTML = '';
    
    videoList.forEach(video => {
        const videoCard = createSuggestionCard(video, 'video');
        elements.videoSuggestions.appendChild(videoCard);
    });
}

function createSuggestionCard(item, type) {
    const card = document.createElement('div');
    card.className = 'suggestion-card fade-in';
    
    const isMusic = type === 'music';
    const primaryUrl = isMusic ? item.spotifyUrl : item.youtubeUrl;
    const platformName = isMusic ? 'Spotify' : 'YouTube';
    
    card.innerHTML = `
        <div class="suggestion-header">
            <div class="suggestion-icon">
                <i class="${item.icon}"></i>
            </div>
            <div>
                <div class="suggestion-title">${item.title}</div>
                ${item.artist ? `<div class="suggestion-artist">${item.artist}</div>` : ''}
            </div>
        </div>
        <div class="suggestion-description">${item.description}</div>
        <div class="suggestion-actions">
            <button class="action-btn primary-btn" onclick="openLink('${primaryUrl}')">
                Open in ${platformName}
            </button>
            <button class="action-btn secondary-btn" onclick="shareSuggestion('${item.title}', '${primaryUrl}')">
                Share
            </button>
        </div>
    `;
    
    return card;
}

function displayDefaultContent() {
    // Display some popular content by default
    const defaultMusic = [
        {
            title: "Today's Top Hits",
            artist: "Various Artists",
            description: "The most popular songs right now",
            spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
            icon: "fas fa-fire"
        },
        {
            title: "Chill Hits",
            artist: "Various Artists", 
            description: "Relaxing music for any time of day",
            spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM",
            icon: "fas fa-leaf"
        }
    ];
    
    const defaultVideos = [
        {
            title: "Relaxing Music for Work",
            description: "Background music to help you focus",
            youtubeUrl: "https://www.youtube.com/watch?v=5qap5aO4i9A",
            icon: "fas fa-music"
        },
        {
            title: "Nature Documentary",
            description: "Beautiful nature scenes to calm your mind",
            youtubeUrl: "https://www.youtube.com/watch?v=sSKkEHtbWVo",
            icon: "fas fa-tree"
        }
    ];
    
    displayMusicSuggestions(defaultMusic);
    displayVideoSuggestions(defaultVideos);
}

// Utility Functions
function openLink(url) {
    window.open(url, '_blank');
}

function shareSuggestion(title, url) {
    if (navigator.share) {
        navigator.share({
            title: `Check out: ${title}`,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

function playNotificationSound() {
    const audio = document.getElementById('notificationSound');
    if (audio) {
        audio.play().catch(e => console.log('Could not play sound:', e));
    }
}

function smoothScrollForNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateActiveNav(activeLink) {
    elements.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Additional features
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// Auto-detect system theme preference
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    }
}

// Initialize system theme detection
detectSystemTheme();

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectSystemTheme);
}