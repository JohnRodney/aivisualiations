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

export const calculateLineQuality = (
  points: Point[],
  line: LineSegment
): number => {
  if (!line) return 0;

  const slope = (line.end.y - line.start.y) / (line.end.x - line.start.x);
  const intercept = line.start.y - slope * line.start.x;

  let totalError = 0;
  points.forEach((point) => {
    const expectedY = slope * point.x + intercept;
    const error = Math.abs(point.y - expectedY);
    totalError += error;
  });

  // Convert to a 0-100 score (lower error = higher score)
  const avgError = totalError / points.length;
  const maxError = 200; // Reasonable max error for scoring
  return Math.max(0, Math.min(100, 100 - (avgError / maxError) * 100));
};

export const drawErrorLines = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  line: LineSegment,
  color = 'rgba(255, 0, 0, 0.3)'
) => {
  if (!line) return;

  const slope = (line.end.y - line.start.y) / (line.end.x - line.start.x);
  const intercept = line.start.y - slope * line.start.x;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);

  points.forEach((point) => {
    const expectedY = slope * point.x + intercept;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, expectedY);
    ctx.stroke();
  });

  ctx.setLineDash([]);
};

export const drawBestFitHint = (
  ctx: CanvasRenderingContext2D,
  bestFitLine: LineSegment,
  color = 'rgba(0, 255, 0, 0.5)'
) => {
  drawLine(ctx, bestFitLine, color, 2, [10, 10]);
};
