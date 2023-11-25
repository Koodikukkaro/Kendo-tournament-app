export interface TextFieldConfig<T> {
  label: string;
  name: keyof T;
  type: React.HTMLInputTypeAttribute;
  required: boolean;
  validate?: (formData: T) => boolean;
  helperText?: string;
}

export interface ControlFieldConfig<T> {
  label: string;
  name: keyof T;
  required: boolean;
}
