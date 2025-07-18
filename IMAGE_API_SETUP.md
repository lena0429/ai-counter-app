# Image API Setup Guide

## Overview
The SnapTimer app now supports dynamic background images from free image APIs. By default, it uses Picsum Photos (no API key required), but you can also integrate with Unsplash for higher quality images.

## Free Image Options

### 1. Picsum Photos (Default - No Setup Required)
- **Service**: Picsum Photos
- **Cost**: Free
- **API Key**: Not required
- **Quality**: Good quality random images
- **Usage**: Works out of the box

### 2. Unsplash API (Optional - Higher Quality)
- **Service**: Unsplash
- **Cost**: Free (with rate limits)
- **API Key**: Required
- **Quality**: High-quality curated images
- **Setup**: Requires registration

## Setup Instructions

### For Unsplash API (Optional)

1. **Create Unsplash Account**
   - Go to [https://unsplash.com/developers](https://unsplash.com/developers)
   - Sign up for a free account

2. **Create Application**
   - Click "New Application"
   - Accept the terms and conditions
   - Fill in your application details

3. **Get API Key**
   - Copy your "Access Key" from the application dashboard
   - Note: Keep this key private and don't commit it to public repositories

4. **Update Configuration**
   - Open `src/hooks/useBackgroundCycle.ts`
   - Replace `'YOUR_UNSPLASH_ACCESS_KEY'` with your actual access key:
   ```typescript
   const UNSPLASH_ACCESS_KEY = 'your_actual_access_key_here';
   ```

## Features

### Background Themes with Images
Each theme now has associated image queries:
- **Ocean Blue**: "ocean waves blue"
- **Sunset Orange**: "sunset orange sky"
- **Forest Green**: "forest trees green"
- **Purple Dream**: "purple flowers dreamy"
- **Golden Hour**: "golden hour sunlight"
- **Midnight Sky**: "night sky stars"
- **Aurora**: "aurora borealis northern lights"
- **Desert Sand**: "desert sand dunes"
- **Ocean Depths**: "underwater ocean deep"
- **Spring Blossom**: "cherry blossoms spring"

### Controls
- **Image Toggle**: Switch between gradients and images
- **Loading Indicator**: Shows when images are being fetched
- **Fallback System**: Automatically falls back to gradients if image loading fails
- **Theme-Aware**: Different image queries for light and dark themes

## Usage

1. **Enable Background Cycling**: Toggle the cycling feature
2. **Enable Images**: Click the "Images" button to switch from gradients to images
3. **Set Interval**: Choose how often backgrounds change (5s to 1m)
4. **Start Timer**: Backgrounds will cycle automatically while the timer runs

## Rate Limits

### Picsum Photos
- No rate limits
- Unlimited usage

### Unsplash API
- **Demo applications**: 50 requests per hour
- **Production applications**: 5,000 requests per hour
- **Rate limit headers**: Included in API responses

## Troubleshooting

### Images Not Loading
1. Check your internet connection
2. Verify API key (if using Unsplash)
3. Check browser console for error messages
4. App will automatically fall back to gradients

### Performance Issues
1. Images are cached by the browser
2. Loading indicators show when fetching new images
3. Consider using gradients for slower connections

## Security Notes

- Never commit API keys to public repositories
- Use environment variables for production deployments
- The app includes fallback mechanisms for API failures 