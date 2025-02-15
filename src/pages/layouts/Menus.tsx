import { ReactNode } from 'react';
import { MenuLateral } from '../../components/MenuLateral';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

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

export function Menus() {
  return (
    <nav className="p-4 space-y-2">
      <div className="text-xs font-semibold text-gray-400 uppercase mb-4">MENU</div>

      <NavLink to="/dashboard" end className={({ isActive }) => `
        flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
        ${isActive ? 'text-[#4A90E2] bg-blue-50 hover:bg-blue-50' : ''}
      `}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Visão Geral
      </NavLink>

      <NavLink to="/categorias" className={({ isActive }) => `
        flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
        ${isActive ? 'text-[#4A90E2] bg-blue-50 hover:bg-blue-50' : ''}
      `}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Categorias de Produtos
      </NavLink>

      <NavLink to="/produtos" className={({ isActive }) => `
        flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
        ${isActive ? 'text-[#4A90E2] bg-blue-50 hover:bg-blue-50' : ''}
      `}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Produtos
      </NavLink>

      <NavLink to="/clientes" className={({ isActive }) => `
        flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
        ${isActive ? 'text-[#4A90E2] bg-blue-50 hover:bg-blue-50' : ''}
      `}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Clientes
      </NavLink>

      <NavLink to="/fornecedores" className={({ isActive }) => `
        flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
        ${isActive ? 'text-[#4A90E2] bg-blue-50 hover:bg-blue-50' : ''}
      `}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Fornecedores
      </NavLink>

      <div className="text-xs font-semibold text-gray-400 uppercase mt-8 mb-4">GERAL</div>

      <NavLink to="/configuracoes" className={({ isActive }) => `
        flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
        ${isActive ? 'text-[#4A90E2] bg-blue-50 hover:bg-blue-50' : ''}
      `}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Configurações
      </NavLink>
    </nav>
  );
} 