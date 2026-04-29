// lib/api.ts - API client with cookie support

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiCall<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const defaultHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");

  // ✅ Fix — check ok status FIRST, then handle content type
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error((data as any).message || `API Error: ${response.status}`);
  }

  if (
    contentType?.includes("application/octet-stream") ||
    contentType?.includes("image")
  ) {
    return (await response.blob()) as unknown as T;
  }

  return await response.json();
}
export async function login(email: string, password: string) {
  return apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, name: string, password: string) {
  return apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });
}

export async function logout() {
  return apiCall("/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  return apiCall("/auth/me", {
    method: "GET",
  });
}

export async function refreshToken() {
  return apiCall("/auth/refresh", {
    method: "POST",
  });
}

// Attendees Registration (public)
export async function registerAttendee(data: {
  name: string;
  email: string;
  university: string;
  phone?: string;
  tshirtSize: string;
}) {
  return apiCall("/attendees/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Check attendee via email
export async function lookupAttendeeByEmail(email: string) {
  return apiCall("/attendees/lookup", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Attendees API
export async function getAttendees(
  page = 1,
  limit = 10,
  search = "",
  university?: string,
  checkedIn?: boolean
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append("search", search);
  if (university) params.append("university", university);
  if (checkedIn !== undefined) params.append("checkedIn", checkedIn.toString());

  return apiCall(`/attendees?${params.toString()}`, {
    method: "GET",
  });
}

// frontend-specific listing used by admin UI page
export async function getAttendeesForUI(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append("search", search);

  return apiCall(`/attendees/ui?${params.toString()}`, {
    method: "GET",
  });
}

export async function getAttendeeById(id: string) {
  return apiCall(`/attendees/${id}`, {
    method: "GET",
  });
}

export async function checkInAttendee(id: string) {
  return apiCall(`/attendees/${id}/checkin`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export async function updateAttendeeSwag(
  id: string,
  swagData: Record<string, boolean>
) {
  return apiCall(`/attendees/${id}/swag`, {
    method: "PATCH",
    body: JSON.stringify(swagData),
  });
}

export async function deleteAttendee(id: string) {
  return apiCall(`/attendees/${id}`, {
    method: "DELETE",
  });
}

export async function exportAttendees() {
  return fetch(`${API_URL}/attendees?export=true`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getAttendeeStats() {
  return apiCall("/attendees/stats", {
    method: "GET",
  });
}

// Speakers API
export async function applySpeaker(data: {
  name: string;
  email: string;
  topic: string;
  talkTitle: string;
  talkAbstract?: string;
  bio: string;
  role?: string;
  company?: string;
  linkedinUrl: string;
  twitterHandle?: string;
  githubUrl?: string;
  track?: string;
  experienceLevel?: string;
  sessionType?: string;
  photoBase64?: string | null;
}) {
  return apiCall("/speakers/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllSpeakers(status?: string, page = 1, limit = 100) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append("status", status);
  return apiCall(`/speakers/all?${params.toString()}`, { method: "GET" });
}

export async function getPublicSpeakers(track?: string, search?: string) {
  const params = new URLSearchParams();
  if (track && track !== "All") params.append("track", track);
  if (search) params.append("search", search);
  return apiCall(`/speakers?${params.toString()}`, { method: "GET" });
}

export async function approveSpeaker(id: string) {
  return apiCall(`/speakers/${id}/approve`, { method: "PATCH" });
}

export async function rejectSpeaker(id: string, reviewNote: string) {
  return apiCall(`/speakers/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reviewNote }),
  });
}

export async function deleteSpeaker(id: string) {
  return apiCall(`/speakers/${id}`, { method: "DELETE" });
}

export async function getSpeakerById(id: string) {
  return apiCall(`/speakers/${id}`, { method: "GET" });
}

// Volunteers API
export async function applyVolunteer(data: {
  name: string;
  email: string;
  phone?: string;
  university: string;
  cloudClub?: string;
  skills: string;
}) {
  return apiCall("/volunteers/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllVolunteers() {
  return apiCall("/volunteers/all", { method: "GET" });
}

export async function approveVolunteer(id: string, whatsappLink: string) {
  return apiCall(`/volunteers/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ whatsappLink }),
  });
}

export async function rejectVolunteer(id: string, reviewNote: string) {
  return apiCall(`/volunteers/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reviewNote }),
  });
}

export async function deleteVolunteer(id: string) {
  return apiCall(`/volunteers/${id}`, { method: "DELETE" });
}

// Agenda API
export async function getAgendaItems(track?: string) {
  const params = new URLSearchParams();
  if (track) params.append("track", track);
  return apiCall(`/agenda?${params.toString()}`, { method: "GET" });
}

export async function createAgendaItem(data: {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  track?: string;
  speakerId?: string;
  sortOrder?: number;
}) {
  return apiCall("/agenda", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAgendaItem(id: string, data: any) {
  return apiCall(`/agenda/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAgendaItem(id: string) {
  return apiCall(`/agenda/${id}`, { method: "DELETE" });
}

// Sponsors API
export async function getSponsors(all = false, status?: string) {
  const params = new URLSearchParams();
  if (all) params.append("all", "true");
  if (status) params.append("status", status);
  return apiCall(`/sponsors?${params.toString()}`, { method: "GET" });
}

export async function applySponsor(data: {
  name: string;
  contactName: string;
  contactEmail: string;
  website: string;
  logoUrl: string;
}) {
  return apiCall("/sponsors/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createSponsor(data: {
  name: string;
  logoUrl: string;
  website?: string;
  tier?: string;
  sortOrder?: number;
  visible?: boolean;
}) {
  return apiCall("/sponsors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSponsor(id: string, data: any) {
  return apiCall(`/sponsors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteSponsor(id: string) {
  return apiCall(`/sponsors/${id}`, { method: "DELETE" });
}

export async function approveSponsor(id: string, tier: string) {
  return apiCall(`/sponsors/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ tier }),
  });
}

export async function rejectSponsor(id: string) {
  return apiCall(`/sponsors/${id}/reject`, { method: "PATCH" });
}

// Organizers API
export async function getOrganizers(all = false) {
  const params = new URLSearchParams();
  if (all) params.append("all", "true");
  return apiCall(`/organizers?${params.toString()}`, { method: "GET" });
}

export async function createOrganizer(data: {
  name: string;
  role?: string;
  club?: string;
  bio?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  sortOrder?: number;
  visible?: boolean;
}) {
  return apiCall("/organizers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOrganizer(id: string, data: any) {
  return apiCall(`/organizers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOrganizer(id: string) {
  return apiCall(`/organizers/${id}`, { method: "DELETE" });
}

export async function uploadOrganizerImage(id: string, imageBase64: string) {
  return apiCall(`/organizers/${id}/upload-image`, {
    method: "POST",
    body: JSON.stringify({ imageBase64 }),
  });
}

// Emails API
export async function sendBroadcastEmail(data: {
  subject: string;
  template: string;
  target: "ATTENDEES" | "SPEAKERS" | "BOTH" | "CUSTOM";
  bodyVars?: Record<string, string>;
  customEmails?: string[];
}) {
  return apiCall("/emails/send", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getEmailLogs() {
  return apiCall("/emails", { method: "GET" });
}

export async function getEmailLogDetails(id: string) {
  return apiCall(`/emails/logs/${id}`, { method: "GET" });
}

// Event Config & Stats
export async function getPublicEventStats() {
  return apiCall("/event/stats", { method: "GET" });
}

export async function getAdminDashboardStats() {
  return apiCall("/event/dashboard", { method: "GET" });
}

export async function getEventConfig() {
  return apiCall("/event", { method: "GET" });
}

export async function updateEventConfig(data: any) {
  return apiCall("/event", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// PAYMENTS API
export async function createPayment(data: {
  attendeeId: string;
  amount: number;
  phoneNumber: string;
}) {
  return apiCall("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//////////////////////////////////////////////////
// POSTER API
//////////////////////////////////////////////////

export async function generatePoster(email: string, image: File) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("image", image);

  const blob = await apiCall<Blob>("/poster/generate", {
    method: "POST",
    body: formData,
  });

  const url = window.URL.createObjectURL(blob);

  //////////////////////////////////////////////////
  // AUTO DOWNLOAD
  //////////////////////////////////////////////////
  const link = document.createElement("a");
  link.href = url;
  link.download = "my-poster.png";
  document.body.appendChild(link);
  link.click();
  link.remove();

  return url; // ← used for preview
}
// UPLOADS API
export async function uploadPublicLogo(file: string) {
  return apiCall("/uploads/public", {
    method: "POST",
    body: JSON.stringify({ file }),
  });
}
