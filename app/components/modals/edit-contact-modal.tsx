import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
// Define Contact interface since shared/schema no longer exists
interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number | null
  gender: string | null
  location: string | null
  lastPurchase: string | null
  purchaseDate: string | null
  totalSpent: number | null
  personalityType: string | null
  communicationStyle: string | null
  interests: string | null
  createdAt: string
  updatedAt: string
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export default function EditContactModal({ open, onOpenChange, contact }: EditContactModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    location: "",
    lastPurchase: "",
    purchaseDate: "",
    totalSpent: "",
    personalityType: "",
    communicationStyle: "",
    interests: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateContactMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update contact');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contact updated",
        description: "The contact has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        age: contact.age?.toString() || "",
        gender: contact.gender || "",
        location: contact.location || "",
        lastPurchase: contact.lastPurchase || "",
        purchaseDate: contact.purchaseDate 
          ? new Date(contact.purchaseDate).toISOString().split('T')[0] 
          : "",
        totalSpent: contact.totalSpent?.toString() || "",
        personalityType: contact.personalityType || "",
        communicationStyle: contact.communicationStyle || "",
        interests: contact.interests || "",
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender || undefined,
      location: formData.location || undefined,
      lastPurchase: formData.lastPurchase || undefined,
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
      totalSpent: formData.totalSpent ? parseFloat(formData.totalSpent) : undefined,
      personalityType: formData.personalityType || undefined,
      communicationStyle: formData.communicationStyle || undefined,
      interests: formData.interests || undefined,
    };

    updateContactMutation.mutate({ id: contact.id, data: updateData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Edit Contact Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Demographics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Purchase History</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="lastPurchase">Last Purchase</Label>
                <Input
                  id="lastPurchase"
                  value={formData.lastPurchase}
                  onChange={(e) => setFormData({ ...formData, lastPurchase: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="totalSpent">Total Spent ($)</Label>
                <Input
                  id="totalSpent"
                  type="number"
                  step="0.01"
                  value={formData.totalSpent}
                  onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Personality Information</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="personalityType">Personality Type</Label>
                <Select value={formData.personalityType} onValueChange={(value) => setFormData({ ...formData, personalityType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select personality type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Analytical">Analytical</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Practical">Practical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="communicationStyle">Communication Style</Label>
                <Select value={formData.communicationStyle} onValueChange={(value) => setFormData({ ...formData, communicationStyle: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interests">Interests</Label>
                <Input
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Technology, Design, Business"
                />
              </div>
            </div>
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
              disabled={updateContactMutation.isPending}
            >
              {updateContactMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
