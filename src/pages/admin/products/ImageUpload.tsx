import { useCallback } from 'react';
import Dropzone from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Your utility function for class merging

interface ImageUploadProps {
  value: (File | string)[];
  onChange: (value: (File | string)[]) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange([...value, ...acceptedFiles]);
    },
    [value, onChange]
  );

  const removeImage = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        disabled={disabled}
        accept={{
          'image/*': [
            '.jpeg',
            '.jpg',
            '.png',
            '.gif',
            '.webp',
            '.svg',
            '.bmp',
            '.tiff',
          ],
        }}
        maxSize={5 * 1024 * 1024} // 5MB
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2">
              <UploadCloud className="w-8 h-8 text-gray-500" />
              {isDragActive ? (
                <p className="font-medium text-orange-500">
                  Drop the images here
                </p>
              ) : (
                <>
                  <p className="font-medium">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG, GIF, WEBP, BMP, SVG, TIFF (Max 5MB each)
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </Dropzone>

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {value.map((item, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-md border border-gray-200">
                {typeof item === 'string' ? (
                  <img
                    src={item}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(item)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {typeof item !== 'string' && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default ImageUpload;
