# 🎯 SnapTimer - Modern Timer App

A sleek, feature-rich React timer application with count up/countdown modes, custom time input, text-to-speech, background cycling, music player, and beautiful animations.

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🚀 Core Functionality
- **Count Up Mode**: Count from 0 to infinity with optional target time
- **Countdown Mode**: Custom countdown timer with progress tracking
- **Streamlined Time Input**: Compact hours/minutes/seconds input with inline Set button
- **Real-time Validation**: Input validation with error messages
- **Progress Tracking**: Visual progress indicators for both modes

### 🎨 Modern UI/UX
- **Sleek Design**: Clean, minimalist interface with modern styling
- **Compact Components**: Streamlined TimeInput with even distribution
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Theme Support**: Light and dark mode with automatic switching

### 🔊 Text-to-Speech
- **Voice Announcements**: Speaks countdown numbers (10 to 1)
- **Completion Alert**: Announces completion when timer finishes
- **Toggle Control**: Enable/disable voice with hamburger menu
- **Browser API**: Uses Web Speech API for natural voice

### 🎵 Music & Background Features
- **Music Player**: Upload and play audio files with visualization
- **Background Cycling**: Automatic background changes while timer runs
- **Image Integration**: Unsplash API integration for dynamic backgrounds
- **Gradient Themes**: Beautiful gradient backgrounds for different moods

### 🍔 Hamburger Menu
- **Compact Controls**: All toggles and settings in one menu
- **Quick Presets**: Fast access to common time presets
- **Responsive Design**: Dropdown on desktop, slide-out on mobile
- **Accessibility**: Full keyboard navigation and ARIA support

### 🎭 Custom Modal
- **Smooth Transitions**: Fade-in and slide-in animations
- **Multiple Close Options**: Click outside, escape key, or close button
- **Professional Styling**: Matches app theme with gradient header
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🛠️ Technologies Used

- **React 18.2.0** - Modern React with hooks
- **TypeScript** - Type-safe development
- **CSS3** - Modern styling with animations
- **Web Speech API** - Text-to-speech functionality
- **Web Audio API** - Music player functionality
- **Unsplash API** - Dynamic background images
- **Create React App** - Development environment

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lena0429/ai-counter-app.git
   cd ai-counter-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### Count Up Mode
1. Click **"Count Up"** mode button
2. (Optional) Set a target time using the streamlined time input
3. Use quick preset buttons (1m, 5m, 15m, 30m, 1h, 2h) for common targets
4. Click **"Start"** to begin counting
5. Click **"Pause"** to stop temporarily
6. Click **"Reset"** to set counter back to 0

### Countdown Mode
1. Click **"Countdown"** mode button
2. Enter your desired time using the compact time input (hours:minutes:seconds)
3. Click **"Set"** button (inline with inputs) to apply the countdown
4. Click **"Start"** to begin countdown
5. Watch the progress bar fill up
6. Get notified when countdown completes

### Time Input Features
- **Compact Design**: Hours, minutes, seconds in one streamlined section
- **Inline Set Button**: Set button positioned inline with time inputs
- **Even Distribution**: All elements evenly spaced across the section
- **Keyboard Navigation**: Use arrow keys to adjust values, Enter to set
- **Auto-normalization**: Automatically converts overflow values (e.g., 70s → 1m 10s)

### Voice Features
1. Open the **hamburger menu** (☰)
2. Toggle **Voice Announcements** on/off
3. When enabled, voice will announce:
   - Numbers from 10 to 1 during final countdown
   - Completion message when timer finishes

### Background Cycling
1. Open the **hamburger menu** (☰)
2. Toggle **Background Cycling** on/off
3. Choose between **Gradients** or **Images**
4. Set cycle interval (5s, 10s, 15s, 30s, 1m)
5. Backgrounds change automatically while timer runs

### Music Player
1. Upload audio files using the music player
2. Control playback with play/pause/stop buttons
3. Visualize audio with waveform display
4. Create playlists for different moods

## 🎯 Key Features Explained

### Streamlined Time Input
- **Compact Design**: Ultra-compact layout with minimal padding
- **Inline Button**: Set button positioned inline with time inputs
- **Even Distribution**: All elements evenly spaced using `space-evenly`
- **Validation**: Real-time validation with error messages
- **Keyboard Support**: Arrow keys for adjustment, Enter to set
- **Auto-normalization**: Converts overflow values automatically

### Progress Tracking
- **Dynamic Calculation**: Based on current time vs target
- **Smooth Animation**: Updates every second
- **Percentage Display**: Shows completion percentage
- **Visual Feedback**: Color-coded progress indicators

### Hamburger Menu
- **Desktop**: Dropdown menu with all controls
- **Mobile**: Slide-out menu with touch-friendly buttons
- **Quick Presets**: Fast access to common time targets
- **Theme Toggle**: Switch between light and dark modes
- **Voice Control**: Enable/disable text-to-speech
- **Background Control**: Manage cycling and image settings

### Background Cycling
- **Unsplash Integration**: Dynamic images based on themes
- **Gradient Fallbacks**: Beautiful gradients when images unavailable
- **Theme-aware**: Different backgrounds for light/dark modes
- **Smooth Transitions**: Fade-in/fade-out between backgrounds
- **Timer-synced**: Only cycles while timer is running

## 📱 Responsive Design

The app is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly buttons
- **Mobile**: Stacked layout with compact components

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App
npm run eject
```

### Project Structure

```
src/
├── App.tsx                    # Main application component
├── App.css                    # Main application styles
├── components/
│   ├── TimeInput.tsx         # Streamlined time input component
│   ├── TimeInput.css         # Time input styles
│   ├── HamburgerMenu.tsx     # Hamburger menu component
│   ├── HamburgerMenu.css     # Menu styles
│   ├── MusicPlayer.tsx       # Music player component
│   ├── MusicPlayer.css       # Music player styles
│   ├── BackgroundCycleControl.tsx # Background cycling control
│   ├── BackgroundCycleControl.css # Background control styles
│   └── CircularProgress.tsx  # Progress indicator component
├── hooks/
│   ├── useTimer.ts           # Timer logic hook
│   ├── useBackgroundCycle.ts # Background cycling hook
│   ├── useTheme.ts           # Theme management hook
│   └── useSpeech.ts          # Text-to-speech hook
├── Modal.tsx                 # Custom modal component
├── Modal.css                 # Modal component styles
└── index.tsx                 # Application entry point
```

## 🎨 Styling Features

- **Modern Design**: Clean, minimalist interface
- **Compact Components**: Streamlined layouts with minimal padding
- **Smooth Transitions**: Cubic-bezier animations for polished feel
- **Hover Effects**: Subtle button and interactive element animations
- **Professional Typography**: Inter font stack for modern look
- **Box Shadows**: Subtle depth and elevation effects
- **Theme Support**: Light and dark mode with CSS variables

## 🌟 Recent Updates

### v2.0 - Streamlined Design
- ✨ **Ultra-compact TimeInput**: Reduced size by 33% with inline Set button
- 🎯 **Even Distribution**: All elements evenly spaced across sections
- 🗑️ **Removed Total Time Display**: Cleaner, more streamlined interface
- 📱 **Enhanced Mobile Design**: Better responsive behavior
- 🎨 **Modern Styling**: Updated with contemporary design patterns

### v1.5 - Feature Enhancements
- 🍔 **Hamburger Menu**: Compact controls with quick presets
- 🎵 **Music Player**: Audio upload and playback functionality
- 🖼️ **Background Cycling**: Dynamic backgrounds with Unsplash integration
- 🌙 **Theme Support**: Light and dark mode toggle
- 🔊 **Text-to-Speech**: Voice announcements for countdown

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Icons and emojis for visual elements
- Web Speech API for text-to-speech functionality
- Unsplash API for dynamic background images
- Modern CSS techniques for animations and styling

---

**Made with ❤️ by Lena**

Visit the live app: [SnapTimer](https://github.com/lena0429/ai-counter-app)
