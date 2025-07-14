import { Theme } from '@mui/material/styles';

export interface Point {
  x: number;
  y: number;
}

export interface LineSegment {
  start: Point;
  end: Point;
}

export const drawGridlines = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  theme: Theme
) => {
  ctx.strokeStyle =
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;

  // Vertical gridlines
  for (let x = 50; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Horizontal gridlines
  for (let y = 25; y < canvas.height; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

export const drawPoints = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string,
  radius = 6
) => {
  ctx.fillStyle = color;
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  });
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  line: LineSegment,
  color: string,
  width = 2,
  dashPattern?: number[]
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  if (dashPattern) {
    ctx.setLineDash(dashPattern);
  }

  ctx.beginPath();
  ctx.moveTo(line.start.x, line.start.y);
  ctx.lineTo(line.end.x, line.end.y);
  ctx.stroke();

  if (dashPattern) {
    ctx.setLineDash([]);
  }
};

export const calculateBestFitLine = (points: Point[]): LineSegment => {
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return {
    start: { x: 50, y: slope * 50 + intercept },
    end: { x: 550, y: slope * 550 + intercept },
  };
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
