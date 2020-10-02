import React, { useEffect, useState } from 'react'
import FileUploaderPage from './components/FileUploaderPage'
import axios from 'axios'
import UploadProgressPage from './components/UploadProgressPage'
import UploadedPage from './components/UploadedPage'
import { useSetRecoilState } from 'recoil'
import { filesState } from './state/state'
import useSendFile from './hooks/useSendFile'

interface FileProgress {
  name: string
  progress: number
  src: any
}

function App() {
  const [appState, setAppState] = useState('idle')
  const setFilesState = useSetRecoilState(filesState)

  const {
    send,
    status,
    filesWithSrc,
    fileProgress,
    uploadedImages,
  } = useSendFile({
    provider: 'cloudinary',
    multiple: true,
    url: process.env.REACT_APP_CLOUDINARY_URL || '',
  })

  useEffect(() => {
    setFilesState(() => {
      return fileProgress
    })
  }, [fileProgress])

  useEffect(() => {
    setAppState(status)
  }, [status])

  const sendFiles = async (files: FileList) => {
    await send(files)
  }

  return (
    <div className="w-full min-h-screen flex items-center bg-light-gray p-2 md:p-0">
      <div
        className={`${
          appState === 'completed' ? 'md:w-containerBig' : 'md:w-container'
        } container mx-auto w-full flex flex-col justify-center items-center py-6 px-5 my-4 lg:my-0 bg-light-gray shadow-card rounded-card`}
      >
        {appState === 'idle' && <FileUploaderPage sendFiles={sendFiles} />}
        {appState === 'upload' && <UploadProgressPage files={filesWithSrc} />}
        {appState === 'completed' && (
          <UploadedPage uploadedImg={uploadedImages} />
        )}
      </div>
    </div>
  )
}

export default App
