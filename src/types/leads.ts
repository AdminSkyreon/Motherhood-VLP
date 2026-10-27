export type LeadForm = {
  name: string;
  mobile: string;
  language?: string;
  comment?: string;
  phone?: string;
  email?: string;
};

export type LeadConfig = {
  hospitalId?: string;
  source?: string;
  website?: string;
  websiteCode?: string;
  unitnameC?: string;
  formEnquiryType?: string;
  formName?: string;
  formEnquirySubtype?: string;
  enquirySource?: string;
  formCampaignName?: string;
  campaignDefaults?: Record<string, string>;
  endpoint?: string;
  payload?: Record<string, unknown>;
  queryParams?: Record<string, string>;
  omitEmptyFields?: boolean;
};

export type HospitalContext = {
  slug: string;
  hospitalName: string;
  address: string;
  phone: { display: string; tel: string } | Record<string, never>;
  brand: string;
};

export type Campaign = Record<string, string>;

export type LeadMeta = {
  pageUrl: string;
  submittedAt: string;
  vertical: "gynaecology";
};

export type LeadSubmitContext = {
  form: LeadForm;
  lead: LeadConfig;
  hospital: Partial<HospitalContext>;
  campaign: Campaign;
  meta: Partial<LeadMeta>;
};

export type HospitalRecord = {
  slug?: string;
  brand?: string;
  address?: string;
  lead?: LeadConfig;
  sections?: {
    booking?: { lead?: LeadConfig };
    footer?: { hospitalName?: string; branch?: string; phone?: string };
    header?: { phoneNumber?: string };
    location?: { address?: string };
  };
};
