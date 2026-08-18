// Shared Gemini client construction for api/explore.ts and api/critique.ts.
//
// Supports two auth modes, chosen via GOOGLE_GENAI_USE_VERTEXAI:
//  - Vertex AI + Application Default Credentials (ADC): no API key in env,
//    google-auth-library resolves credentials from `gcloud auth application-
//    default login` locally, or a service account key in prod (see
//    GOOGLE_APPLICATION_CREDENTIALS / GOOGLE_APPLICATION_CREDENTIALS_JSON
//    below). Requires a GCP project with the Vertex AI API + billing enabled.
//  - GEMINI_API_KEY (the default when GOOGLE_GENAI_USE_VERTEXAI is unset):
//    keys minted from Google Cloud Console's Vertex AI "Express Mode" flow
//    are bound to a service account and only usable via the Vertex backend,
//    so this path always sets vertexai:true. Plain Gemini Developer API keys
//    from aistudio.google.com/apikey are also accepted here — passing
//    vertexai:true with one of those is a no-op, the SDK falls back to the
//    Developer API backend for non-Express keys.

import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// Vercel serverless functions can't accept a file upload as a secret, so a
// service account JSON key (for Vertex AI + ADC in production) is stored as
// the *contents* of an env var and written to a temp file on cold start,
// then pointed to via GOOGLE_APPLICATION_CREDENTIALS for google-auth-library
// to pick up automatically.
let credentialsFilePrepared = false;
function prepareServiceAccountCredentials(): void {
  if (credentialsFilePrepared) return;
  credentialsFilePrepared = true;
  const json = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!json || process.env.GOOGLE_APPLICATION_CREDENTIALS) return;
  const path = join(tmpdir(), 'gcp-service-account.json');
  writeFileSync(path, json, { mode: 0o600 });
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path;
}

export function createGenAIClient(): { client: GoogleGenAI } | { error: string } {
  const useVertex = process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true';

  if (useVertex) {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    if (!project) {
      return { error: 'GOOGLE_CLOUD_PROJECT is not configured on the server (required for Vertex AI + ADC)' };
    }
    prepareServiceAccountCredentials();
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    return { client: new GoogleGenAI({ vertexai: true, project, location }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      error:
        'GEMINI_API_KEY is not configured on the server (or set GOOGLE_GENAI_USE_VERTEXAI=true with ' +
        'GOOGLE_CLOUD_PROJECT to use Vertex AI + ADC instead)'
    };
  }
  return { client: new GoogleGenAI({ vertexai: true, apiKey }) };
}
