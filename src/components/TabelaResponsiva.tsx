interface TabelaResponsivaProps {
  children: React.ReactNode;
  className?: string;
}

export function TabelaResponsiva({ children, className = '' }: TabelaResponsivaProps) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={`min-w-full divide-y divide-gray-300 dark:divide-gray-700 ${className}`}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
} 