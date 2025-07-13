import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    prompt: "",
    sendOption: "now",
    scheduleDate: "",
    scheduleTime: "",
    customSubject: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
      if (!response.ok) throw new Error('Failed to create campaign');
      return response.json();
    },
    onSuccess: async (campaign) => {
      if (formData.sendOption === "now") {
        // Send immediately
        const response = await fetch(`/api/campaigns/${campaign.id}/send`, {
          method: 'POST',
        });
        if (response.ok) {
          toast({
            title: "Campaign sent",
            description: "Your campaign is being sent to all contacts.",
          });
        }
      } else {
        toast({
          title: "Campaign scheduled",
          description: `Your campaign will be sent on ${formData.scheduleDate} at ${formData.scheduleTime}.`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      onOpenChange(false);
      setFormData({
        name: "",
        prompt: "",
        sendOption: "now",
        scheduleDate: "",
        scheduleTime: "",
        customSubject: "",
      });
    },
    onError: () => {
      toast({
        title: "Campaign failed",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData = {
      name: formData.name,
      prompt: formData.prompt,
      scheduledFor: formData.sendOption === "schedule" 
        ? new Date(`${formData.scheduleDate}T${formData.scheduleTime}`).toISOString()
        : undefined,
    };

    createCampaignMutation.mutate(campaignData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Create AI-Powered Campaign</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div>
            <Label htmlFor="prompt">AI Email Prompt</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="Describe the type of email you want to send. The AI will personalize each email based on individual contact profiles. Example: 'Send a friendly follow-up about our new product features, highlighting benefits that match their previous purchases and personality type.'"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The AI will read each contact's profile and create personalized emails based on their demographics, purchase history, and personality data.
            </p>
          </div>

          <div>
            <Label htmlFor="customSubject">Email Subject (Optional)</Label>
            <Input
              id="customSubject"
              value={formData.customSubject}
              onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
              placeholder="Leave blank for AI to generate personalized subjects"
            />
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <Label className="text-base font-medium">Sending Options</Label>
            <RadioGroup
              value={formData.sendOption}
              onValueChange={(value) => setFormData({ ...formData, sendOption: value })}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now">Send immediately</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="schedule" id="schedule" />
                <Label htmlFor="schedule">Schedule for later</Label>
              </div>
            </RadioGroup>
            
            {formData.sendOption === "schedule" && (
              <div className="mt-4 flex space-x-4">
                <Input
                  type="date"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                  required
                />
                <Input
                  type="time"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                  required
                />
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">AI Personalization Preview</h4>
            <p className="text-sm text-blue-800">Each email will be uniquely crafted based on:</p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Demographics (age, location, gender)</li>
              <li>• Purchase history and preferences</li>
              <li>• Personality traits and communication style</li>
              <li>• Previous email engagement patterns</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCampaignMutation.isPending}
            >
              {createCampaignMutation.isPending ? "Creating..." : "Generate & Send Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
