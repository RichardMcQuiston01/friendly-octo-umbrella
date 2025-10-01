import type { BoxParameters, FormFieldProps } from '../types';

export class ParameterForm {
  private container: HTMLElement;
  private parameters: BoxParameters;
  private onChange: (params: BoxParameters) => void;

  constructor(container: HTMLElement, initialParams: BoxParameters, onChange: (params: BoxParameters) => void) {
    this.container = container;
    this.parameters = { ...initialParams };
    this.onChange = onChange;
    this.render();
  }

  private createFormField(config: Omit<FormFieldProps, 'onChange'> & { key: keyof BoxParameters }): HTMLElement {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'mb-4';

    const label = document.createElement('label');
    label.className = 'block text-sm font-medium text-gray-700 mb-2';
    label.textContent = config.label;

    const inputContainer = document.createElement('div');
    inputContainer.className = 'relative';

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    input.value = config.value.toString();
    input.min = config.min?.toString() || '0.1';
    input.max = config.max?.toString() || '1000';
    input.step = config.step?.toString() || '0.1';

    if (config.unit) {
      const unit = document.createElement('span');
      unit.className = 'absolute right-3 top-2 text-gray-500 text-sm';
      unit.textContent = config.unit;
      inputContainer.appendChild(unit);
      input.style.paddingRight = '2.5rem';
    }

    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseFloat(target.value) || 0;
      this.parameters[config.key] = value;
      this.onChange(this.parameters);
    });

    inputContainer.appendChild(input);
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(inputContainer);

    return fieldDiv;
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'bg-white p-6 rounded-lg shadow-lg h-fit';

    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-gray-800 mb-6';
    title.textContent = '3D Box Parameters';

    const form = document.createElement('form');
    form.className = 'space-y-4';

    const fields = [
      {
        key: 'wallThickness' as keyof BoxParameters,
        label: 'Wall Thickness',
        value: this.parameters.wallThickness,
        min: 0.1,
        max: 10,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'layerHeight' as keyof BoxParameters,
        label: 'Layer Height',
        value: this.parameters.layerHeight,
        min: 0.1,
        max: 1,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'boxWidth' as keyof BoxParameters,
        label: 'Box Width',
        value: this.parameters.boxWidth,
        min: 1,
        max: 500,
        step: 1,
        unit: 'mm'
      },
      {
        key: 'boxDepth' as keyof BoxParameters,
        label: 'Box Depth',
        value: this.parameters.boxDepth,
        min: 1,
        max: 500,
        step: 1,
        unit: 'mm'
      },
      {
        key: 'boxHeight' as keyof BoxParameters,
        label: 'Box Height',
        value: this.parameters.boxHeight,
        min: 1,
        max: 500,
        step: 1,
        unit: 'mm'
      }
    ];

    fields.forEach(field => {
      form.appendChild(this.createFormField(field));
    });

    this.container.appendChild(title);
    this.container.appendChild(form);
  }

  public updateParameters(params: BoxParameters): void {
    this.parameters = { ...params };
    this.render();
  }
}