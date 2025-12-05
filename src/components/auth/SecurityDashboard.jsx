// src/components/auth/SecurityDashboard.jsx
"use client";

import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import {
  Shield,
  AlertTriangle,
  Clock,
  Globe,
  Cpu,
  Database,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SecurityDashboard() {
  const { securityInfo, enhancedUser, loading } = useEnhancedAuth();
  const [securityEvents, setSecurityEvents] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    uptime: "99.9%",
    latency: "42ms",
    threats: 0,
  });

  useEffect(() => {
    if (enhancedUser?.id) {
      fetchSecurityEvents();
      fetchSystemHealth();
    }
  }, [enhancedUser]);

  const fetchSecurityEvents = async () => {
    const res = await fetch(
      `/api/user/audit?userId=${enhancedUser.id}&limit=5`
    );
    const data = await res.json();
    setSecurityEvents(data.events || []);
  };

  const fetchSystemHealth = async () => {
    // Simulated system health data
    setSystemHealth({
      uptime: "99.97%",
      latency: `${Math.floor(Math.random() * 50) + 20}ms`,
      threats: Math.floor(Math.random() * 3),
    });
  };

  if (loading) return <div>Loading security dashboard...</div>;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Security Dashboard
            </h3>
            <p className="text-sm text-gray-400">
              Real-time protection overview
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Session ID</div>
          <div className="text-sm text-gray-300 font-mono">
            {enhancedUser?.id?.substring(0, 8)}...
          </div>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Account Age</p>
              <p className="text-xl font-bold text-white">
                {securityInfo?.accountAge || 0}d
              </p>
            </div>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Login Count</p>
              <p className="text-xl font-bold text-white">
                {securityInfo?.loginCount || 0}
              </p>
            </div>
            <Globe className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">System Uptime</p>
              <p className="text-xl font-bold text-green-400">
                {systemHealth.uptime}
              </p>
            </div>
            <Cpu className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Threats</p>
              <p
                className={`text-xl font-bold ${
                  systemHealth.threats > 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {systemHealth.threats}
              </p>
            </div>
            <AlertTriangle className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Recent Security Events
        </h4>
        <div className="space-y-2">
          {securityEvents.length > 0 ? (
            securityEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      event.severity === "HIGH"
                        ? "bg-red-500/20"
                        : event.severity === "MEDIUM"
                        ? "bg-yellow-500/20"
                        : "bg-blue-500/20"
                    }`}
                  >
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-200">{event.action}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    event.severity === "HIGH"
                      ? "bg-red-500/20 text-red-400"
                      : event.severity === "MEDIUM"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {event.severity}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No security events found
            </p>
          )}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <h4 className="text-sm font-medium text-blue-300 mb-2">
          Security Recommendations
        </h4>
        <ul className="text-sm text-blue-200/80 space-y-1">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            Enable Two-Factor Authentication for enhanced security
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            Review your recent login activity regularly
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            Use a password manager for stronger passwords
          </li>
        </ul>
      </div>
    </div>
  );
}
