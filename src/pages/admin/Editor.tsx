import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Image,
  Undo,
  Redo,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Textarea } from '@/components/ui/textarea';

interface EditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-1 p-1 border-b">
        <Toggle aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle strikethrough">
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle link">
          <Link className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle aria-label="Toggle bullet list">
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle numbered list">
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle image">
          <Image className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle aria-label="Undo">
          <Undo className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Redo">
          <Redo className="h-4 w-4" />
        </Toggle>
      </div>
      {/* <textarea
        className="w-full min-h-[200px] p-2 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      /> */}
      <Textarea
        className="w-full min-h-[200px] p-2 focus:outline-none"
        placeholder="Type your message here."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
