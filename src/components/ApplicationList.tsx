import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Edit, MoreHorizontal, 
  CheckCircle2, Clock, Circle, Eye, FileText, GraduationCap
} from 'lucide-react';
import { Application } from '@/types';
import StatusBadge from './StatusBadge';
import Button from './Button';
import Dropdown from './Dropdown';

interface ApplicationListProps {
  applications: Application[];
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  // 筛选申请
  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  // 申请状态选项
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'decided', label: 'Decided' }
  ];

  // 处理申请展开/折叠
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 申请操作菜单
  const getActionMenu = (application: Application) => [
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4 mr-2" />,
      onClick: () => console.log('View', application.id)
    },
    {
      label: 'Edit Application',
      icon: <Edit className="h-4 w-4 mr-2" />,
      onClick: () => console.log('Edit', application.id)
    },
    {
      label: 'Add Note',
      icon: <Edit className="h-4 w-4 mr-2" />,
      onClick: () => console.log('Add note', application.id)
    }
  ];

  return (
    <div className="border-t">
      {/* 筛选栏 */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Filter by:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-500">
          {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
        </span>
      </div>

      {/* 申请列表 */}
      {filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
          <p className="text-gray-500 max-w-md mb-4">
            You don't have any applications matching this filter. Try changing your filter or add a new application.
          </p>
          <Button variant="primary" onClick={() => {}}>
            Add New Application
          </Button>
        </div>
      ) : (
        filteredApplications.map(application => (
          <div key={application.id} className="border-b last:border-0">
            {/* 申请标题行 */}
            <div 
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {application.university.logoUrl ? (
                    <img src={application.university.logoUrl} alt={application.university.name} className="w-6 h-6" />
                  ) : (
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{application.university.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {application.applicationType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      Deadline: {new Date(application.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <StatusBadge status={application.status} />
                <Dropdown items={getActionMenu(application)}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </Dropdown>
                {expandedId === application.id ? (
                  <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => toggleExpand(application.id)} />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => toggleExpand(application.id)} />
                )}
              </div>
            </div>
            
            {/* 展开的详情 */}
            {expandedId === application.id && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 左侧：申请详情 */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Application Details</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <dt className="text-gray-500">Status</dt>
                        <dd className="col-span-2 font-medium capitalize">
                          {application.status.replace('_', ' ')}
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <dt className="text-gray-500">Submitted</dt>
                        <dd className="col-span-2">
                          {application.submittedDate 
                            ? new Date(application.submittedDate).toLocaleDateString()
                            : <span className="text-gray-400">Not submitted</span>
                          }
                        </dd>
                      </div>
                      {application.decisionDate && (
                        <div className="grid grid-cols-3 gap-2">
                          <dt className="text-gray-500">Decision Date</dt>
                          <dd className="col-span-2">
                            {new Date(application.decisionDate).toLocaleDateString()}
                          </dd>
                        </div>
                      )}
                      {application.decisionType && (
                        <div className="grid grid-cols-3 gap-2">
                          <dt className="text-gray-500">Decision</dt>
                          <dd className="col-span-2 font-medium">
                            <span className={`
                              px-2 py-0.5 rounded-full text-xs
                              ${application.decisionType === 'accepted' ? 'bg-green-100 text-green-800' : 
                                application.decisionType === 'rejected' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}
                            `}>
                              {application.decisionType}
                            </span>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  {/* 右侧：申请要求 */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Requirements</h4>
                    {application.requirements.length === 0 ? (
                      <p className="text-sm text-gray-500">No requirements added yet</p>
                    ) : (
                      <ul className="space-y-2">
                        {application.requirements.map(req => (
                          <li key={req.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {req.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              ) : req.status === 'in_progress' ? (
                                <Clock className="h-4 w-4 text-amber-500 mr-2" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-300 mr-2" />
                              )}
                              <span className="text-sm text-gray-700 capitalize">
                                {req.requirementType.replace('_', ' ')}
                              </span>
                            </div>
                            <StatusBadge status={req.status} size="sm" />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                {/* 底部操作按钮 */}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    Edit Requirements
                  </Button>
                  <Button variant="primary" size="sm">
                    View Full Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationList;