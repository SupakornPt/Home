export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  ok: true;
  referenceId: string;
}

export interface ApiErrorBody {
  error: string;
  code?: string;
}
