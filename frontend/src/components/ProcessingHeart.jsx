import React, { useRef, useEffect, useState, useLayoutEffect } from "react"; // Import necessary React hooks
import p5 from "p5"; // Import p5.js for canvas and drawing functionality

// Component to render a dynamic heart animation using p5.js
const ProcessingHeart = () => {
  const containerRef = useRef(null);  // Ref to access the container div
  const [size, setSize] = useState({ width: 0, height: 0 });  // State to store the dimensions of the container

  // This hook updates the size of the container
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    // Initial size update
    updateSize();

    // Add a resize listener to update canvas size when the window is resized
    window.addEventListener("resize", updateSize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);  // Run only once on mount and cleanup on unmount

  useEffect(() => {
    // Only create the sketch when the size is available (i.e., after the first render)
    if (size.width === 0 || size.height === 0) return;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(size.width, size.height);  // Create the p5 canvas with the container dimensions
        p.colorMode(p.HSB, 360, 100, 100);  // Set HSB color mode for dynamic coloring
        p.noStroke();  // Remove outlines for all shapes
      };

      p.draw = () => {
        // Background with slight transparency to create a trailing effect
        p.fill(30, 50, 50, 10);  // Create semi-transparent white to fade out the previous shapes
        p.rect(0, 0, p.width, p.height);  // Draw the background rectangle

        // Loop through a 10x10 grid
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            let x = i * 80 + 40;  // Calculate x position
            let y = j * 80 + 40;  // Calculate y position
            let size = p.map(p.mouseX, 0, p.width, 20, 60);  // Dynamic size based on mouseX
            let hue = p.map(p.mouseY, 0, p.height, 0, 360);  // Dynamic hue based on mouseY

            p.fill(hue, 80, 100);  // Set fill color based on dynamic hue
            drawHeart(p, x, y, size);  // Call function to draw a heart at position (x, y)
          }
        }
      };

      // Update canvas size when the parent container size changes
      p.windowResized = () => {
        p.resizeCanvas(size.width, size.height);
      };
    };

    const canvas = new p5(sketch, containerRef.current);  // Initialize the p5 sketch

    // Cleanup the sketch on component unmount
    return () => {
      canvas.remove();
    };
  }, [size]);  // Re-run the effect when the size changes

  // Function to draw a heart shape
  const drawHeart = (p, x, y, size) => {
    const s = size / 10.0;  // Create a scale factor based on size

    p.beginShape();
    p.vertex(x, y);
    p.bezierVertex(x - s * 5, y - s * 5, x - s * 10, y + s * 2, x, y + s * 10);  // Left curve of the heart
    p.bezierVertex(x + s * 10, y + s * 2, x + s * 5, y - s * 5, x, y);  // Right curve of the heart
    p.endShape(p.CLOSE);  // Close the shape to form the heart
  };

  return (
    <div ref={containerRef} className="w-full h-48 overflow-hidden bg-gray-300">
      {/* The container for the p5.js canvas */}
    </div>
  );
};

export default ProcessingHeart;  // Export the component for use in other parts of the app
