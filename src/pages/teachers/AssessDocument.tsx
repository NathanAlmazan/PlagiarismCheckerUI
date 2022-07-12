import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
// Animation
import { AnimatePresence, motion } from 'framer-motion';
import { analyzeDocument, getFileContentFromURL, getFileStorageData } from '../../util/GetRequests';
import { FileStorage } from '../../util/base';

const FileAnalyzer = React.lazy(() => import("../../components/FileUpload/FileAnalyzer"));
const LoadingOverlay = React.lazy(() => import("../../components/SuspenseLoader/LoadingOverlay"));

function AssessDocument() {
  const { fileUid, assignId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [fileData, setFileData] = useState<FileStorage>();
  const [textContent, setTextContent] = useState<string>("");
  const [similarContent, setSimilarContent] = useState<string>("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [similarParagraphs, setSimilarParagraphs] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [originality, setOriginality] = useState<number>(0);
  const [plagiarizedFile, setPlagiarizedFile] = useState<FileStorage | null>(null);

  useEffect(() => {
    if (fileUid) {
        getFileContentFromURL(fileUid).then(data => {
            setTextContent(state => data.message);
        }).catch(err => console.log(err));
    
        getFileStorageData(fileUid).then(data => {
            setFileData(state => data);
        }).catch(err => console.log(err));
    }
  }, [fileUid])

  useEffect(() => {
    if (fileData && assignId) {
        analyzeDocument(fileData.file_id, parseInt(assignId)).then(data => {
            if (data !== null) {
                setSources(data.similarSentences);
                setOriginality(100 - (data.cosineDistance * 100));
                setPlagiarizedFile(data.source ? data.source : null);
                setLoading(false);
            } else {
                getFileStorageData(fileData.fileUid).then(data => {
                    setOriginality(100 - (data.originalityScore * 100));
                    setLoading(false);
                }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));
    }
  }, [fileData, assignId])

  useEffect(() => {
    if (plagiarizedFile) {
        getFileContentFromURL(plagiarizedFile.fileUid).then(data => {
            setSimilarContent(state => data.message);
        }).catch(err => console.log(err));
    }
  }, [plagiarizedFile])


  useEffect(() => {
    if (!loading) {
        const lines: string[] = textContent.split(". ");

        setParagraphs(state => lines);
    }
  }, [textContent, loading]);

  //-------------------------------

   useEffect(() => {
    if (!loading) {
        const lines: string[] = similarContent.split(". ");

        setSimilarParagraphs(state => lines);
    }
  }, [similarContent, loading]);

  const checkSources = (sentence: string): boolean => {
    for (let j = 0; j < sources.length; j++) {
        const tests = sources[j].split(">");
        
        let count: number = 0;
        tests.forEach(t => {
            if (t.length > 2) {
                if (sentence.toLowerCase().search(t) !== -1) count++;
            }
        })

        if ((tests.length - count) < 5) return true;
    }

    return false;
  }

  return (
    <>
        <Helmet><title>Assess File</title></Helmet>
        <PageTitleWrapper>
            <PageHeader 
            title={fileData ? fileData.fileName : 'File ID'}
            subtitle="This panel will analyze your assignment's originality."
            />
        </PageTitleWrapper>
        <Container>
            <AnimatePresence exitBeforeEnter>
                <motion.div
                    key="analyze"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                >
                     <FileAnalyzer
                        paragraphs={paragraphs} 
                        originality={originality}
                        plagiarizedFile={plagiarizedFile ? plagiarizedFile.fileName : "None"}
                        fileName={fileData ? fileData.fileName : ""}
                        similarFileName={plagiarizedFile ? plagiarizedFile.fileName : undefined}
                        similarParagraphs={plagiarizedFile ? similarParagraphs : undefined}
                        totalWords={textContent.split(" ").length}
                        checkSources={checkSources}
                        teacher={true}
                    />
                </motion.div>
            </AnimatePresence>

        </Container>
        <LoadingOverlay open={loading} />
    </>
  )
}

export default AssessDocument