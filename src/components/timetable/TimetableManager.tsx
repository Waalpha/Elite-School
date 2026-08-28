import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { Clock, Calendar, BookOpen, User, Plus } from "lucide-react";

export const TimetableManager: React.FC = () => {
  const { currentTenant } = useTenant();
  const [selectedClass, setSelectedClass] = useState("Grade 4 East");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    { time: "08:00 - 08:45 AM", label: "Period 1" },
    { time: "08:45 - 09:30 AM", label: "Period 2" },
    { time: "09:30 - 10:15 AM", label: "Period 3" },
    { time: "10:15 - 10:45 AM", label: "Short Break", isBreak: true },
    { time: "10:45 - 11:30 AM", label: "Period 4" },
    { time: "11:30 - 12:15 PM", label: "Period 5" },
    { time: "12:15 - 01:00 PM", label: "Period 6" },
    { time: "01:00 - 02:00 PM", label: "Lunch & Co-Curricular", isBreak: true },
    { time: "02:00 - 02:45 PM", label: "Period 7" },
    { time: "02:45 - 03:30 PM", label: "Period 8" },
  ];

  const scheduleData: Record<string, Record<string, { subject: string; teacher: string; room: string }>> = {
    Monday: {
      "Period 1": { subject: "Mathematics Activities", teacher: "Teacher Grace", room: "Rm 4A" },
      "Period 2": { subject: "English Language", teacher: "Teacher Sarah", room: "Rm 4A" },
      "Period 3": { subject: "Kiswahili Lugha", teacher: "Mwalimu Omari", room: "Rm 4A" },
      "Period 4": { subject: "Science & Tech", teacher: "Teacher David", room: "Science Lab" },
      "Period 5": { subject: "Creative Arts & Craft", teacher: "Teacher Brian", room: "Art Studio" },
      "Period 6": { subject: "Social Studies & CRE", teacher: "Teacher Faith", room: "Rm 4A" },
      "Period 7": { subject: "Physical Education", teacher: "Coach Ken", room: "Sports Ground" },
      "Period 8": { subject: "Library & Reading", teacher: "Teacher Grace", room: "Library" },
    },
    Tuesday: {
      "Period 1": { subject: "English Language", teacher: "Teacher Sarah", room: "Rm 4A" },
      "Period 2": { subject: "Mathematics Activities", teacher: "Teacher Grace", room: "Rm 4A" },
      "Period 3": { subject: "Agriculture & Nutrition", teacher: "Teacher David", room: "Bio Garden" },
      "Period 4": { subject: "Music & Movement", teacher: "Teacher Faith", room: "Music Rm" },
      "Period 5": { subject: "Kiswahili Kusoma", teacher: "Mwalimu Omari", room: "Rm 4A" },
      "Period 6": { subject: "Indigenous Languages", teacher: "Teacher Grace", room: "Rm 4A" },
      "Period 7": { subject: "Mathematics Revision", teacher: "Teacher Grace", room: "Rm 4A" },
      "Period 8": { subject: "Clubs & Societies", teacher: "All Teachers", room: "Main Hall" },
    },
    Wednesday: {
      "Period 1": { subject: "Science & Tech Lab", teacher: "Teacher David", room: "Science Lab" },
      "Period 2": { subject: "Mathematics Activities", teacher: "Teacher Grace", room: "Rm 4A" },
      "Period 3": { subject: "Social Studies", teacher: "Teacher Faith", room: "Rm 4A" },
      "Period 4": { subject: "English Grammar", teacher: "Teacher Sarah", room: "Rm 4A" },
      "Period 5": { subject: "Pastoral Program (PPI)", teacher: "Chaplain", room: "Auditorium" },
      "Period 6": { subject: "Creative Arts", teacher: "Teacher Brian", room: "Art Studio" },
      "Period 7": { subject: "French / Foreign Language", teacher: "Mme Claire", room: "Rm 4A" },
      "Period 8": { subject: "Games & Swimming", teacher: "Coach Ken", room: "Pool / Field" },
    },
    Thursday: {
      "Period 1": { subject: "Mathematics Activities", teacher: "Teacher Grace", room: "Rm 4A" },
      "Period 2": { subject: "English Writing", teacher: "Teacher Sarah", room: "Rm 4A" },
      "Period 3": { subject: "Computer Science & ICT", teacher: "Teacher Dave", room: "Computer Lab" },
      "Period 4": { subject: "Computer Science & ICT", teacher: "Teacher Dave", room: "Computer Lab" },
      "Period 5": { subject: "Kiswahili Insha", teacher: "Mwalimu Omari", room: "Rm 4A" },
      "Period 6": { subject: "Social Studies & CRE", teacher: "Teacher Faith", room: "Rm 4A" },
      "Period 7": { subject: "Science Experiments", teacher: "Teacher David", room: "Science Lab" },
      "Period 8": { subject: "Class Mentorship", teacher: "Teacher Grace", room: "Rm 4A" },
    },
    Friday: {
      "Period 1": { subject: "Morning Assembly & Briefing", teacher: "Principal", room: "Parade Ground" },
      "Period 2": { subject: "Mathematics Activities", teacher: "Teacher Grace", room: "Rm 4A" },
      "Period 3": { subject: "English Comprehension", teacher: "Teacher Sarah", room: "Rm 4A" },
      "Period 4": { subject: "Science & Hygiene", teacher: "Teacher David", room: "Rm 4A" },
      "Period 5": { subject: "Kiswahili Sarufi", teacher: "Mwalimu Omari", room: "Rm 4A" },
      "Period 6": { subject: "Debate & Public Speaking", teacher: "Teacher Sarah", room: "Rm 4A" },
      "Period 7": { subject: "Inter-House Athletics", teacher: "Coach Ken", room: "Sports Field" },
      "Period 8": { subject: "Weekly Wrap & Sanitization", teacher: "Class Teacher", room: "Rm 4A" },
    },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Class Timetables & Schedules</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly academic schedule, room allocations, and educator period assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          >
            <option value="PP1 East">PP1 East</option>
            <option value="PP2 Blue">PP2 Blue</option>
            <option value="Grade 1 Alpha">Grade 1 Alpha</option>
            <option value="Grade 4 East">Grade 4 East</option>
            <option value="Grade 7 Junior">Grade 7 Junior Secondary</option>
            <option value="Diploma ICT Yr 1">Diploma ICT - Year 1</option>
          </select>
        </div>
      </div>

      {/* Timetable Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-28 border-r border-slate-200">Time Slot</th>
                {days.map((d) => (
                  <th key={d} className="py-3 px-3 border-r border-slate-200 last:border-r-0">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map((p, idx) => {
                if (p.isBreak) {
                  return (
                    <tr key={idx} className="bg-slate-100/70 text-slate-500 font-bold">
                      <td className="py-2.5 px-3 font-mono text-[10px] border-r border-slate-200">
                        {p.time}
                      </td>
                      <td colSpan={5} className="py-2.5 px-3 text-center uppercase tracking-widest text-[11px] text-slate-600">
                        ☕ {p.label}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/50">
                      <div>{p.time}</div>
                      <div className="text-[9px] text-slate-400 font-sans uppercase font-bold">{p.label}</div>
                    </td>
                    {days.map((day) => {
                      const slot = scheduleData[day]?.[p.label];
                      return (
                        <td key={day} className="py-2.5 px-3 border-r border-slate-100 last:border-r-0 align-top">
                          {slot ? (
                            <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 space-y-1">
                              <div className="font-bold text-indigo-950 text-xs leading-tight">
                                {slot.subject}
                              </div>
                              <div className="text-[10px] text-slate-600 flex items-center justify-between">
                                <span>{slot.teacher}</span>
                                <span className="font-mono text-slate-400">{slot.room}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-slate-300 text-[10px] italic py-1">Study Period</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
