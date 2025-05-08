// 'use client';

// import { useState } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Textarea } from '@/components/ui/textarea';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { format } from 'date-fns';
// import { CalendarIcon, Clock2, FileUpIcon, Loader2 } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { FileUploader } from './file-uploader';
// import { generateId } from '@/lib/utils';
// import { useRouter } from 'next/navigation';
// import { useTimeCapsules } from '@/hooks/use-time-capsules';
// import { toast } from 'sonner';
// import { TimePicker } from './time-picker';
// import { motion } from 'framer-motion';
// import { useTimevaultProgram } from './vault/vault-data-access';

// const formSchema = z.object({
//   title: z.string().min(2, {
//     message: 'Title must be at least 2 characters.',
//   }),
//   message: z.string().optional(),
//   unlockDate: z.date({
//     required_error: 'Please select a date to unlock the capsule.',
//   }),
//   unlockTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
//     message: 'Please enter a valid time in 24-hour format (HH:MM)',
//   }),
// });

// export function CreateCapsuleForm() {
//   const [media, setMedia] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();
//   const { addCapsule } = useTimeCapsules();
//   const { creatTimevaultAccount } = useTimevaultProgram();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: '',
//       message: '',
//       unlockTime: '12:00',
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setIsSubmitting(true);
      
//       // Combine date and time
//       const unlockDate = new Date(values.unlockDate);
//       const [hours, minutes] = values.unlockTime.split(':').map(Number);
//       unlockDate.setHours(hours, minutes);
      
//       if (unlockDate < new Date()) {
//         toast.error('Unlock time must be in the future');
//         setIsSubmitting(false);
//         return;
//       }

//       let mediaUrl = '';
//       let mediaType = '';
      
//       if (media) {
//         // In a real app, we would upload to a storage service
//         // For this demo, we'll use a data URL
//         mediaUrl = URL.createObjectURL(media);
//         mediaType = media.type.split('/')[0]; // 'image', 'video', etc.
//       }
      
//       const newCapsule = {
//         id: generateId(),
//         title: values.title,
//         message: values.message || '',
//         mediaUrl,
//         mediaType,
//         createdAt: new Date(),
//         unlockTime: unlockDate,
//       };

//       //
//       const res = creatTimevaultAccount.mutate({
//         unlock_time: newCapsule.unlockTime,
//         mediaUrl: newCapsule.mediaUrl,
//         mediaType: newCapsule.mediaType,
//       } as any);
//       console.log(res);
//       //
      
//       // Add to the capsules store
//       addCapsule(newCapsule);
      
//       toast.success('Time capsule created successfully');
      
//       // Navigate back to dashboard
//       router.push('/dashboard');
      
//     } catch (error) {
//       console.error('Error creating capsule:', error);
//       toast.error('Failed to create time capsule');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//     >
//       <Card className="backdrop-blur-sm bg-black/20 border border-white/10">
//         <CardContent className="pt-6">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Title</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="My Time Capsule" 
//                         {...field} 
//                         className="bg-black/30 border-white/10"
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Give your time capsule a memorable name
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="message"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Message</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Write a message to your future self..."
//                         className="min-h-[100px] bg-black/30 border-white/10"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       This message will be revealed when the capsule unlocks
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <div className="space-y-3">
//                 <FormLabel>Media (Optional)</FormLabel>
//                 <FileUploader 
//                   onFileSelected={setMedia} 
//                   selectedFile={media}
//                 />
//                 <FormDescription>
//                   Add an image, video, or audio file to your time capsule
//                 </FormDescription>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="unlockDate"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col">
//                       <FormLabel>Unlock Date</FormLabel>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <FormControl>
//                             <Button
//                               variant="outline"
//                               className={cn(
//                                 "pl-3 text-left font-normal bg-black/30 border-white/10",
//                                 !field.value && "text-muted-foreground"
//                               )}
//                             >
//                               {field.value ? (
//                                 format(field.value, "PPP")
//                               ) : (
//                                 <span>Pick a date</span>
//                               )}
//                               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                             </Button>
//                           </FormControl>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0" align="start">
//                           <Calendar
//                             mode="single"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             disabled={(date) => date < new Date()}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                       <FormDescription>
//                         Date when your capsule will unlock
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="unlockTime"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Unlock Time</FormLabel>
//                       <FormControl>
//                         <TimePicker field={field} />
//                       </FormControl>
//                       <FormDescription>
//                         Time in 24-hour format (HH:MM)
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
              
//               <Button 
//                 type="submit" 
//                 disabled={isSubmitting}
//                 className="w-full py-6"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating Capsule...
//                   </>
//                 ) : (
//                   'Create Time Capsule'
//                 )}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }