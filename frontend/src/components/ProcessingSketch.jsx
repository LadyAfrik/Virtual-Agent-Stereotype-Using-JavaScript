import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import p5 from "p5";

const ProcessingSketch = () => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // This hook updates the size of the container
  useLayoutEffect(() => {
    // Function to update the size of the container
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

    // Add a resize listener to update canvas size when window is resized
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []); // Run only once on mount and cleanup on unmount

  useEffect(() => {
    // Only create the sketch when the size is available (i.e., after the first render)
    if (size.width === 0 || size.height === 0) return;

    const sketch = (p) => {
      p.setup = () => {
        // Set the canvas size based on the container size
        p.createCanvas(size.width, size.height);
        p.noStroke(); // Removes outlines for all shapes
      };

      p.draw = () => {
        // Background with slight transparency to create a trailing effect
        p.fill(255, 255, 255, 10); // Create semi-transparent white to fade out the previous shapes
        p.rect(0, 0, p.width, p.height); // Draw the rectangle

        // Mouse-Controlled Shape Properties using mouseX and mouseY
        const shapeSize = p.map(p.mouseX, 0, p.width, 10, 100); // Map mouseX to size range
        const red = p.map(p.mouseX, 0, p.width, 0, 255); // Map mouseX to red color
        const blue = p.map(p.mouseY, 0, p.height, 0, 255); // Map mouseY to blue color
        const green = p.map(p.mouseY + p.mouseX, 0, p.width + p.height, 0, 255); // Map mouseX + mouseY to green color

        // Draw dynamic shape (ellipse) at mouse position
        p.fill(red, green, blue); // Set color for ellipse based on mouse position
        p.ellipse(p.mouseX, p.mouseY, shapeSize, shapeSize); // Draw ellipse at mouse position

        // Creating Symmetry with Complementary Colors (mirrored effect)
        p.fill(255 - red, 255 - green, 255 - blue); // Complementary color (inverted)
        p.rect(p.width - p.mouseX, p.height - p.mouseY, shapeSize, shapeSize); // Draw rectangle opposite to mouse position
      };

      // Update canvas size when the parent container size changes
      p.windowResized = () => {
        p.resizeCanvas(size.width, size.height);
      };
    };

    const canvas = new p5(sketch, containerRef.current);

    // Cleanup the sketch on component unmount
    return () => {
      canvas.remove();
    };
  }, [size]); // Re-run the effect when the size changes

  return (
    <div ref={containerRef} className="w-full h-72 bg-gray-400 rounded-lg border-3">
      <p className="italic text-sm mt-2 text-center">One of the Students Assignments</p>
    </div>
  );
};

export default ProcessingSketch;
