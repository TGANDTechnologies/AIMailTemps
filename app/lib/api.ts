import { apiRequest } from "./queryClient";

export const api = {
  // Dashboard
  getDashboardStats: () => fetch("/api/dashboard/stats").then(res => res.json()),

  // Contacts
  getContacts: () => fetch("/api/contacts").then(res => res.json()),
  getContact: (id: number) => fetch(`/api/contacts/${id}`).then(res => res.json()),
  createContact: (contact: any) => apiRequest("POST", "/api/contacts", contact),
  updateContact: (id: number, contact: any) => apiRequest("PUT", `/api/contacts/${id}`, contact),
  deleteContact: (id: number) => apiRequest("DELETE", `/api/contacts/${id}`),
  uploadContacts: (formData: FormData) => fetch("/api/contacts/upload", {
    method: "POST",
    body: formData,
  }).then(res => res.json()),

  // Campaigns
  getCampaigns: () => fetch("/api/campaigns").then(res => res.json()),
  getCampaign: (id: number) => fetch(`/api/campaigns/${id}`).then(res => res.json()),
  createCampaign: (campaign: any) => apiRequest("POST", "/api/campaigns", campaign),
  sendCampaign: (id: number) => apiRequest("POST", `/api/campaigns/${id}/send`),
  scheduleCampaign: (id: number, scheduledFor: string) => 
    apiRequest("POST", `/api/campaigns/${id}/schedule`, { scheduledFor }),
  getCampaignStats: (id: number) => fetch(`/api/campaigns/${id}/stats`).then(res => res.json()),
  getCampaignEmails: (id: number) => fetch(`/api/campaigns/${id}/emails`).then(res => res.json()),

  // Scheduled campaigns
  getScheduledCampaigns: () => fetch("/api/campaigns/scheduled").then(res => res.json()),
};
