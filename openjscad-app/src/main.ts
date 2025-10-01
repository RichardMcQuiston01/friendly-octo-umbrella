import './style.css'
import { ParameterForm } from './components/ParameterForm'
import { ModelViewer } from './components/ModelViewer'
import type { BoxParameters } from './types'

class App {
  private parameters: BoxParameters = {
    wallThickness: 1,
    layerHeight: 0.2,
    nozzleSize: 0.4,
    boxWidth: 25.4,
    boxDepth: 25.4,
    boxHeight: 25.4
  };

  private parameterForm!: ParameterForm;
  private modelViewer!: ModelViewer;

  constructor() {
    this.setupLayout();
    this.initializeComponents();
  }

  private setupLayout(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    app.className = 'min-h-screen bg-gray-100';

    app.innerHTML = `
      <div class="container mx-auto px-6 py-8 max-w-6xl">
        <header class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">JSCAD 3D Box Generator</h1>
          <p class="text-gray-600">Create custom hollow boxes suitable for 3D printing</p>
        </header>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b">
                <th class="px-6 py-4 text-left text-lg font-semibold text-gray-800 w-1/2">
                  3D Box Parameters
                </th>
                <th class="px-6 py-4 text-left text-lg font-semibold text-gray-800 w-1/2">
                  3D Model Preview
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-6 py-6 align-top border-r border-gray-200">
                  <div id="parameter-form"></div>
                </td>
                <td class="px-6 py-6 align-top">
                  <div id="model-viewer"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="text-center mt-8 text-gray-500 text-sm">
          <p>Built with
            <a href="https://github.com/jscad/OpenJSCAD.org" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">JSCAD</a>,
            <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">Vite</a>,
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">TypeScript</a>, and
            <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">TailwindCSS</a>
          </p>
          <p class="mt-2">Created using ClaudeAI by RichardMcQ01</p>
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
