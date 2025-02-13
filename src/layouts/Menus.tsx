import { ReactNode } from 'react';
import { MenuLateral } from '../components/MenuLateral';

interface MenusProps {
  children: ReactNode;
}

export function Menus({ children }: MenusProps) {
  return (
    <div className="flex">
      {/* Menu Lateral */}
      <MenuLateral />

      {/* Conteúdo Principal */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 