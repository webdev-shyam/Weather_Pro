# WeatherPro - Advanced Weather Application

A beautiful, production-ready weather application built with Next.js, React, TypeScript, and Tailwind CSS. Features real-time weather data, 5-day forecasts, and stunning visual design.

## 🌟 Features

- **Real-time Weather Data**: Live weather information using OpenWeatherMap API
- **Location Search**: Search for any city worldwide with autocomplete suggestions
- **Geolocation Support**: Automatic weather detection based on user's location
- **5-Day Forecast**: Detailed weather predictions with hourly breakdowns
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Weather Insights**: Personalized recommendations and air quality information
- **Responsive Design**: Optimized for all device sizes
- **Dynamic Backgrounds**: Weather-appropriate gradient backgrounds
- **Smooth Animations**: Modern micro-interactions and transitions


<a target="_blank" href="https://weather-pro-two-mu.vercel.app/">Live Preview</a>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get OpenWeatherMap API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate your API key

4. **Configure Environment Variables**
   - Copy `.env.local` to your project root
   - Replace `your_api_key_here` with your actual API key:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **API**: OpenWeatherMap API

## 📱 API Integration

The app integrates with OpenWeatherMap API to provide:

- Current weather conditions
- 5-day weather forecasts
- Location search and geocoding
- UV index data
- Weather alerts and recommendations

### API Endpoints Used

- **Current Weather**: `/weather`
- **5-Day Forecast**: `/forecast`
- **Geocoding**: `/geo/1.0/direct`
- **UV Index**: `/uvi`

## 🎨 Design Features

- **Dynamic Backgrounds**: Changes based on weather conditions
- **Glass Morphism**: Modern frosted glass effects
- **Responsive Grid**: Optimized layouts for all screen sizes
- **Weather Icons**: Emoji-based weather representations
- **Smooth Transitions**: CSS animations for enhanced UX
- **Color System**: Weather-appropriate color schemes

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### API Rate Limits

Free OpenWeatherMap accounts include:
- 1,000 API calls per day
- 60 calls per minute
- Current weather, forecasts, and maps

## 📦 Build and Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the 'out' folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](../../issues) page
2. Create a new issue if needed
3. Provide detailed information about your problem

---

Made with ❤️ and ☀️ by Ganeshyam Verma
