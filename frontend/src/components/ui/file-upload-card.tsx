"use client";

import * as React from "react";
import { UploadCloud, X, File as FileIcon, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Define the structure for a file being uploaded
export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface FileUploadCardProps {
  onFilesSelected?: (files: File[]) => void;
  onFileRemove?: (id: string) => void;
  uploadingFiles?: UploadingFile[];
  className?: string;
  maxFiles?: number;
  accept?: string;
}

export function FileUploadCard({
  onFilesSelected,
  onFileRemove,
  uploadingFiles = [],
  className,
  maxFiles = 5,
  accept = "*",
}: FileUploadCardProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    if (droppedFiles.length > 0) {
      onFilesSelected?.(droppedFiles.slice(0, maxFiles));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? (Array.from(e.target.files) as File[]) : [];
    if (selectedFiles.length > 0) {
      onFilesSelected?.(selectedFiles.slice(0, maxFiles));
    }
    // Reset input value so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-4", className)}>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out p-12 flex flex-col items-center justify-center text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
          uploadingFiles.length >= maxFiles && "pointer-events-none opacity-50"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          multiple
          className="hidden"
        />

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative size-20 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
            <UploadCloud className={cn("size-10 transition-all duration-500", isDragging ? "scale-110 text-primary" : "text-white/40")} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {isDragging ? "Drop your files here" : "Upload New Record"}
          </h3>
          <p className="text-secondary max-w-xs mx-auto text-sm font-medium">
            Drag and drop your medical reports, scans, or prescriptions here or click to browse
          </p>
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/20">
          <span>PDF, JPG, PNG</span>
          <span className="size-1 rounded-full bg-white/10" />
          <span>Max 10MB each</span>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-2">
              <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">
                Uploading Files ({uploadingFiles.length}/{maxFiles})
              </h4>
              {uploadingFiles.every((f) => f.status === "completed") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold text-primary hover:text-primary/80 h-auto p-0"
                  onClick={() => uploadingFiles.forEach((f) => onFileRemove?.(f.id))}
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid gap-3">
              {uploadingFiles.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group relative glass border-white/5 p-4 rounded-2xl flex items-center gap-4 overflow-hidden"
                >
                  <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/10 transition-colors">
                    <FileIcon className="size-6" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-white truncate tracking-tight">
                        {file.file.name}
                      </p>
                      <span className="text-[10px] font-bold text-white/20 uppercase">
                        {formatFileSize(file.file.size)}
                      </span>
                    </div>

                    <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          "absolute inset-y-0 left-0 transition-all duration-300",
                          file.status === "error" ? "bg-red-500" : "bg-primary"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        file.status === "error" ? "text-red-400" : "text-white/40"
                      )}>
                        {file.status === "uploading" && `Uploading... ${file.progress}%`}
                        {file.status === "completed" && "Upload Complete"}
                        {file.status === "error" && (file.error || "Upload Failed")}
                      </p>
                      {file.status === "completed" && (
                        <CheckCircle2 className="size-3 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => onFileRemove?.(file.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
