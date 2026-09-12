import React from 'react';
import LoadingState from './LoadingState';

const LivePreview = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-xl h-full min-h-[400px] flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
        <div className="text-4xl mb-3">⚡</div>
        <h3 className="text-lg font-medium text-gray-700">No Storefront Generated Yet</h3>
        <p className="text-sm text-gray-400 max-w-sm mt-1">
          Fill out the form on the left to watch InstaBiz generate a custom landing page instantly.
        </p>
      </div>
    );
  }

  const { tagline, primary_color, html_template } = result.data;

  const handleDownload = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tagline || 'InstaBiz Store'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    ${html_template}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instabiz_template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="bg-gray-900 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
            Generated Slogan
          </span>
          <p className="text-sm font-medium">{tagline}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleDownload} 
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md font-medium transition shadow-sm border border-indigo-500"
          >
            ⬇️ Download Template
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Theme Color:</span>
            <span
              className="w-4 h-4 rounded-full border border-white"
              style={{ backgroundColor: primary_color }}
            ></span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 flex-grow overflow-y-auto">
        <div className="bg-white rounded-lg shadow border overflow-hidden p-6 min-h-[500px]">
          <div dangerouslySetInnerHTML={{ __html: html_template }} />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;