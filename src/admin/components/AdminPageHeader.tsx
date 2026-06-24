import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {action && (
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {action}
        </div>
      )}
    </div>
  );
}
