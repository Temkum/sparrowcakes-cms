import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestError() {
  const [shouldError, setShouldError] = useState(false);

  // This will throw an error when the button is clicked
  if (shouldError) {
    throw new Error('This is a test error thrown by the TestError component');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Error Boundary Test</h1>
      <p className="mb-6 text-gray-600">
        Click the button below to test the error boundary
      </p>
      <Button 
        onClick={() => setShouldError(true)}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Throw Error
      </Button>
    </div>
  );
}
