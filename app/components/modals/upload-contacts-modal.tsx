import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadContactsModal({ open, onOpenChange }: UploadContactsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/contacts/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload contacts');
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: result.message,
      });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      onOpenChange(false);
      setFile(null);
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload contacts. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('csv', file);
    uploadMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Upload Contacts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800">
            <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Drag and drop your CSV file here, or
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="mt-2 text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium cursor-pointer"
            >
              browse files
            </label>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              CSV files with email, name, demographics, and purchase history
            </p>
          </div>

          {file && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Selected file: {file.name}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
