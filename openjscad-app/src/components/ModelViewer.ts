import type { BoxParameters } from '../types';
import { generateHollowBox, validateParameters } from '../modelGenerator';

export class ModelViewer {
  private container: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private currentModel: any = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupViewer();
  }

  private setupViewer(): void {
    this.container.innerHTML = '';
    this.container.className = 'bg-gray-50 rounded-lg shadow-lg p-6 flex flex-col h-full min-h-[500px]';

    // Title
    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-gray-800 mb-4';
    title.textContent = '3D Model Preview';

    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'flex-1 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300';

    // Canvas for 3D rendering (placeholder)
    this.canvas = document.createElement('canvas');
    this.canvas.width = 400;
    this.canvas.height = 300;
    this.canvas.className = 'border rounded';
    this.ctx = this.canvas.getContext('2d')!;

    // Controls
    const controls = document.createElement('div');
    controls.className = 'mt-4 flex gap-2 flex-wrap';

    const exportButton = document.createElement('button');
    exportButton.className = 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
    exportButton.textContent = 'Export STL';
    exportButton.addEventListener('click', () => this.exportSTL());

    const downloadButton = document.createElement('button');
    downloadButton.className = 'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500';
    downloadButton.textContent = 'Download Model';
    downloadButton.addEventListener('click', () => this.downloadModel());

    controls.appendChild(exportButton);
    controls.appendChild(downloadButton);

    canvasContainer.appendChild(this.canvas);
    this.container.appendChild(title);
    this.container.appendChild(canvasContainer);
    this.container.appendChild(controls);

    this.drawPlaceholder();
  }

  private drawPlaceholder(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw a simple 3D-like box representation
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;

    // Draw isometric box
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = 120;
    const height = 80;
    const depth = 60;

    // Front face
    this.ctx.fillStyle = '#e0e0e0';
    this.ctx.fillRect(centerX - width/2, centerY - height/2, width, height);
    this.ctx.strokeRect(centerX - width/2, centerY - height/2, width, height);

    // Top face
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - width/2, centerY - height/2);
    this.ctx.lineTo(centerX - width/2 + depth/2, centerY - height/2 - depth/3);
    this.ctx.lineTo(centerX + width/2 + depth/2, centerY - height/2 - depth/3);
    this.ctx.lineTo(centerX + width/2, centerY - height/2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Right face
    this.ctx.fillStyle = '#d0d0d0';
    this.ctx.beginPath();
    this.ctx.moveTo(centerX + width/2, centerY - height/2);
    this.ctx.lineTo(centerX + width/2 + depth/2, centerY - height/2 - depth/3);
    this.ctx.lineTo(centerX + width/2 + depth/2, centerY + height/2 - depth/3);
    this.ctx.lineTo(centerX + width/2, centerY + height/2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Add text
    this.ctx.fillStyle = '#666';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('3D Model Preview', centerX, centerY + height/2 + 30);
    this.ctx.fillText('Update parameters to generate model', centerX, centerY + height/2 + 50);
  }

  private drawModel(params: BoxParameters): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.ctx.fillStyle = '#f8f9fa';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Scale the box proportionally to canvas
    const scale = Math.min(200 / Math.max(params.boxWidth, params.boxDepth, params.boxHeight), 3);
    const width = params.boxWidth * scale;
    const height = params.boxHeight * scale;
    const depth = params.boxDepth * scale;
    const wallThickness = params.wallThickness * scale;

    // Draw outer box
    // Front face
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillRect(centerX - width/2, centerY - height/2, width, height);
    this.ctx.strokeStyle = '#1e40af';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(centerX - width/2, centerY - height/2, width, height);

    // Draw inner cavity (showing hollow effect)
    if (wallThickness < width/2 && wallThickness < height/2) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(
        centerX - width/2 + wallThickness,
        centerY - height/2 + wallThickness,
        width - wallThickness * 2,
        height - wallThickness
      );
      this.ctx.strokeRect(
        centerX - width/2 + wallThickness,
        centerY - height/2 + wallThickness,
        width - wallThickness * 2,
        height - wallThickness
      );
    }

    // Top face (isometric effect)
    this.ctx.fillStyle = '#60a5fa';
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - width/2, centerY - height/2);
    this.ctx.lineTo(centerX - width/2 + depth/3, centerY - height/2 - depth/4);
    this.ctx.lineTo(centerX + width/2 + depth/3, centerY - height/2 - depth/4);
    this.ctx.lineTo(centerX + width/2, centerY - height/2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Right face
    this.ctx.fillStyle = '#2563eb';
    this.ctx.beginPath();
    this.ctx.moveTo(centerX + width/2, centerY - height/2);
    this.ctx.lineTo(centerX + width/2 + depth/3, centerY - height/2 - depth/4);
    this.ctx.lineTo(centerX + width/2 + depth/3, centerY + height/2 - depth/4);
    this.ctx.lineTo(centerX + width/2, centerY + height/2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Add dimension labels
    this.ctx.fillStyle = '#374151';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';

    // Width label
    this.ctx.fillText(`W: ${params.boxWidth}mm`, centerX, centerY + height/2 + 20);

    // Height label
    this.ctx.save();
    this.ctx.translate(centerX - width/2 - 15, centerY);
    this.ctx.rotate(-Math.PI/2);
    this.ctx.fillText(`H: ${params.boxHeight}mm`, 0, 0);
    this.ctx.restore();

    // Depth label
    this.ctx.fillText(`D: ${params.boxDepth}mm`, centerX + width/2 + depth/6, centerY - height/2 - depth/8);

    // Wall thickness indicator
    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = '10px Arial';
    this.ctx.fillText(`Wall: ${params.wallThickness}mm`, centerX, centerY + height/2 + 35);
  }

  public updateModel(params: BoxParameters): void {
    const errors = validateParameters(params);

    if (errors.length > 0) {
      this.drawError(errors);
      return;
    }

    try {
      this.currentModel = generateHollowBox(params);
      this.drawModel(params);
    } catch (error) {
      this.drawError([`Model generation failed: ${error}`]);
    }
  }

  private drawError(errors: string[]): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#fef2f2';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#dc2626';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Invalid Parameters', this.canvas.width / 2, this.canvas.height / 2 - 20);

    this.ctx.font = '12px Arial';
    errors.forEach((error, index) => {
      this.ctx.fillText(error, this.canvas.width / 2, this.canvas.height / 2 + 10 + (index * 20));
    });
  }

  private exportSTL(): void {
    if (!this.currentModel) {
      alert('No model to export. Please generate a valid model first.');
      return;
    }

    // For now, show a message about exporting - would need @jscad/io package
    alert('STL export functionality requires @jscad/io package. The 3D model has been generated and is ready for processing.');
  }

  private downloadModel(): void {
    if (!this.currentModel) {
      alert('No model to download. Please generate a valid model first.');
      return;
    }

    this.exportSTL();
  }
}