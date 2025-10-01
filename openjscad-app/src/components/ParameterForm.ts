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
    fieldDiv.className = 'mb-4 form-field';

    const label = document.createElement('label');
    label.className = 'block text-sm font-medium text-gray-700 mb-2';
    label.textContent = config.label;

    const inputContainer = document.createElement('div');
    inputContainer.className = 'flex items-center gap-2';

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    input.value = config.value.toString();
    input.min = config.min?.toString() || '0.1';
    input.max = config.max?.toString() || '1000';
    input.step = config.step?.toString() || '0.1';

    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseFloat(target.value) || 0;
      this.parameters[config.key] = value;
      this.onChange(this.parameters);
    });

    inputContainer.appendChild(input);

    if (config.unit) {
      const unit = document.createElement('span');
      unit.className = 'text-gray-500 text-sm font-medium';
      unit.textContent = config.unit;
      unit.style.fontSize = '14px';
      unit.style.color = '#6b7280';
      unit.style.minWidth = '20px';
      inputContainer.appendChild(unit);
    }

    fieldDiv.appendChild(label);
    fieldDiv.appendChild(inputContainer);

    return fieldDiv;
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'h-fit';

    const form = document.createElement('form');
    form.className = 'space-y-4';

    const fields = [
      {
        key: 'nozzleSize' as keyof BoxParameters,
        label: 'Nozzle Size',
        value: this.parameters.nozzleSize,
        min: 0.2,
        max: 1.0,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'wallThickness' as keyof BoxParameters,
        label: 'Wall Thickness',
        value: this.parameters.wallThickness,
        min: 0.5,
        max: 1.5,
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
        min: 8.35,
        max: 220,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'boxDepth' as keyof BoxParameters,
        label: 'Box Depth',
        value: this.parameters.boxDepth,
        min: 8.35,
        max: 220,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'boxHeight' as keyof BoxParameters,
        label: 'Box Height',
        value: this.parameters.boxHeight,
        min: 8.35,
        max: 220,
        step: 0.1,
        unit: 'mm'
      }
    ];

    fields.forEach(field => {
      form.appendChild(this.createFormField(field));
    });

    this.container.appendChild(form);
  }

  public updateParameters(params: BoxParameters): void {
    this.parameters = { ...params };
    this.render();
  }
}