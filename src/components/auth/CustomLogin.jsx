// src/components/auth/CustomLogin.jsx
"use client";

import { useState } from "react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { Shield, Key, Smartphone, Fingerprint } from "lucide-react";

export default function CustomLogin() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [authMethod, setAuthMethod] = useState("password");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Security Status Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">
                  Security Status
                </p>
                <p className="text-xs text-green-400">All systems secure</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Encrypted Connection</p>
              <p className="text-sm text-gray-300">TLS 1.3 ✓</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Secure Access
              </h1>
              <p className="text-gray-300">Enterprise-grade authentication</p>
            </div>

            {/* Auth Method Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setAuthMethod("password")}
                  className={`py-3 rounded-xl text-center transition-all ${
                    authMethod === "password"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => setAuthMethod("passwordless")}
                  className={`py-3 rounded-xl text-center transition-all ${
                    authMethod === "passwordless"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Magic Link
                  </div>
                </button>
              </div>
            </div>

            {/* Login Options */}
            <div className="space-y-4">
              <LoginLink className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
                Sign in with Email
              </LoginLink>

              <LoginLink className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-all flex items-center justify-center border border-gray-700">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                Continue with GitHub
              </LoginLink>

              <LoginLink className="w-full py-3 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all flex items-center justify-center border">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </LoginLink>
            </div>

            {/* Advanced Security Toggle */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-gray-400 hover:text-gray-300 text-sm flex items-center justify-center"
              >
                <Fingerprint className="w-4 h-4 mr-2" />
                {showAdvanced ? "Hide" : "Show"} Advanced Security Options
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-3 animate-fadeIn">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-300 mb-2">
                      Hardware Security Key
                    </p>
                    <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition">
                      Register Security Key
                    </button>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-300 mb-2">
                      Two-Factor Authentication
                    </p>
                    <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition">
                      Setup 2FA
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <RegisterLink className="text-blue-400 hover:text-blue-300 font-medium">
                  Create secure account
                </RegisterLink>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                By continuing, you agree to our Security & Privacy policies
              </p>
            </div>
          </div>

          {/* Security Footer */}
          <div className="bg-black/30 border-t border-white/10 px-8 py-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Encrypted
                </span>
                <span>Zero-Knowledge</span>
              </div>
              <div>v2.0 • SOC2 Compliant</div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <div className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300 border border-gray-700">
            🔒 End-to-End Encryption
          </div>
          <div className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300 border border-gray-700">
            🛡️ GDPR Compliant
          </div>
          <div className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300 border border-gray-700">
            ⚡ &lt;100ms Response
          </div>
        </div>
      </div>
    </div>
  );
}
