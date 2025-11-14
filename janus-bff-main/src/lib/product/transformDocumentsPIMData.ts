import { Document, DocumentList } from "@/lib/models/productModel";
import { Manual } from "@/lib/pim/productData";

export function transformDocuments(manuals: Manual[]): DocumentList[] {
  const grouped: Record<string, Document[]> = {};

  for (const manual of manuals) {
    const manualNum = manual.manualNumber;
    const language = manual.locale;
    const title = manual.title;

    if (!title) continue; // Skip if no title

    const activeDocs = manual.documents.filter(
      (doc) => doc.status && doc.documentInfo.length,
    );
    if (activeDocs.length === 0) continue; // Skip if no active documents

    activeDocs.forEach((doc) => {
      const rawPath = doc.documentInfo[0].damHierarchy;
      const filePath = rawPath.replace(/\./g, "/");

      const transformedDoc: Document = {
        language: language,
        filePath: `${filePath}/${doc.fileName}`,
        title: title,
      };

      if (!grouped[manualNum]) {
        grouped[manualNum] = [];
      }

      grouped[manualNum].push(transformedDoc);
    });
  }

  return Object.entries(grouped).map(([manualNum, Documents]) => ({
    manualNum,
    Documents,
  }));
}
