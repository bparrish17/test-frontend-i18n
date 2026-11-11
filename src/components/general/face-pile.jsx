import React, { useRef, useEffect } from 'react';
import avatarFallback from '@assets/images/avatar-fallback.svg';
import roomIcon from '@assets/images/videoprojector.svg';

const RENDER_MAP = {
  xsmall: {
    2: [
      [0, 8, 33],
      [34, 25, 25]
    ],
    3: [
      [0, 4, 33],
      [33, 18, 26],
      [16, 37, 18]
    ],
    4: [
      [0, 4, 31],
      [33, 18, 26],
      [15, 38, 18],
      [34, 4, 12]
    ],
    5: [
      [1, 4, 31],
      [34, 19, 26],
      [16, 38, 18],
      [34, 4, 12],
      [0, 38, 10]
    ]
  },
  small: {
    2: [
      [0, 11, 44],
      [46, 34, 34]
    ],
    3: [
      [0, 5, 44],
      [44, 24, 35],
      [22, 49, 25]
    ],
    4: [
      [0, 6, 42],
      [44, 25, 35],
      [20, 50, 25],
      [45, 6, 17]
    ],
    5: [
      [1, 6, 42],
      [45, 26, 35],
      [21, 50, 25],
      [45, 6, 17],
      [0, 50, 15]
    ]
  },
  medium: {
    2: [
      [0, 22, 88],
      [92, 68, 68]
    ],
    3: [
      [0, 10, 88],
      [88, 48, 70],
      [44, 98, 50]
    ],
    4: [
      [0, 12, 84],
      [88, 50, 70],
      [40, 100, 50],
      [90, 12, 34]
    ],
    5: [
      [2, 12, 84],
      [90, 52, 70],
      [42, 100, 50],
      [90, 12, 34],
      [0, 100, 30]
    ]
  },
  large: {
    2: [
      [0, 33, 132],
      [138, 102, 102]
    ],
    3: [
      [0, 15, 132],
      [132, 72, 105],
      [66, 147, 75]
    ],
    4: [
      [0, 18, 126],
      [132, 75, 105],
      [60, 150, 75],
      [135, 18, 51]
    ],
    5: [
      [3, 18, 126],
      [135, 78, 105],
      [63, 150, 75],
      [135, 18, 51],
      [0, 150, 45]
    ]
  }
};

export default function FacePile({ faces, size = 'small' }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawImageFromUrl = (url, x, y, size) => {
      const img = new Image();

      // todo: hack to see if using blue fallback from api
      if (url?.includes('/ao/')) {
        url = avatarFallback;
      }

      img.src = url || avatarFallback;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      };
    };

    const mapInd = faces?.length >= 6 ? 5 : faces?.length;
    const renderCoordinates = RENDER_MAP[size][mapInd] || [];
    renderCoordinates.forEach(([x, y, size], index) => {
      // todo: hack to see if its a room
      if (/\broom\b/i.test(faces[index].name)) {
        faces[index].avatar_url = roomIcon;
      }
      drawImageFromUrl(faces[index].avatar_url, x, y, size);
    });
  }, [faces, size]);

  let canvasSize;
  if (size === 'xsmall') {
    canvasSize = 60;
  } else if (size === 'small') {
    canvasSize = 80;
  } else if (size === 'medium') {
    canvasSize = 160;
  } else {
    canvasSize = 240;
  }

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
    ></canvas>
  );
}
