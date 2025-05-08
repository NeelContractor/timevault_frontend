// 'use client';

// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Button } from '@/components/ui/button';
// import { FileIcon, ImageIcon, VideoIcon, XIcon } from 'lucide-react';

// interface FileUploaderProps {
//   onFileSelected: (file: File | null) => void;
//   selectedFile: File | null;
// }

// export function FileUploader({ onFileSelected, selectedFile }: FileUploaderProps) {
//   const [preview, setPreview] = useState<string | null>(null);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       const file = acceptedFiles[0];
//       onFileSelected(file);
      
//       // Create preview for image/video
//       if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
//         const objectUrl = URL.createObjectURL(file);
//         setPreview(objectUrl);
//       } else {
//         setPreview(null);
//       }
//     }
//   }, [onFileSelected]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': [],
//       'video/*': [],
//       'audio/*': [],
//     },
//     maxFiles: 1,
//     maxSize: 5242880, // 5MB
//   });

//   const removeFile = () => {
//     onFileSelected(null);
//     if (preview) {
//       URL.revokeObjectURL(preview);
//       setPreview(null);
//     }
//   };

//   const renderFilePreview = () => {
//     if (!selectedFile) return null;

//     if (selectedFile.type.startsWith('image/') && preview) {
//       return (
//         <div className="relative">
//           <div className="absolute top-2 right-2 z-10">
//             <Button 
//               variant="destructive" 
//               size="icon" 
//               className="h-6 w-6 rounded-full" 
//               onClick={removeFile}
//             >
//               <XIcon className="h-3 w-3" />
//             </Button>
//           </div>
//           <img 
//             src={preview} 
//             alt="Preview" 
//             className="w-full h-auto max-h-48 object-contain rounded-md" 
//           />
//         </div>
//       );
//     }

//     if (selectedFile.type.startsWith('video/') && preview) {
//       return (
//         <div className="relative">
//           <div className="absolute top-2 right-2 z-10">
//             <Button 
//               variant="destructive" 
//               size="icon" 
//               className="h-6 w-6 rounded-full" 
//               onClick={removeFile}
//             >
//               <XIcon className="h-3 w-3" />
//             </Button>
//           </div>
//           <video 
//             src={preview} 
//             controls 
//             className="w-full h-auto max-h-48 rounded-md" 
//           />
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center justify-between p-4 rounded-md bg-muted/50">
//         <div className="flex items-center gap-3">
//           {selectedFile.type.startsWith('image/') ? (
//             <ImageIcon className="h-8 w-8 text-primary" />
//           ) : selectedFile.type.startsWith('video/') ? (
//             <VideoIcon className="h-8 w-8 text-secondary" />
//           ) : (
//             <FileIcon className="h-8 w-8 text-muted-foreground" />
//           )}
//           <div>
//             <p className="text-sm font-medium truncate max-w-[200px]">
//               {selectedFile.name}
//             </p>
//             <p className="text-xs text-muted-foreground">
//               {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//             </p>
//           </div>
//         </div>
//         <Button 
//           variant="ghost" 
//           size="sm" 
//           onClick={removeFile}
//           className="h-8 w-8 p-0"
//         >
//           <XIcon className="h-4 w-4" />
//         </Button>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-4">
//       {selectedFile ? (
//         renderFilePreview()
//       ) : (
//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed rounded-md py-8 px-4 text-center cursor-pointer bg-black/30 hover:bg-black/40 transition-colors ${
//             isDragActive ? 'border-primary' : 'border-white/10'
//           }`}
//         >
//           <input {...getInputProps()} />
//           <div className="flex flex-col items-center justify-center gap-2">
//             <FileIcon className="h-10 w-10 text-muted-foreground" />
//             <p className="text-sm text-muted-foreground">
//               {isDragActive
//                 ? "Drop your file here..."
//                 : "Drag & drop a file here, or click to select"}
//             </p>
//             <p className="text-xs text-muted-foreground">
//               Images, videos or audio (max 5MB)
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }