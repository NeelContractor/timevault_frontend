"use client"

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

// Dynamically import client components
const DynamicRadioGroup = dynamic(() => import("./ui/radio-group").then(mod => mod.RadioGroup), { ssr: false });
const DynamicRadioGroupItem = dynamic(() => import("./ui/radio-group").then(mod => mod.RadioGroupItem), { ssr: false });

interface ContentUploaderProps {
  onContentChange: (content: string | File, type: 'text' | 'image' | 'video' | 'file') => void;
  className?: string;
}

const ContentUploader = ({ onContentChange, className }: ContentUploaderProps) => {
  const [contentType, setContentType] = useState<'text' | 'image' | 'video' | 'file'>('text');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleContentTypeChange = (value: string) => {
    const newType = value as 'text' | 'image' | 'video' | 'file';
    setContentType(newType);
    
    // Clear previous content when changing type
    if (newType === 'text') {
      onContentChange(textContent, 'text');
    } else {
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
    onContentChange(e.target.value, 'text');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onContentChange(selectedFile, contentType);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const getFileTypesForContentType = () => {
    switch (contentType) {
      case 'image':
        return "image/*";
      case 'video':
        return "video/*";
      case 'file':
        return ".pdf,.doc,.docx,.txt,.zip";
      default:
        return "";
    }
  };
  
  const renderUploadArea = () => {
    if (contentType === 'text') {
      return (
        <Textarea
          placeholder="Enter your message here..."
          className="min-h-[200px] bg-vault-dark/50 border-vault-accent/30 text-white"
          value={textContent}
          onChange={handleTextChange}
        />
      );
    } else {
      const fileTypeText = contentType === 'image' ? 'image' : contentType === 'video' ? 'video' : 'file';
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-vault-accent/30 rounded-lg p-6 bg-vault-dark/20">
          <input
            ref={fileInputRef}
            type="file"
            accept={getFileTypesForContentType()}
            onChange={handleFileChange}
            className="hidden"
          />
          
          {file ? (
            <div className="text-center">
              <p className="text-vault-light font-medium mb-2">
                Selected {fileTypeText}: {file.name}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <Button 
                variant="outline" 
                onClick={triggerFileUpload}
                className="border-vault-accent/50 text-vault-accent hover:bg-vault-accent/20"
              >
                Choose a different {fileTypeText}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-vault-light mb-2">
                Click to upload a {fileTypeText}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                {contentType === 'image' ? 'SVG, PNG, JPG or GIF' : 
                 contentType === 'video' ? 'MP4, WebM or AVI' : 
                 'PDF, DOC, or TXT'} (max. 10MB)
              </p>
              <Button 
                variant="outline" 
                onClick={triggerFileUpload}
                className="border-vault-accent/50 text-vault-accent hover:bg-vault-accent/20"
              >
                Select {fileTypeText}
              </Button>
            </div>
          )}
        </div>
      );
    }
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-3">
        <Label className="text-white">Content Type</Label>
        <DynamicRadioGroup
          value={contentType}
          onValueChange={handleContentTypeChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <DynamicRadioGroupItem value="text" id="text" className="text-vault-accent border-vault-accent" />
            <Label htmlFor="text" className="text-white">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <DynamicRadioGroupItem value="image" id="image" className="text-vault-accent border-vault-accent" />
            <Label htmlFor="image" className="text-white">Image</Label>
          </div>
          <div className="flex items-center space-x-2">
            <DynamicRadioGroupItem value="video" id="video" className="text-vault-accent border-vault-accent" />
            <Label htmlFor="video" className="text-white">Video</Label>
          </div>
          <div className="flex items-center space-x-2">
            <DynamicRadioGroupItem value="file" id="file" className="text-vault-accent border-vault-accent" />
            <Label htmlFor="file" className="text-white">File</Label>
          </div>
        </DynamicRadioGroup>
      </div>
      
      <div>{renderUploadArea()}</div>
    </div>
  );
};

export default ContentUploader;
