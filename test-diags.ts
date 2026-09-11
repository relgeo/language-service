import { RelGeoLanguageService } from './src/service';
const svc = new RelGeoLanguageService();
const code = `version: "0.3"
objects:
  missingLine:
    type: line
`;
console.log(svc.getDiagnostics(code));
