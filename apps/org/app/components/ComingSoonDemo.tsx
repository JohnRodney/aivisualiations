import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { ThemeMode } from '../theme/theme';

interface Feature {
  title: string;
  description: string;
}

interface ComingSoonDemoProps {
  title: string;
  description: string;
  features: Feature[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  concepts: string[];
}

export default function ComingSoonDemo({
  title,
  description,
  features,
  difficulty,
  concepts,
}: ComingSoonDemoProps) {
  const { themeMode } = useTheme();

  const difficultyColor = {
    Beginner: 'text-green-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-red-400',
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/aibackground.png)' }}
      />
      <div
        className={`fixed inset-0 ${
          themeMode === 'dark' ? 'bg-black/60' : 'bg-white/60'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <p
            className={`text-xl mb-8 max-w-3xl mx-auto ${
              themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {description}
          </p>

          {/* Difficulty and Concepts */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${difficultyColor[difficulty]} bg-black/20 backdrop-blur-sm`}
            >
              {difficulty}
            </span>
            {concepts.map((concept, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full text-sm ${
                  themeMode === 'dark'
                    ? 'bg-gray-800/50 text-gray-300'
                    : 'bg-white/50 text-gray-700'
                } backdrop-blur-sm`}
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Coming Soon Message */}
        <div
          className={`max-w-4xl mx-auto mb-12 p-8 rounded-2xl backdrop-blur-md ${
            themeMode === 'dark'
              ? 'bg-gray-900/30 border-gray-700/30'
              : 'bg-white/30 border-gray-200/30'
          } border`}
        >
          <div className="text-center">
            <h2
              className={`text-3xl font-bold mb-4 ${
                themeMode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              🚧 Coming Soon! 🚧
            </h2>
            <p
              className={`text-lg mb-6 ${
                themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              This interactive demo is currently under development. Here's what
              you can expect:
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl backdrop-blur-md ${
                themeMode === 'dark'
                  ? 'bg-gray-900/30 border-gray-700/30'
                  : 'bg-white/30 border-gray-200/30'
              } border hover:scale-105 transition-transform duration-300`}
            >
              <h3
                className={`text-xl font-semibold mb-3 ${
                  themeMode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`${
                  themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stay Tuned */}
        <div className="text-center">
          <p
            className={`text-lg ${
              themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Stay tuned for this exciting interactive learning experience! 🎓
          </p>
        </div>
      </div>
    </div>
  );
}
