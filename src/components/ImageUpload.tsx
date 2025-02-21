'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Here you would typically upload the files to your server
      // For now, we'll just create URLs for preview
      const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
      onChange([...value, ...urls]);
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
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
            <img
              key={index}
              src={url || '/placeholder.svg'}
              alt={`Upload ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}
