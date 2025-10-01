export interface BoxParameters {
  wallThickness: number;
  layerHeight: number;
  nozzleSize: number;
  boxWidth: number;
  boxDepth: number;
  boxHeight: number;
}

export interface FormFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}