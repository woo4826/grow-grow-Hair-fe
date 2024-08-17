import React, { useRef, useState, useEffect } from 'react';
import './GamePage.css';
import baseImage from './assets/base.png';

// Import all grass images dynamically using import.meta.glob
const importAllGrassImages = import.meta.glob('./assets/grass/*.png');
const grassImages = Object.values(importAllGrassImages).map((importFn) => importFn().then(mod => mod.default));

const getInitialGrassImages = (allImages) => {
  return allImages.filter(img => img.endsWith('-1.png'));
};

const GamePage = () => {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [grasses, setGrasses] = useState([]);
  const [loadedGrassImages, setLoadedGrassImages] = useState([]);
  const [initialGrassImages, setInitialGrassImages] = useState([]);

  useEffect(() => {
    // Load all grass images
    Promise.all(grassImages).then((images) => {
      setLoadedGrassImages(images);
      setInitialGrassImages(getInitialGrassImages(images));
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const baseImg = new Image();
    baseImg.src = baseImage;

    baseImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const handleCanvasClick = (event) => {
    if (!selectedTool || loadedGrassImages.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (selectedTool === 'grass') {
      const randomGrassIndex = Math.floor(Math.random() * initialGrassImages.length);
      const grassImg = new Image();
      grassImg.src = initialGrassImages[randomGrassIndex];

      grassImg.onload = () => {
        ctx.drawImage(grassImg, x - 25, y - 25, 50, 50); // Default size
        setGrasses([...grasses, { x: x - 25, y: y - 25, size: 50, img: grassImg.src, state: 1 }]);
      };
    } else if (selectedTool === 'water') {
      const updatedGrasses = grasses.map((grass) => {
        if (Math.random() < 0.5) { // Random probability for the water effect
          let newState = grass.state;
          let newImg = grass.img;
          let newSize = grass.size;

          if (newState < 5) {
            newState += 1;
            newImg = loadedGrassImages.find(img => img.includes(`${Math.floor(newState / 5) + 1}-${newState % 5}`));
          } else {
            newSize *= 1.2; // Increase size if state is 5
          }

          // Redraw with updated image and size
          ctx.clearRect(grass.x, grass.y, grass.size, grass.size);
          const updatedGrassImg = new Image();
          updatedGrassImg.src = newImg;
          updatedGrassImg.onload = () => {
            ctx.drawImage(updatedGrassImg, grass.x, grass.y, newSize, newSize);
          };

          return { ...grass, size: newSize, img: newImg, state: newState };
        }
        return grass;
      });

      // Clear and redraw base image and updated grasses
      const baseImg = new Image();
      baseImg.src = baseImage;
      baseImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
        updatedGrasses.forEach(grass => {
          const img = new Image();
          img.src = grass.img;
          img.onload = () => {
            ctx.drawImage(img, grass.x, grass.y, grass.size, grass.size);
          };
        });
      };

      setGrasses(updatedGrasses);
    } else if (selectedTool === 'fertilizer') {
      const newGrasses = grasses.reduce((acc, grass) => {
        acc.push(grass);
        if (Math.random() < 0.5) {
          const newX = grass.x + Math.random() * 20 - 10;
          const newY = grass.y + Math.random() * 20 - 10;
          const newSize = grass.size;
          const newImg = grass.img;

          const newGrassImg = new Image();
          newGrassImg.src = newImg;
          newGrassImg.onload = () => {
            ctx.drawImage(newGrassImg, newX, newY, newSize, newSize);
          };

          acc.push({ x: newX, y: newY, size: newSize, img: newImg, state: grass.state });
        }
        return acc;
      }, []);
      setGrasses(newGrasses);
    }
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    document.body.className = `${tool}-cursor`;
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="game-canvas"
        onClick={handleCanvasClick}
      ></canvas>
      <div className="button-container">
        <button
          className={`game-button ${selectedTool === 'grass' ? 'selected' : ''}`}
          onClick={() => handleToolSelect('grass')}
        >
          Grass
        </button>
        <button
          className={`game-button ${selectedTool === 'water' ? 'selected' : ''}`}
          onClick={() => handleToolSelect('water')}
        >
          Water
        </button>
        <button
          className={`game-button ${selectedTool === 'fertilizer' ? 'selected' : ''}`}
          onClick={() => handleToolSelect('fertilizer')}
        >
          Fertilizer
        </button>
      </div>
    </div>
  );
};

export default GamePage;
