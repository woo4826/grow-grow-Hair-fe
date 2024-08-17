import React, { useRef, useState, useEffect } from 'react';
import './GamePage.css';
import baseImage from './assets/base.png';
import grassCursor from './assets/cursor/grass.png';
import waterCursor from './assets/cursor/water.png';
import fertilizerCursor from './assets/cursor/fertilizer.png';
import defaultCursor from './assets/cursor/default.png';


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
  const [cursorStyle, setCursorStyle] = useState('url(./assets/cursor/grass.png), auto');


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

    // console.log('selectedTool:', selectedTool);
    // console.log('grasses:', grasses);

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
        ctx.drawImage(grassImg, x - 25, y - 25, 25, 50); // Default size
        setGrasses([...grasses, { x: x - 25, y: y - 25, xSize: 25, ySize: 50, img: grassImg.src, state: 1, imgIndex: randomGrassIndex }]);
      };
    } else if (selectedTool === 'water') {
      const updatedGrasses = grasses.map((grass) => {
        if (Math.random() < 1 - 0.2 * grass.state && Math.abs(grass.x - x) < 50 && Math.abs(grass.y - y) < 150) { // Random probability for the water effect
          let newState = grass.state;
          let newImg = grass.img;
          let newSize = grass.ySize;
          
          newSize += 10;
          if ( newState < 5) {
            newState += 1;
            newImg = `/src/assets/grass/${grass.imgIndex}-${newState}.png`;
          }

          return { x: grass.x, y: grass.y, xSize: grass.xSize, ySize: newSize, img: newImg, state: newState, imgIndex: grass.imgIndex };
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
            ctx.drawImage(img, grass.x, grass.y, grass.xSize, grass.ySize);
          };
        });
      };

      setGrasses(updatedGrasses);
      // console.log('after');
      // console.log(grasses);
    } else if (selectedTool === 'fertilizer') {
      const newGrasses = grasses.reduce((acc, grass) => {
        acc.push(grass);
        if (Math.random() < 1 - 0.2 * grass.state) {
          const newX = grass.x + Math.random() * 20 - 10;
          const newY = grass.y + Math.random() * 20 - 10;
          const newXSize = grass.xSize;
          const newYSize = grass.ySize;
          const newImg = grass.img;

          const newGrassImg = new Image();
          newGrassImg.src = newImg;
          newGrassImg.onload = () => {
            ctx.drawImage(newGrassImg, newX, newY, newXSize, newYSize);
          };

          acc.push({ x: newX, y: newY, xSize: newXSize, ySize: newYSize, img: newImg, state: grass.state, imgIndex: grass.imgIndex });
        }
        return acc;
      }, []);
      setGrasses(newGrasses);
    }
  };

  const handleToolSelect = (tool) => {
    let newCursorStyle = `url(${defaultCursor}), auto`; // Default cursor

    switch (tool) {
      case 'grass':
        newCursorStyle = `url(${grassCursor}), auto`;
        break;
      case 'water':
        newCursorStyle = `url(${waterCursor}), auto`;
        break;
      case 'fertilizer':
        newCursorStyle = `url(${fertilizerCursor}), auto`;
        break;
      default:
        newCursorStyle = `url(${defaultCursor}), auto`;
    }

    setCursorStyle(newCursorStyle);
    setSelectedTool(tool);
  };

  return (
    <div className="wrapper" style={{ cursor: cursorStyle }}>
      <div className="game-name">
        자라나라 잔디 잔디~
      </div>
      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={700}
          height={700}
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
    </div>
  );
};

export default GamePage;
