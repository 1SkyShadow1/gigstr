import React from 'react';

// Modern dual-ring loader inspired by uiverse.io, themed for gigstr
const Loader = () => (
  <div className="flex flex-col items-center justify-center" role="status" aria-live="polite">
    <span className="sr-only">Loading...</span>
    <span className="gigstr-loader"></span>
    <style>{`
      .gigstr-loader {
        display: inline-block;
        width: 48px;
        height: 48px;
        border: 4px solid rgba(128, 90, 213, 0.15); /* gigstr-purple/20 */
        border-top: 4px solid #805ad5; /* gigstr-purple */
        border-right: 4px solid #3b82f6; /* gigstr-blue */
        border-radius: 50%;
        animation: gigstr-spin 1s linear infinite;
        box-shadow: 0 2px 16px 0 rgba(128,90,213,0.10);
      }
      @keyframes gigstr-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader; 