import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import p5 from "p5";

const ProcessingHeart = () => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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
        p.createCanvas(size.width, size.height);
        p.colorMode(p.HSB, 360, 100, 100); // Set HSB color mode for dynamic coloring
        p.noStroke(); // Removes outlines for all shapes
      };

      p.draw = () => {
        // Background with slight transparency to create a trailing effect
        p.fill(30, 50, 50, 10); // Create semi-transparent white to fade out the previous shapes
        p.rect(0, 0, p.width, p.height); // Draw the rectangle

        for (let i = 0; i < 10; i++) { // Create 10 rows
          for (let j = 0; j < 10; j++) { // Create 10 columns
            let x = i * 80 + 40; // Calculate x position
            let y = j * 80 + 40; // Calculate y position
            let size = p.map(p.mouseX, 0, p.width, 20, 60); // Dynamic size based on mouseX
            let hue = p.map(p.mouseY, 0, p.height, 0, 360); // Dynamic hue based on mouseY

            p.fill(hue, 80, 100); // Set fill color based on dynamic hue
            drawHeart(p, x, y, size); // Draw the heart shape at position (x, y)
          }
        }
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

  // Function to draw a heart shape
  const drawHeart = (p, x, y, size) => {
    const s = size / 10.0; // Create a scale factor based on size

    p.beginShape();
    p.vertex(x, y);
    p.bezierVertex(x - s * 5, y - s * 5, x - s * 10, y + s * 2, x, y + s * 10); // Left curve
    p.bezierVertex(x + s * 10, y + s * 2, x + s * 5, y - s * 5, x, y); // Right curve
    p.endShape(p.CLOSE);
  };

  return (
    <div ref={containerRef} className="w-full h-48 overflow-hidden bg-gray-300">

    </div>
  );
};

export default ProcessingHeart;
