import { Document, DocumentList } from "@/lib/models/productModel";

export const isMatchingLocale = (document: Document, locale: string): boolean =>
  document.language === locale;

export const isMatchingLocaleLanguageOnly = (
  document: Document,
  locale: string,
): boolean => document.language.slice(0, 2) === locale.slice(0, 2);

export function getLocaleDocuments(
  documents: DocumentList[],
  locale: string,
): DocumentList[] {
  let documentsInLocale = documents.filter((doc) =>
    doc.Documents.some((document) => isMatchingLocale(document, locale)),
  );
  if (documentsInLocale.length === 0) {
    documentsInLocale = documents.filter((doc) =>
      doc.Documents.some((document) =>
        isMatchingLocaleLanguageOnly(document, locale),
      ),
    );
  }

  return documentsInLocale;
}
