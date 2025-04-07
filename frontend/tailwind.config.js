/** @type {import('tailwindcss').Config} */
export default {
  // Define the paths where Tailwind should look for class names to generate styles
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      // Extend the default animation options with custom animations
      animation: {
        // Define a gradient animation that moves the background position
        gradient: 'gradient 6s ease infinite',
        // Define a floating animation that makes an element move up and down
        float: 'float 3s ease-in-out infinite',
        // Define a zoom effect animation that changes the scale of an element
        zoom: 'zoom 2s ease-in-out infinite',
        // Typewriter effect to make text appear letter by letter
        typewriter: 'typewriter 4s steps(40) 1s 1 normal both',
        // Blink effect that makes an element's border color change
        blink: 'blink 1s step-end infinite',
      },

      // Custom keyframe animations for each defined animation
      keyframes: {
        // Define the gradient animation movement
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Define the float animation (up and down movement)
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Define the zoom animation (scaling effect)
        zoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        // Define the typewriter animation (text width change)
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        // Define the blink animation (border color change)
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'white' },
        },
      },

      // Extend the default background size options with custom sizes
      backgroundSize: {
        // '200%' refers to a background size of 200% of the element's dimensions
        '200%': '200% 200%',
      },

      // Extend the default background image options with custom gradients
      backgroundImage: {
        // Define a blue gradient as a background image
        'blue-gradient': 'linear-gradient(to right, #1E40AF, #3B82F6)',
      },
    },
  },

  // Tailwind plugins (currently empty, can be used to extend functionality)
  plugins: [],
};
