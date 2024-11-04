/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documents, setDocuments] = useState([]);

    return (
        <DocumentContext.Provider value={{ selectedDocument, setSelectedDocument, documents, setDocuments }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocument = () => {
    return useContext(DocumentContext);
};

