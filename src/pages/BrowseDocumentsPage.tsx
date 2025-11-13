import { useMemo, useState } from "react";
import { DocumentCard } from "../components/DocumentCard";
import { Input, Select } from "../components/Input";
import { useData } from "../contexts/DataContext";
import type { Document } from "../types";

type SortOption = "newest" | "rating" | "priceLow" | "sales";

const sortDocuments = (documents: Document[], option: SortOption, salesMap: Map<string, number>) => {
  switch (option) {
    case "rating":
      return [...documents].sort(
        (a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0)
      );
    case "priceLow":
      return [...documents].sort((a, b) => a.priceNOK - b.priceNOK);
    case "sales":
      return [...documents].sort(
        (a, b) => (salesMap.get(b.id) ?? 0) - (salesMap.get(a.id) ?? 0)
      );
    case "newest":
    default:
      return [...documents].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
};

export const BrowseDocumentsPage = () => {
  const { documents, getSalesCountForDocument } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const options = useMemo(() => {
    const universities = Array.from(new Set(documents.map((doc) => doc.university))).sort();
    const subjects = Array.from(new Set(documents.map((doc) => doc.subject))).sort();
    const types = Array.from(new Set(documents.map((doc) => doc.type))).sort();
    const countries = Array.from(new Set(documents.map((doc) => doc.country))).sort();
    return { universities, subjects, types, countries };
  }, [documents]);

  const salesMap = useMemo(() => {
    const map = new Map<string, number>();
    documents.forEach((doc) => {
      map.set(doc.id, getSalesCountForDocument(doc.id));
    });
    return map;
  }, [documents, getSalesCountForDocument]);

  const filteredDocuments = useMemo(() => {
    let next = documents;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      next = next.filter(
        (document) =>
          document.title.toLowerCase().includes(term) ||
          document.description.toLowerCase().includes(term) ||
          document.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          document.courseCode.toLowerCase().includes(term)
      );
    }

    if (selectedUniversity) {
      next = next.filter((document) => document.university === selectedUniversity);
    }

    if (selectedCountry) {
      next = next.filter((document) => document.country === selectedCountry);
    }

    if (selectedSubject) {
      next = next.filter((document) => document.subject === selectedSubject);
    }

    if (selectedType) {
      next = next.filter((document) => document.type === selectedType);
    }

    return sortDocuments(next, sortOption, salesMap);
  }, [
    documents,
    salesMap,
    searchTerm,
    selectedUniversity,
    selectedCountry,
    selectedSubject,
    selectedType,
    sortOption
  ]);

  return (
    <div className="section">
      <div className="container">
        <header className="browse-header">
          <div>
            <h1>Finn notater og eksamensbesvarelser</h1>
            <p>Filtrer på universitet, fag og type dokument. Alt er laget av studenter for studenter.</p>
          </div>
        </header>

        <div className="browse-filters card">
          <Input
            label="Søk"
            placeholder="Søk etter tittel, emnekode eller nøkkelord"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            fullWidth
          />
          <div className="browse-filters__grid">
            <Select
              label="Universitet"
              value={selectedUniversity}
              onChange={(event) => setSelectedUniversity(event.target.value)}
            >
              <option value="">Alle</option>
              {options.universities.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </Select>

            <Select
              label="Land"
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
            >
              <option value="">Alle</option>
              {options.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>

            <Select
              label="Fag / emne"
              value={selectedSubject}
              onChange={(event) => setSelectedSubject(event.target.value)}
            >
              <option value="">Alle</option>
              {options.subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>

            <Select
              label="Type"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="">Alle</option>
              {options.types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <Select
            label="Sorter etter"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value as SortOption)}
          >
            <option value="newest">Nyeste</option>
            <option value="rating">Best vurdert</option>
            <option value="sales">Mest solgt</option>
            <option value="priceLow">Laveste pris</option>
          </Select>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="card">
            <h3>Ingen treff</h3>
            <p>
              Juster filtrene dine eller søk etter et annet fag. Husk at dette er en demo med seed-data.
            </p>
          </div>
        ) : (
          <div className="browse-grid">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

