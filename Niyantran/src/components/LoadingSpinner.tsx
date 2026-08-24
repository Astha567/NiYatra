import React from 'react';
import { Loader2, Train } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading Pulse Corridor Data...' }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center my-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-[#132A1E] text-[#F0C954] flex items-center justify-center shadow-lg">
          <Train className="w-6 h-6 animate-pulse" />
        </div>
        <Loader2 className="w-6 h-6 text-[#F0C954] animate-spin absolute -bottom-1 -right-1" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold font-mono text-[#16311F] dark:text-[#FDF6E7]">
          {message}
        </h4>
        <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] font-mono">
          NiYatra Pulse Decision-Support System
        </p>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ title?: string; message?: string }> = ({
  title = 'No Data Found',
  message = 'No records match current filter criteria.'
}) => {
  return (
    <div className="panel-card p-10 rounded-2xl text-center space-y-3 my-6">
      <div className="w-10 h-10 rounded-full bg-[#132A1E]/10 text-[#132A1E] dark:text-[#F0C954] flex items-center justify-center mx-auto">
        <Train className="w-5 h-5" />
      </div>
      <h4 className="text-base font-bold font-heading text-[#16311F] dark:text-[#FDF6E7]">
        {title}
      </h4>
      <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] font-sans max-w-md mx-auto">
        {message}
      </p>
    </div>
  );
};
