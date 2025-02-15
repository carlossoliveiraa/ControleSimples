import { useNavigate } from 'react-router-dom';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  backTo: string;
}

export function FormHeader({ title, subtitle, backTo }: FormHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
      <button
        onClick={() => navigate(backTo)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Voltar"
      >
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
} 