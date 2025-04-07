// Function to measure and report web vitals (performance metrics)
const reportWebVitals = onPerfEntry => {
  // Check if onPerfEntry is a valid function before proceeding
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the 'web-vitals' module
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call each web vital function with the provided onPerfEntry callback to collect performance data
      getCLS(onPerfEntry); // Cumulative Layout Shift (CLS) - measures unexpected layout shifts
      getFID(onPerfEntry); // First Input Delay (FID) - measures user interaction responsiveness
      getFCP(onPerfEntry); // First Contentful Paint (FCP) - measures the time it takes for the first visible content to load
      getLCP(onPerfEntry); // Largest Contentful Paint (LCP) - measures the time it takes for the largest visible content to load
      getTTFB(onPerfEntry); // Time to First Byte (TTFB) - measures the time from the request to the first byte received
    });
  }
};

// Export the function for use in other parts of the application
export default reportWebVitals;
