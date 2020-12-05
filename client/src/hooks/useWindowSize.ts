import { useState, useEffect } from "react";

export type WindowSize = null | {
  width: number;
  height: number;
};

export default () => {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<null | WindowSize>(null);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};
