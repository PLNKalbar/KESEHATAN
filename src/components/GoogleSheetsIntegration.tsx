import React, { useState, useEffect } from 'react';
import { googleSignIn, initAuth, getAccessToken, logout } from '../lib/firebase';
import { User } from 'firebase/auth';
import { FileSpreadsheet, LogIn, LogOut, Download, AlertCircle } from 'lucide-react';
import { cn } from './utils';

export function GoogleSheetsIntegration() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [sheetId, setSheetId] = useState('');
  const [range, setRange] = useState('Sheet1!A1:D10');
  const [sheetData, setSheetData] = useState<any[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setToken(token);
        setNeedsAuth(false);
      },
      () => {
        setNeedsAuth(true);
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setSheetData(null);
  };

  const fetchSheetData = async () => {
    if (!sheetId.trim()) {
      setError('Please enter a Spreadsheet ID');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error('Not authenticated');

      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to fetch spreadsheet data');
      }
      
      if (data.values) {
        setSheetData(data.values);
      } else {
        setSheetData([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  if (needsAuth) {
    return (
      <div className="bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant p-6 rounded-xl flex flex-col items-center justify-center text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <FileSpreadsheet className="text-primary" size={32} />
        </div>
        <h3 className="font-headline-sm mb-2 text-on-surface">Connect Google Sheets</h3>
        <p className="text-on-surface-variant font-body-md mb-6 max-w-sm">
          Sign in with your Google account to connect your spreadsheets and import data directly into the dashboard.
        </p>
        
        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant hover:bg-surface-container flex items-center gap-3 px-6 py-3 rounded-full font-label-md transition-colors shadow-sm active:scale-95 text-on-surface"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant p-6 rounded-xl flex flex-col gap-6">
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileSpreadsheet className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-headline-sm text-on-surface">Data Import</h3>
            <p className="font-body-md text-on-surface-variant flex items-center gap-1">
              Connected as <span className="font-semibold">{user?.email}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-error hover:bg-error-container/20 rounded-lg transition-colors font-label-md"
        >
          <LogOut size={16} />
          Disconnect
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block font-label-sm mb-1 text-on-surface-variant">Spreadsheet ID</label>
          <input 
            type="text" 
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
          />
        </div>
        <div>
          <label className="block font-label-sm mb-1 text-on-surface-variant">Range</label>
          <input 
            type="text" 
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g. Sheet1!A1:D10"
            className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={fetchSheetData}
          disabled={loading || !sheetId}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-label-md hover:bg-primary/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Download size={18} />
          )}
          Fetch Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg font-body-md flex gap-3 items-start">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {sheetData && (
        <div className="mt-2 border border-outline-variant rounded-lg overflow-hidden">
          <div className="bg-surface px-4 py-2 border-b border-outline-variant font-label-md flex justify-between items-center">
            <span>Preview Data</span>
            <span className="text-on-surface-variant font-normal">{sheetData.length} rows loaded</span>
          </div>
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            {sheetData.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_1px_0_var(--color-outline-variant)]">
                  <tr>
                    {sheetData[0].map((cell: any, i: number) => (
                      <th key={i} className="px-4 py-3 font-label-md text-on-surface-variant bg-surface/50 whitespace-nowrap">
                        {cell || `Col ${i+1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {sheetData.slice(1).map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-surface/50 transition-colors">
                      {sheetData[0].map((_: any, colIdx: number) => (
                        <td key={colIdx} className="px-4 py-2.5 font-body-md text-on-surface whitespace-nowrap">
                          {row[colIdx] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-on-surface-variant font-body-md italic">
                No data found in range.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
