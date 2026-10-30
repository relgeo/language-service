import type { Diagnostic } from 'vscode-languageserver-types';
import type { RelGeoSemanticLine } from './tokens';

export const LANGUAGE_SERVICE_PROTOCOL_VERSION = '0.1';

export interface DocumentAnalysisRequest {
  documentId: string;
  version: number;
  requestId: number;
  code: string;
}

export interface DocumentAnalysisResult {
  protocolVersion: typeof LANGUAGE_SERVICE_PROTOCOL_VERSION;
  documentId: string;
  version: number;
  requestId: number;
  diagnostics: Diagnostic[];
  semanticTokens: RelGeoSemanticLine[];
}

export interface CurrentDocumentAnalysisIdentity {
  documentId: string;
  version: number;
  requestId: number;
}

/** Exact identity match is the host-safe acceptance rule for a response. */
export function isCurrentDocumentAnalysis(
  result: Pick<DocumentAnalysisResult, 'documentId' | 'version' | 'requestId'>,
  current: CurrentDocumentAnalysisIdentity,
): boolean {
  return result.documentId === current.documentId
    && result.version === current.version
    && result.requestId === current.requestId;
}

export function isStaleDocumentAnalysis(
  result: Pick<DocumentAnalysisResult, 'documentId' | 'version' | 'requestId'>,
  current: CurrentDocumentAnalysisIdentity,
): boolean {
  return !isCurrentDocumentAnalysis(result, current);
}
