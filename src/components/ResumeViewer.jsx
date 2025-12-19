import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ResumeViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div ref={containerRef} className="resume-viewer w-full flex flex-col items-center bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 min-h-[500px]">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center h-96 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center h-64 w-full p-8 text-center">
            <p className="text-red-500 font-bold mb-2">Failed to load resume.</p>
            <a href={pdfUrl} className="text-emerald-600 underline">Download PDF directly</a>
          </div>
        }
        className="w-full"
      >
        {/* Render only the first page for the resume, or map through numPages if multiple */}
        {containerWidth && (
          <Page 
            pageNumber={1} 
            width={containerWidth} 
            renderTextLayer={true} 
            renderAnnotationLayer={true}
            className="shadow-sm"
          />
        )}
      </Document>
    </div>
  );
};

export default ResumeViewer;
