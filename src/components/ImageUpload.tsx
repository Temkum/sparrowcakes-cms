import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Create URLs for preview
      const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
      onChange([...value, ...urls]);
    },
    [value, onChange]
  );

  const removeImage = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event propagation
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple: true,
    maxFiles: 4,
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-orange-500"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div>
          <p>
            Drag & Drop your files or{' '}
            <span className="text-orange-500">Browse</span>
          </p>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {value.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url || '/placeholder.svg'}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={(event) => removeImage(index, event)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
