'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function SearchModal() {
  const { searchOpen, toggleSearch, applications } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && searchOpen) toggleSearch();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen, toggleSearch]);

  if (!searchOpen) return null;

  const q = query.toLowerCase().trim();
  const results = q
    ? applications.filter(
        a =>
          a.id.toLowerCase().includes(q) ||
          a.institution.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q)
      )
    : [];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={toggleSearch} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <Search className="w-5 h-5 text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by application ID, institution name..."
              className="flex-1 text-base outline-none bg-transparent text-ink placeholder:text-gray-400"
            />
            <button
              onClick={toggleSearch}
              className="p-1 rounded hover:bg-gray-100 text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {q && results.length === 0 && (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted">No results for &ldquo;{query}&rdquo;</p>
                <button
                  onClick={() => setQuery('')}
                  className="text-sm text-civic mt-2 hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
            {results.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  router.push(`/applications/${app.id}`);
                  toggleSearch();
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <FileText className="w-4 h-4 text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink">{app.id}</div>
                  <div className="text-xs text-muted truncate">
                    {app.institution} &middot; {app.type} &middot; {app.academicYear}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
              </button>
            ))}
            {!q && (
              <div className="px-5 py-6 text-center text-sm text-muted">
                Type to search applications, institutions, or rules.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
