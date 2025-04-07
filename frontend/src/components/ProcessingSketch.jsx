import React, { useRef, useEffect, useState, useLayoutEffect } from "react"; // Import necessary React hooks
import p5 from "p5"; // Import p5.js library for canvas and drawing

const ProcessingSketch = () => {
  const containerRef = useRef(null); // Reference to the container div where the canvas will be mounted
  const [size, setSize] = useState({ width: 0, height: 0 }); // State to store container size

  // This hook updates the size of the container
  useLayoutEffect(() => {
    // Function to update the size of the container dynamically
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,  // Update width
          height: containerRef.current.offsetHeight, // Update height
        });
      }
    };

    // Initial size update
    updateSize();

    // Add a resize listener to update canvas size when window is resized
    window.addEventListener("resize", updateSize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []); // Run only once on mount and cleanup on unmount

  useEffect(() => {
    // Only create the sketch when the size is available (i.e., after the first render)
    if (size.width === 0 || size.height === 0) return;

    const sketch = (p) => {
      // p5.js setup function
      p.setup = () => {
        p.createCanvas(size.width, size.height);  // Create canvas with dynamic width and height
        p.noStroke(); // Disable outlines for all shapes
      };

      // p5.js draw function
      p.draw = () => {
        // Background with slight transparency to create a trailing effect
        p.fill(255, 255, 255, 10);  // Create semi-transparent white to fade out the previous shapes
        p.rect(0, 0, p.width, p.height); // Draw a transparent rectangle as background

        // Mouse-Controlled Shape Properties using mouseX and mouseY
        const shapeSize = p.map(p.mouseX, 0, p.width, 10, 100); // Map mouseX to control shape size
        const red = p.map(p.mouseX, 0, p.width, 0, 255);  // Map mouseX to red color component
        const blue = p.map(p.mouseY, 0, p.height, 0, 255); // Map mouseY to blue color component
        const green = p.map(p.mouseY + p.mouseX, 0, p.width + p.height, 0, 255); // Map sum of mouseX and mouseY to green color component

        // Draw dynamic shape (ellipse) at mouse position with dynamic color
        p.fill(red, green, blue);  // Set color for ellipse based on mouse position
        p.ellipse(p.mouseX, p.mouseY, shapeSize, shapeSize);  // Draw ellipse at mouse position

        // Creating Symmetry with Complementary Colors (mirrored effect)
        p.fill(255 - red, 255 - green, 255 - blue); // Complementary color (invert the red, green, and blue)
        p.rect(p.width - p.mouseX, p.height - p.mouseY, shapeSize, shapeSize); // Draw rectangle at mirrored position
      };

      // Update canvas size when the parent container size changes
      p.windowResized = () => {
        p.resizeCanvas(size.width, size.height);  // Resize canvas based on updated container size
      };
    };

    // Create p5 instance and pass the sketch function and the containerRef as the element to mount on
    const canvas = new p5(sketch, containerRef.current);

    // Cleanup the sketch on component unmount
    return () => {
      canvas.remove();  // Remove p5 canvas when the component unmounts
    };
  }, [size]); // Re-run the effect when the size changes

  return (
    <div ref={containerRef} className="w-full h-72 bg-gray-400 rounded-lg border-3">  {/* Container div for the sketch */}
      <p className="italic text-sm mt-2 text-center">One of the Students Assignments</p>  {/* Optional caption */}
    </div>
  );
};

export default ProcessingSketch;  // Export the component to use it in other parts of the app
