import { ReactNode } from 'react';
import { MenuLateral } from '../../components/MenuLateral';
import { Outlet } from 'react-router-dom';

interface MenusProps {
  children?: ReactNode;
}

export function Menus({ children }: MenusProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MenuLateral />
      <div className="flex-1 w-0">
        {children || <Outlet />}
      </div>
    </div>
  );
} 