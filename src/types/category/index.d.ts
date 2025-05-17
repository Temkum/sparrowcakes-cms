interface DynamicCategories {
  name: string;
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
  isRequired?: boolean;
}
