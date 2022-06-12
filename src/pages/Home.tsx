import React, { useState, useEffect } from 'react';
// Components
import LoadingOverlay from "../components/SuspenseLoader/LoadingOverlay";
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from "../components/PageTitleWrapper";
import PageHeader from "../components/PageHeaders/Header";
// Utils
import { noCase } from 'change-case';
import { analyzeDocument, getFilePlainContent, submitPDF, deleteDocument } from '../util/GetRequests';
// Animation
import { AnimatePresence, motion } from 'framer-motion';

const UploadFile = React.lazy(() => import("../components/FileUpload/Upload"));
const FileAnalyzer = React.lazy(() => import("../components/FileUpload/FileAnalyzer"));

type FileInformation = {
  fileId: number, 
  fileUid: string
}

function Home() {
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [textContent, setTextContent] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<boolean>(true);
  const [plagiarized, setPlagiarized] = useState<boolean>(false);
  const [originality, setOriginality] = useState<number>(0);
  const [plagiarizedFile, setPlagiarizedFile] = useState<string>();
  const [fileInfo, setFileInfo] = useState<FileInformation>();

  useEffect(() => {
    const lines: string[] = textContent.split("\r\n");

    let pars: string[] = [];
    let paragraph = "";
    lines.forEach(line => {
      let sentence = line.split('. ');
      if (/\S/.test(sentence[sentence.length - 1]) === false) {
          paragraph += line;
          pars.push(paragraph);
          paragraph = "";
      } else {
          if (paragraph.charAt(paragraph.length - 1) === ' ' || line.charAt(0) === ' ') {
            paragraph += line;
          } else paragraph += ` ${line}`;
      }
    });

    setParagraphs(state => pars);
  }, [textContent]);

  const checkSources = (sentence: string): boolean => {
    for (let j = 0; j < sources.length; j++) {
        const test = sources[j].split(">").filter(t => /\S/.test(t));
    
        const words = sentence.split(" ").filter(t => /\S/.test(t));
        for (let x = 0; x < words.length; x++) {
            if (!test[0]) break;
            else {
                if (test[0] === noCase(words[x]).replace(/\s/g, '')) test.shift();
            }
        }
        
        if (test.length === 0) return true;
    }

    return false;
  }
  const handleFileChange = (file: File) => setDocument(file);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploaded(false);
    if (document !== null) {
      try {
        const uploaded = await submitPDF(document);
        const cosineDistance = await analyzeDocument(uploaded.file_id);
        setFileInfo({ fileId: uploaded.file_id, fileUid: uploaded.fileUid });
        setUploaded(true);

        if (cosineDistance !== null) {
          const textContent = await getFilePlainContent(document);

          setSources(cosineDistance.sentencesA);
          setTextContent(textContent.message);
          setPlagiarizedFile(cosineDistance.source);
          setOriginality(100 - (cosineDistance.cosineDistance * 100));
          setPlagiarized(true);
        } else {
          setPlagiarized(false);
        }

      } catch (e) {
        console.log((e as Error).message);
      }
    }
  }

  const reloadPage = async () => {
    setUploaded(false);
    if (fileInfo) await deleteDocument(fileInfo.fileId, fileInfo.fileUid);
    setUploaded(true);
    window.location.reload();
  }

  return (
    <>
      <Helmet><title>Upload File</title></Helmet>
      <PageTitleWrapper>
        <PageHeader 
          title='Assignment Title'
          subtitle="This panel will analyze your assignment's originality."
        />
      </PageTitleWrapper>
     
      <AnimatePresence exitBeforeEnter>
        {plagiarized ? (
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
              plagiarizedFile={plagiarizedFile ? plagiarizedFile : ""}
              fileName={document ? document.name : ""}
              totalWords={textContent.split(" ").length}
              checkSources={checkSources} 
              reloadPage={reloadPage}
            />
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <UploadFile 
              fileName={document ? document.name : null} 
              submitFile={handleFileChange}
              submitForm={handleSubmit} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <LoadingOverlay open={!uploaded} />
        {/* <section>
          <form onSubmit={handleSubmit}>
            <input type="number" placeholder="Document ID" value={documentId} onChange={handleTextChange} />
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Analyze Document</button>
          </form>
        </section>
        {fileName.length > 0 && (
          <h3>{"Copied from: " + fileName + ".pdf"}</h3>
        )}
        <section>
          {paragraphs.map((text, i) => {
              const sentences = text.split('. ');

              return (
                  <p key={i}>
                      {sentences.map((sentence, i) => (
                          checkSources(sentence) ? <span key={i} style={{ backgroundColor: 'red' }}>{sentence + '. '}</span> :
                          <span key={i}>{/\S/.test(sentence) && sentence + '. '}</span>
                      ))}
                  </p>
              )
          })}
        </section> */}
    </>
  )
}

export default Home