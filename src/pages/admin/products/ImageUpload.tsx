import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value: (File | string)[];
  onChange: (value: (File | string)[]) => void;
  maxFiles?: number;
  isEditMode?: boolean;
  disabled?: boolean;
}

const validImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
  'image/tiff',
  'image/jpg',
] as const;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxFiles = 10,
  isEditMode = false,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; isFile: boolean }[]>(
    []
  );

  // Update previews when value changes
  useEffect(() => {
    const newPreviews = value.map((item) => ({
      url: isFile(item) ? URL.createObjectURL(item) : item,
      isFile: isFile(item),
    }));
    setPreviews(newPreviews);

    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach((preview) => {
        if (preview.isFile) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [value]);

  const isFile = (item: File | string): item is File => {
    return item instanceof File;
  };

  const isValidImageType = (file: File): boolean => {
    return validImageTypes.includes(
      file.type as (typeof validImageTypes)[number]
    );
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      const validFiles = acceptedFiles.filter(isValidImageType);

      if (validFiles.length !== acceptedFiles.length) {
        alert(
          'Some files were rejected. Please upload only valid image formats.'
        );
        return;
      }

      if (validFiles.length === 0) return;

      if (value.length + validFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} images.`);
        return;
      }

      setIsUploading(true);
      try {
        onChange([...value, ...validFiles]);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload images. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, maxFiles, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.webp',
        '.bmp',
        '.svg',
        '.tiff',
      ],
    },
    disabled: isUploading || disabled,
    maxFiles: maxFiles - value.length,
  });

  const removeImage = (index: number) => {
    if (disabled) return;
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload
          className={`w-10 h-10 mb-2 ${
            disabled ? 'text-gray-400' : 'text-gray-600'
          }`}
        />
        <p
          className={`text-sm text-center ${
            disabled ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {isDragActive
            ? 'Drop the images here...'
            : 'Drag & drop images here, or click to select files'}
        </p>
        <p
          className={`text-xs mt-1 ${
            disabled ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          PNG, JPG, GIF, WEBP, BMP, SVG, TIFF up to 10MB (Max {maxFiles} images)
        </p>
        {isUploading && (
          <p className="text-sm text-orange-500 mt-2">Uploading...</p>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((image, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={previews[index]?.url || ''}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover rounded-t-md"
                />
                {!disabled && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="p-2 text-xs text-gray-500 truncate bg-gray-50 rounded-b-md">
                {isFile(image) ? image.name : 'Uploaded image'}
                {disabled && (
                  <span className="block text-xs text-gray-400 mt-1">
                    Read-only
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="text-xs text-gray-500">
          {value.length} of {maxFiles} images uploaded
        </div>
      )}
    </div>
  );
};
