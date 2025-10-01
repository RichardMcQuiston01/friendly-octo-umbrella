import './style.css'
import { ParameterForm } from './components/ParameterForm'
import { ModelViewer } from './components/ModelViewer'
import type { BoxParameters } from './types'

class App {
  private parameters: BoxParameters = {
    wallThickness: 2,
    layerHeight: 0.2,
    boxWidth: 50,
    boxDepth: 30,
    boxHeight: 20
  };

  private parameterForm!: ParameterForm;
  private modelViewer!: ModelViewer;

  constructor() {
    this.setupLayout();
    this.initializeComponents();
  }

  private setupLayout(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    app.className = 'min-h-screen bg-gray-100 p-4';

    app.innerHTML = `
      <div class="max-w-7xl mx-auto">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">JSCAD 3D Box Generator</h1>
          <p class="text-gray-600">Create custom hollow boxes suitable for 3D printing</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="parameter-form"></div>
          <div id="model-viewer"></div>
        </div>

        <footer class="text-center mt-8 text-gray-500 text-sm">
          <p>Built with JSCAD, Vite, TypeScript, and TailwindCSS</p>
        </footer>
      </div>
    `;
  }

  private initializeComponents(): void {
    const formContainer = document.getElementById('parameter-form')!;
    const viewerContainer = document.getElementById('model-viewer')!;

    this.parameterForm = new ParameterForm(
      formContainer,
      this.parameters,
      (params) => this.onParametersChange(params)
    );

    this.modelViewer = new ModelViewer(viewerContainer);

    // Initial model generation
    this.modelViewer.updateModel(this.parameters);
  }

  private onParametersChange(params: BoxParameters): void {
    this.parameters = { ...params };
    this.modelViewer.updateModel(this.parameters);
  }

  public updateParameters(params: Partial<BoxParameters>): void {
    this.parameters = { ...this.parameters, ...params };
    this.parameterForm.updateParameters(this.parameters);
    this.modelViewer.updateModel(this.parameters);
  }
}

// Initialize the application
new App();
