import React from 'react';
import { CalendarDays, Users } from 'lucide-react';

export default function Footer() {
  const teamMembers = [
    { name: 'J. Suresh', id: '24A81A0578' },
    { name: 'N. Pavan', id: '25A81A43H7' },
    { name: 'P. Nirish', id: '25A81A61H1' },
    { name: 'SK. Naseem', id: 'IT-253' },
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-10 py-5 text-slate-600 text-xs overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">

          {/* Project Name */}
          <div className="flex items-center gap-2 shrink-0">

            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <CalendarDays className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <span className="font-bold text-slate-800 text-sm">
                Campus Resource Booking System
              </span>

              <span className="ml-2 text-[10px] text-slate-400">
                MERN Stack
              </span>
            </div>

          </div>


          {/* Team Members */}
          <div className="flex items-center gap-1.5 flex-wrap justify-start lg:justify-end min-w-0">

            <span className="font-semibold text-slate-700 flex items-center gap-1 mr-1 whitespace-nowrap">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Team O6:
            </span>

            {teamMembers.map((m) => (
              <span
                key={m.id}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] text-slate-700 whitespace-nowrap"
              >
                <strong>{m.name}</strong>{' '}
                <span className="font-mono text-slate-400">
                  ({m.id})
                </span>
              </span>
            ))}

          </div>

        </div>


        {/* Bottom Section */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[10px]">

          <div className="text-center sm:text-left">
            Campus Facility Management & Resource Booking Portal
          </div>

          <div className="text-center sm:text-right">
            React.js • Express.js • MongoDB Atlas • Node.js
          </div>

        </div>

      </div>

    </footer>
  );
}