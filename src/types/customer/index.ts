export interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  city: string | null;
  occupation?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  customer?: Customer | null;
}
