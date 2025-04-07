import React, { useRef, useEffect, useState, useLayoutEffect } from "react";  // Import necessary hooks and p5 library
import p5 from "p5";  // Import p5.js library for canvas and graphics

const ProcessingGun = () => {
  const containerRef = useRef(null);  // Reference to the container div to hold the canvas
  const [size, setSize] = useState({ width: 0, height: 0 });  // State to store the size of the container

  // This hook updates the size of the container
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,  // Get the width of the container
          height: containerRef.current.offsetHeight,  // Get the height of the container
        });
      }
    };

    // Initial size update
    updateSize();

    // Add a resize listener to update canvas size when window is resized
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);  // Cleanup listener on unmount
    };
  }, []); // Run only once on mount and cleanup on unmount

  useEffect(() => {
    if (size.width === 0 || size.height === 0) return; // Prevent running the sketch if the size is not available yet.

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(size.width, size.height);  // Create the canvas with the dynamic size
        p.background(30); // Set a dark background color
        p.colorMode(p.HSB, 360, 100, 100); // Use HSB color mode for vibrant colors
        p.noStroke(); // Remove outlines for clean shapes
      };

      p.draw = () => {
        p.background(30, 30); // Add a fading trail effect with semi-transparent background

        const cols = 6; // Number of columns in the grid
        const rows = 6; // Number of rows in the grid
        const spacingX = p.width / (cols + 1); // Horizontal spacing between guns
        const spacingY = p.height / (rows + 1); // Vertical spacing between guns

        // Nested loops for 6x6 grid
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = (i + 1) * spacingX;  // X position of the gun
            const y = (j + 1) * spacingY;  // Y position of the gun

            const size = p.map(p.mouseX, 0, p.width, 30, 100);  // Gun size based on mouseX
            const rotation = p.radians(p.frameCount + (i + j) * 20);  // Rotation based on frameCount and grid position

            const fillColor = p.color((i * 60 + j * 30) % 360, 80, 100);  // Dynamic HSB color based on grid position

            drawRotatingGun(p, x, y, size, rotation, fillColor);  // Call function to draw the rotating gun
          }
        }
      };

      // Update canvas size when the parent container size changes
      p.windowResized = () => {
        p.resizeCanvas(size.width, size.height);  // Resize the canvas to match the new container size
      };
    };

    const canvas = new p5(sketch, containerRef.current);  // Create the p5 canvas inside the container

    // Cleanup the sketch on component unmount
    return () => {
      canvas.remove();  // Remove the p5 canvas when the component unmounts
    };
  }, [size]); // Re-run the effect when the size changes

  // Function to draw a rotating gun shape
  const drawRotatingGun = (p, x, y, size, rotation, fillColor) => {
    p.push();  // Save the current coordinate system
    p.translate(x, y);  // Move to the specified position
    p.rotate(rotation);  // Rotate the gun around its new origin
    p.fill(fillColor);  // Set the gun's color

    // Draw gun barrel
    p.rect(-size * 0.1, -size * 0.5, size * 0.2, size * 0.8);

    // Draw gun grip
    p.rect(-size * 0.3, size * 0.3, size * 0.6, size * 0.4);

    // Draw trigger guard
    p.ellipse(12, size * 0.1 + size * 0.1, size * 0.3, size * 0.3);

    p.pop();  // Restore the original coordinate system
  };

  return (
    <div ref={containerRef} className="w-full h-80 overflow-hidden bg-gray-300">
      {/* The canvas will be rendered inside this container */}
    </div>
  );
};

export default ProcessingGun;  // Export the component for use in other parts of the app
