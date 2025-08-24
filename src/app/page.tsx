'use client'

import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Calendar, Clock, CheckCircle, ChevronRight, Circle, FileText, 
  Flag, GraduationCap, Search, AlertCircle, PlusCircle, User, Bell
} from 'lucide-react';

import { fetcher } from '@/lib/api';
import { Application, University, Deadline } from '@/types';
import DashboardCard from '@/components/DashboardCard';
import ApplicationList from '@/components/ApplicationList';
import DeadlineCalendar from '@/components/DeadlineCalendar';
import UniversitySearch from '@/components/UniversitySearch';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import NewApplicationForm from '@/components/NewApplicationForm';
import { mockStudentDashboardData } from '@/mocks/studentDashboardData';

const StudentDashboard: React.FC = () => {
  const [showAddApplication, setShowAddApplication] = useState(false);
  const dashboardData = mockStudentDashboardData;
  /* const { data: dashboardData, error } = useSWR('/api/student/dashboard', fetcher);
  
  if (error) return <div className="p-8 text-center text-red-500">Failed to load dashboard</div>;
  if (!dashboardData) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ); */
  
  const { 
    applications, 
    stats, 
    upcomingDeadlines,
    statusDistribution
  } = dashboardData;
  
  const statusColors = {
    'not_started': '#e5e7eb',
    'in_progress': '#3b82f6',
    'submitted': '#f59e0b',
    'under_review': '#8b5cf6',
    'decided': '#10b981'
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">CollegeTrack</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </div> */}
            
            <div className="flex items-center space-x-2">
              <img 
                src={dashboardData.student.profile_image_url || '/default-avatar.png'} 
                alt="Profile" 
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
              <span className="text-sm font-medium text-gray-700">
                {dashboardData.student.first_name}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {dashboardData.student.first_name}!
          </h2>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Total Applications" value={stats.total} icon={<FileText className="h-5 w-5 text-blue-500" />} />
          <DashboardCard title="Submitted" value={stats.submitted} icon={<CheckCircle className="h-5 w-5 text-green-500" />} />
          <DashboardCard title="In Progress" value={stats.inProgress} icon={<Clock className="h-5 w-5 text-amber-500" />} />
          <DashboardCard title="Upcoming Deadlines" value={stats.upcomingDeadlines} icon={<AlertCircle className="h-5 w-5 text-red-500" />} />
        </div>
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto justify-start sm:justify-end">
            <Button 
              variant="primary" 
              onClick={() => setShowAddApplication(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Application
            </Button>
            
            <Button variant="secondary">
              View All
            </Button>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications & Status Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Status Chart */}
            <DashboardCard title="Application Status" className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry:any, index:number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={statusColors[entry.name as keyof typeof statusColors]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} applications`, 'Count']}
                      labelFormatter={(label) => `Status: ${label.replace('_', ' ')}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {statusDistribution.map((status:any, index:number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: statusColors[status.name as keyof typeof statusColors] }}
                    ></div>
                    <span className="text-sm capitalize text-gray-600">
                      {status.name.replace('_', ' ')} ({status.value})
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            {/* Recent Applications */}
            <DashboardCard title="Your Applications">
              <ApplicationList applications={applications} />
            </DashboardCard>
          </div>
          
          {/* Sidebar with Deadlines and Quick Actions */}
          <div className="space-y-8">
            {/* Upcoming Deadlines */}
            <DashboardCard title="Upcoming Deadlines" className="p-5">
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline:any, index:number) => (
                  <div key={index} className="flex gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">{deadline.universityName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {deadline.type} - {new Date(deadline.date).toLocaleDateString()}
                      </p>
                      <StatusBadge status={deadline.status} className="mt-1" />
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2">
                  View All Deadlines
                </Button>
              </div>
            </DashboardCard>
            
            {/* Quick Actions */}
            <DashboardCard title="Quick Actions" className="p-5">
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start" onClick={() => {}}>
                  <Search className="h-4 w-4 mr-2" />
                  Find Universities
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => {}}>
                  <Flag className="h-4 w-4 mr-2" />
                  Compare Universities
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => {}}>
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Requirements
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => {}}>
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
      
      {/* Add Application Modal */}
      <Modal 
        isOpen={showAddApplication} 
        onClose={() => setShowAddApplication(false)}
        title="Add New Application"
      >
        <NewApplicationForm onSuccess={() => setShowAddApplication(false)} />
      </Modal>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} CollegeTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;
