import { useRef } from 'react';

interface ImageUploadProps {
  imageUrl: string | null;
  isLoading: boolean;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
}

export function ImageUpload({ imageUrl, isLoading, onImageSelect, onImageRemove }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    if (event.target) event.target.value = '';
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        className="hidden"
      />
      
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Preview"
            className="w-48 h-48 rounded-lg object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onImageRemove}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div 
          className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
          onClick={handleClick}
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 