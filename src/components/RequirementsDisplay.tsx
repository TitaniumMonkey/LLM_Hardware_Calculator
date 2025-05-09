import React from 'react';
import { Requirements } from '../types/model';
import { HardDrive, MemoryStick, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatSize } from '../utils/formatUtils';
import GpuCompatibilityList from './GpuCompatibilityList';

interface RequirementsDisplayProps {
  requirementsData: Requirements | null;
}

const getModelSizeCategory = (vram: number): string => {
  if (vram <= 12) return 'Small Models';
  if (vram <= 24) return 'Mid-Sized Models';
  if (vram <= 80) return 'Large Models';
  if (vram <= 200) return 'Very Large Models';
  if (vram <= 400) return 'Massive Models';
  return 'The Largest Models';
};

const RequirementsDisplay: React.FC<RequirementsDisplayProps> = ({ requirementsData }) => {
  if (!requirementsData) return null;

  // Get the model size category based on VRAM
  const modelSizeCategory = getModelSizeCategory(requirementsData.vramRequired);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-blue-900/10 transition-all">
        <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
          <MemoryStick className="mr-2 h-5 w-5 text-blue-500" />
          Hardware Requirements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VRAM Requirements */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center mb-2">
              <MemoryStick className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-slate-200">VRAM Required</h3>
            </div>
            
            <div className="flex items-end mb-3">
              <span className="text-3xl font-bold text-white mr-2">{formatSize(requirementsData.vramRequired)}</span>
              <span className="text-slate-400 text-sm">minimum</span>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (requirementsData.vramRequired / 1000) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>0 GB</span>
                <span>1 TB</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center text-blue-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{modelSizeCategory}</span>
              </div>
            </div>
          </div>
          
          {/* Storage Requirements */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center mb-2">
              <HardDrive className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-slate-200">Storage Required</h3>
            </div>
            
            <div className="flex items-end mb-3">
              <span className="text-3xl font-bold text-white mr-2">{formatSize(requirementsData.storageRequired)}</span>
              <span className="text-slate-400 text-sm">minimum</span>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (requirementsData.storageRequired / 1000) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>0 GB</span>
                <span>1 TB</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center text-blue-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{modelSizeCategory}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <GpuCompatibilityList vramRequired={requirementsData.vramRequired} />
    </div>
  );
};

export default RequirementsDisplay;