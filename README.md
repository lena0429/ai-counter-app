# 🎯 AI Counter App

A modern, feature-rich React counter application with countdown functionality, custom input validation, text-to-speech, and beautiful animations.

![Counter App Demo](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🚀 Core Functionality
- **Count Up Mode**: Count from 0 to infinity
- **Countdown Mode**: Custom countdown timer with progress bar
- **Custom Input**: Set any countdown time (1-9999 seconds)
- **Real-time Validation**: Input validation with error messages

### 🎨 Modern UI/UX
- **Beautiful Design**: Glass-morphism effects and gradient backgrounds
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Progress Bar**: Visual countdown progress indicator

### 🔊 Text-to-Speech
- **Voice Announcements**: Speaks countdown numbers (10 to 1)
- **Completion Alert**: Announces "Time's up!" when countdown finishes
- **Toggle Control**: Enable/disable voice with animated button
- **Browser API**: Uses Web Speech API for natural voice

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
2. Click **"Start"** to begin counting
3. Click **"Pause"** to stop temporarily
4. Click **"Reset"** to set counter back to 0

### Countdown Mode
1. Click **"Countdown"** mode button
2. Enter your desired time in seconds (1-9999)
3. Click **"Set"** to apply the custom countdown
4. Click **"Start"** to begin countdown
5. Watch the progress bar fill up
6. Get notified when countdown completes

### Voice Features
1. Click the **voice toggle button** (🔊) to enable/disable
2. When enabled, voice will announce:
   - Numbers from 10 to 1 during final countdown
   - "Time's up!" when countdown completes
3. Toggle off anytime to disable voice

## 🎯 Key Features Explained

### Custom Countdown Input
- **Validation**: Only positive integers (1-9999)
- **Real-time Feedback**: Error messages for invalid input
- **Smart Reset**: Uses custom value when resetting
- **Time Format**: Displays in MM:SS format

### Progress Bar
- **Dynamic Calculation**: Based on custom countdown time
- **Smooth Animation**: Updates every second
- **Percentage Display**: Shows completion percentage
- **Visual Feedback**: Green gradient fill

### Modal System
- **Auto-trigger**: Shows when countdown reaches 0
- **Multiple Close Methods**: 
  - Click × button
  - Click "Got it!" button
  - Click outside modal
  - Press Escape key
- **Body Scroll Prevention**: Prevents background scrolling

### Voice Integration
- **Browser Compatibility**: Automatically detects Web Speech API
- **Optimized Settings**: Slower rate for clarity
- **Smart Timing**: Only announces final 10 seconds
- **Graceful Fallback**: No errors on unsupported browsers

## 📱 Responsive Design

The app is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly buttons
- **Mobile**: Stacked layout with full-width buttons

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
├── App.tsx          # Main application component
├── App.css          # Main application styles
├── Modal.tsx        # Custom modal component
├── Modal.css        # Modal component styles
└── index.tsx        # Application entry point
```

## 🎨 Styling Features

- **Glass-morphism**: Backdrop blur effects
- **Gradient Backgrounds**: Purple/blue theme
- **Smooth Transitions**: 0.3s ease animations
- **Hover Effects**: Button and interactive element animations
- **Professional Typography**: System font stack
- **Box Shadows**: Depth and elevation effects

## 🌟 Future Enhancements

Potential features for future versions:
- [ ] Multiple countdown presets
- [ ] Sound effects and audio customization
- [ ] Timer history and favorites
- [ ] Dark/light theme toggle
- [ ] Export/import timer settings
- [ ] PWA support for offline use

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
- Modern CSS techniques for animations and styling

---

**Made with ❤️ by Lena**

Visit the live app: [AI Counter App](https://github.com/lena0429/ai-counter-app)
