import type { BoxParameters, FormFieldProps } from '../types';

export class ParameterForm {
  private container: HTMLElement;
  private parameters: BoxParameters;
  private onChange: (params: BoxParameters) => void;
  private fieldFilter?: (keyof BoxParameters)[];

  constructor(container: HTMLElement, initialParams: BoxParameters, onChange: (params: BoxParameters) => void, fieldFilter?: (keyof BoxParameters)[]) {
    this.container = container;
    this.parameters = { ...initialParams };
    this.onChange = onChange;
    this.fieldFilter = fieldFilter;
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
    input.setAttribute('data-key', config.key);
    input.title = config.label;

    // Add autofocus to Wall Thickness input
    if (config.key === 'wallThickness') {
      input.autofocus = true;
    }

    const updateModel = () => {
      const value = parseFloat(input.value) || 0;
      this.parameters[config.key] = value;
      this.onChange(this.parameters);

      // Update Edge Fillet constraints when Nozzle Size or Wall Thickness change
      if (config.key === 'nozzleSize' || config.key === 'wallThickness') {
        this.updateEdgeFilletConstraints();
      }

      // Update Box dimension constraints when Build Volume changes
      if (config.key === 'buildVolumeWidth' || config.key === 'buildVolumeDepth' || config.key === 'buildVolumeHeight') {
        this.updateBoxDimensionConstraints();
      }
    };

    input.addEventListener('blur', updateModel);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Tab') {
        updateModel();
      }
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

    const allFields = [
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
        key: 'buildVolumeWidth' as keyof BoxParameters,
        label: 'Build Volume Width',
        value: this.parameters.buildVolumeWidth,
        min: 25,
        max: 350,
        step: 1,
        unit: 'mm'
      },
      {
        key: 'buildVolumeDepth' as keyof BoxParameters,
        label: 'Build Volume Depth',
        value: this.parameters.buildVolumeDepth,
        min: 25,
        max: 350,
        step: 1,
        unit: 'mm'
      },
      {
        key: 'buildVolumeHeight' as keyof BoxParameters,
        label: 'Build Volume Height',
        value: this.parameters.buildVolumeHeight,
        min: 25,
        max: 350,
        step: 1,
        unit: 'mm'
      },
      {
        key: 'boxWidth' as keyof BoxParameters,
        label: 'Box Width',
        value: this.parameters.boxWidth,
        min: 8.35,
        max: this.parameters.buildVolumeWidth,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'boxDepth' as keyof BoxParameters,
        label: 'Box Depth',
        value: this.parameters.boxDepth,
        min: 8.35,
        max: this.parameters.buildVolumeDepth,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'boxHeight' as keyof BoxParameters,
        label: 'Box Height',
        value: this.parameters.boxHeight,
        min: 8.35,
        max: this.parameters.buildVolumeHeight,
        step: 0.1,
        unit: 'mm'
      },
      {
        key: 'edgeFillet' as keyof BoxParameters,
        label: 'Edge Fillet',
        value: this.parameters.edgeFillet,
        min: this.parameters.nozzleSize,
        max: this.parameters.wallThickness,
        step: 0.1,
        unit: 'mm'
      }
    ];

    // Filter fields based on fieldFilter if provided
    const fields = this.fieldFilter
      ? allFields.filter(field => this.fieldFilter!.includes(field.key))
      : allFields;

    fields.forEach(field => {
      form.appendChild(this.createFormField(field));
    });

    this.container.appendChild(form);
  }

  private updateEdgeFilletConstraints(): void {
    const edgeFilletInput = this.container.querySelector('input[data-key="edgeFillet"]') as HTMLInputElement;
    if (edgeFilletInput) {
      edgeFilletInput.min = this.parameters.nozzleSize.toString();
      edgeFilletInput.max = this.parameters.wallThickness.toString();

      // Adjust the value if it's outside the new constraints
      const currentValue = parseFloat(edgeFilletInput.value) || 0;
      if (currentValue < this.parameters.nozzleSize) {
        edgeFilletInput.value = this.parameters.nozzleSize.toString();
        this.parameters.edgeFillet = this.parameters.nozzleSize;
        this.onChange(this.parameters);
      } else if (currentValue > this.parameters.wallThickness) {
        edgeFilletInput.value = this.parameters.wallThickness.toString();
        this.parameters.edgeFillet = this.parameters.wallThickness;
        this.onChange(this.parameters);
      }
    }
  }

  private updateBoxDimensionConstraints(): void {
    // Update Box Width max based on Build Volume Width
    const boxWidthInput = this.container.querySelector('input[data-key="boxWidth"]') as HTMLInputElement;
    if (boxWidthInput) {
      boxWidthInput.max = this.parameters.buildVolumeWidth.toString();
      const currentValue = parseFloat(boxWidthInput.value) || 0;
      if (currentValue > this.parameters.buildVolumeWidth) {
        boxWidthInput.value = this.parameters.buildVolumeWidth.toString();
        this.parameters.boxWidth = this.parameters.buildVolumeWidth;
        this.onChange(this.parameters);
      }
    }

    // Update Box Depth max based on Build Volume Depth
    const boxDepthInput = this.container.querySelector('input[data-key="boxDepth"]') as HTMLInputElement;
    if (boxDepthInput) {
      boxDepthInput.max = this.parameters.buildVolumeDepth.toString();
      const currentValue = parseFloat(boxDepthInput.value) || 0;
      if (currentValue > this.parameters.buildVolumeDepth) {
        boxDepthInput.value = this.parameters.buildVolumeDepth.toString();
        this.parameters.boxDepth = this.parameters.buildVolumeDepth;
        this.onChange(this.parameters);
      }
    }

    // Update Box Height max based on Build Volume Height
    const boxHeightInput = this.container.querySelector('input[data-key="boxHeight"]') as HTMLInputElement;
    if (boxHeightInput) {
      boxHeightInput.max = this.parameters.buildVolumeHeight.toString();
      const currentValue = parseFloat(boxHeightInput.value) || 0;
      if (currentValue > this.parameters.buildVolumeHeight) {
        boxHeightInput.value = this.parameters.buildVolumeHeight.toString();
        this.parameters.boxHeight = this.parameters.buildVolumeHeight;
        this.onChange(this.parameters);
      }
    }
  }

  public updateParameters(params: BoxParameters): void {
    this.parameters = { ...params };
    this.render();
  }
}