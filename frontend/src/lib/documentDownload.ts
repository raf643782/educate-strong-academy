import api from './api';

/**
 * Shared authenticated download flow for CourseDocument, used by both
 * Documents.tsx and CoursePlayer.tsx so neither page ever links straight
 * to a stored file reference. Always goes through the gated backend
 * endpoint, which re-checks auth/enrolment/lock state on every call and
 * returns a short-lived signed R2 URL — never a permanent or public one.
 */

export type DownloadResult =
  | { status: 'opened' }
  | { status: 'popup-blocked'; url: string }
  | { status: 'error'; message: string };

export async function downloadCourseDocument(documentId: string): Promise<DownloadResult> {
  try {
    const res = await api.get<{ url: string }>(`/documents/${documentId}/download`);
    const win = window.open(res.data.url, '_blank', 'noopener,noreferrer');
    if (!win) {
      return { status: 'popup-blocked', url: res.data.url };
    }
    return { status: 'opened' };
  } catch (err: any) {
    const httpStatus = err?.response?.status;
    const serverMessage: string | undefined = err?.response?.data?.message || err?.response?.data?.error;

    if (httpStatus === 401) {
      // The api client's response interceptor already clears the token and
      // redirects to /login on any 401 — this message only covers the brief
      // window before that redirect completes.
      return { status: 'error', message: 'Your session has expired. Please log in again.' };
    }
    if (httpStatus === 403) {
      return { status: 'error', message: serverMessage || 'You do not have access to this document.' };
    }
    if (httpStatus === 404) {
      return { status: 'error', message: serverMessage || 'This document could not be found.' };
    }
    if (httpStatus === 503) {
      return { status: 'error', message: serverMessage || 'This document is not available right now. Please try again later.' };
    }
    return { status: 'error', message: serverMessage || 'Failed to download this document. Please try again.' };
  }
}
