import React from 'react';
import { Database, Server, Users, Shield, FileText, Bell, Layers, Box, Monitor, Cloud, Lock, GitBranch } from 'lucide-react';

export default function ChorusArchitecture() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">CHORUS-TRE Architecture</h1>
          <p className="text-slate-600">Trusted Research Environment System</p>
        </div>

        {/* Client Layer */}
        <div className="mb-6">
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-blue-800">Client Layer</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <p className="font-semibold text-slate-700">Web UI</p>
                <p className="text-xs text-slate-500">React / Browser</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <p className="font-semibold text-slate-700">OAuth2 Clients</p>
                <p className="text-xs text-slate-500">External Auth</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <p className="font-semibold text-slate-700">API Consumers</p>
                <p className="text-xs text-slate-500">REST Clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Gateway Layer */}
        <div className="mb-6">
          <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Server className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-purple-800">API Gateway</h2>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <p className="font-semibold text-slate-700 mb-2">REST API (v1)</p>
              <p className="text-xs text-slate-500">Schemes: HTTP/HTTPS | Format: JSON</p>
              <p className="text-xs text-slate-500">Base Path: /api/rest/v1</p>
            </div>
          </div>
        </div>

        {/* Core Services Layer */}
        <div className="mb-6">
          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-green-800">Core Services</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Authentication Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={20} className="text-green-600" />
                  <h3 className="font-bold text-slate-700">Authentication</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Login/Logout</li>
                  <li>• OAuth2 Integration</li>
                  <li>• Token Management</li>
                  <li>• TOTP (2FA)</li>
                  <li>• Multi-mode Auth</li>
                </ul>
              </div>

              {/* User Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-blue-600" />
                  <h3 className="font-bold text-slate-700">User Service</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• User CRUD</li>
                  <li>• Role Management</li>
                  <li>• Password Reset</li>
                  <li>• Profile Management</li>
                  <li>• User Filtering</li>
                </ul>
              </div>

              {/* Workspace Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch size={20} className="text-orange-600" />
                  <h3 className="font-bold text-slate-700">Workspace Service</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Workspace CRUD</li>
                  <li>• File Management</li>
                  <li>• User Access Control</li>
                  <li>• Role Assignment</li>
                  <li>• Main Workspace</li>
                </ul>
              </div>

              {/* Workbench Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor size={20} className="text-purple-600" />
                  <h3 className="font-bold text-slate-700">Workbench Service</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Workbench CRUD</li>
                  <li>• K8s Pod Status</li>
                  <li>• Resolution Config</li>
                  <li>• User Management</li>
                  <li>• Workspace Link</li>
                </ul>
              </div>

              {/* App Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-pink-500">
                <div className="flex items-center gap-2 mb-2">
                  <Box size={20} className="text-pink-600" />
                  <h3 className="font-bold text-slate-700">App Service</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• App CRUD</li>
                  <li>• Docker Image Config</li>
                  <li>• Resource Limits</li>
                  <li>• Bulk Operations</li>
                  <li>• App Catalog</li>
                </ul>
              </div>

              {/* App Instance Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-indigo-500">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud size={20} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-700">App Instance</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Instance CRUD</li>
                  <li>• K8s Integration</li>
                  <li>• Status Tracking</li>
                  <li>• Resource Monitor</li>
                  <li>• Instance Lifecycle</li>
                </ul>
              </div>

              {/* Notification Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={20} className="text-yellow-600" />
                  <h3 className="font-bold text-slate-700">Notification</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Message Queue</li>
                  <li>• Read/Unread Status</li>
                  <li>• Notification Count</li>
                  <li>• User Filtering</li>
                  <li>• Bulk Mark Read</li>
                </ul>
              </div>

              {/* Steward Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={20} className="text-red-600" />
                  <h3 className="font-bold text-slate-700">Steward Service</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Tenant Init</li>
                  <li>• System Admin</li>
                  <li>• Multi-tenancy</li>
                  <li>• Configuration</li>
                  <li>• Provisioning</li>
                </ul>
              </div>

              {/* Health Service */}
              <div className="bg-white p-4 rounded shadow-md border-l-4 border-teal-500">
                <div className="flex items-center gap-2 mb-2">
                  <Server size={20} className="text-teal-600" />
                  <h3 className="font-bold text-slate-700">Health Service</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Health Checks</li>
                  <li>• Readiness Probe</li>
                  <li>• Liveness Probe</li>
                  <li>• Status Monitor</li>
                  <li>• System Metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Layer */}
        <div className="mb-6">
          <div className="bg-slate-200 border-2 border-slate-400 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="text-slate-600" size={24} />
              <h2 className="text-xl font-bold text-slate-800">Infrastructure Layer</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <p className="font-semibold text-slate-700">Kubernetes</p>
                <p className="text-xs text-slate-500">Container Orchestration</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <p className="font-semibold text-slate-700">Docker Registry</p>
                <p className="text-xs text-slate-500">Image Storage</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <p className="font-semibold text-slate-700">File Storage</p>
                <p className="text-xs text-slate-500">Workspace Files</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <p className="font-semibold text-slate-700">Database</p>
                <p className="text-xs text-slate-500">Persistent Data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border-2 border-slate-300 rounded-lg p-6">
            <h3 className="font-bold text-slate-800 mb-3">🔐 Security Features</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• Bearer Token Authentication</li>
              <li>• OAuth2/OpenID Connect</li>
              <li>• TOTP Two-Factor Authentication</li>
              <li>• Role-Based Access Control (RBAC)</li>
              <li>• Multi-Tenant Isolation</li>
              <li>• Context-Based Permissions</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-lg p-6">
            <h3 className="font-bold text-slate-800 mb-3">🚀 Key Capabilities</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• Dynamic App Deployment (Docker)</li>
              <li>• Workspace File Management</li>
              <li>• Resource Quota Management</li>
              <li>• Real-time Status Tracking</li>
              <li>• Pagination & Filtering</li>
              <li>• Public User Registration</li>
            </ul>
          </div>
        </div>

        {/* Data Flow */}
        <div className="mt-6 bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-3">📊 Data Flow Pattern</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="bg-white p-3 rounded shadow">Client Request</div>
            <div className="text-2xl text-amber-600">→</div>
            <div className="bg-white p-3 rounded shadow">API Gateway</div>
            <div className="text-2xl text-amber-600">→</div>
            <div className="bg-white p-3 rounded shadow">Auth Check</div>
            <div className="text-2xl text-amber-600">→</div>
            <div className="bg-white p-3 rounded shadow">Service Logic</div>
            <div className="text-2xl text-amber-600">→</div>
            <div className="bg-white p-3 rounded shadow">K8s/Storage</div>
            <div className="text-2xl text-amber-600">→</div>
            <div className="bg-white p-3 rounded shadow">Response</div>
          </div>
        </div>
      </div>
    </div>
  );
}
