import React, { useEffect, useState } from 'react'
import FileUploaderPage from './components/FileUploaderPage'
import axios from 'axios'
import UploadProgressPage from './components/UploadProgressPage'
import UploadedPage from './components/UploadedPage'
import { useSetRecoilState } from 'recoil'
import { filesState } from './state/state'
import useSendFile from './hooks/useSendFile'

function App() {
  const [appState, setAppState] = useState('idle')
  const setFilesState = useSetRecoilState(filesState)

  /**
   * Callback called by the hook to update the progress of a file
   * @param file
   * @param e
   */
  const onUploadProgress = (file: any, e: ProgressEvent<EventTarget>) => {
    setFilesState((old) => {
      const index = old.findIndex((el: any) => el.name === file.name)
      if (index > -1) {
        const updated = [...old]
        updated[index] = {
          ...updated[index],
          progress: Math.floor((e.loaded / e.total) * 100),
        }
        return updated
      } else {
        return old.concat({
          name: file.name,
          progress: Math.floor(e.loaded / e.total / 100),
          finished: false,
        })
      }
    })
  }
  /**
   * Callback called by the hook to update the completion of a file
   * @param file
   * @param e
   */
  const onDownloadProgress = (file: any, e: ProgressEvent<EventTarget>) => {
    setFilesState((old: any) => {
      const index = old.findIndex((el: any) => el.name === file.name)
      if (index > -1) {
        const newList = [...old]
        newList[index] = {
          ...newList[index],
          progress: 100,
          finished: true,
        }
        return newList
      }
      return old
    })
  }

  //Hook in charge of sending the files
  const { send, status, filesWithSrc, uploadedImages } = useSendFile({
    provider: process.env.PROVIDER || 'cloudinary',
    multiple: true,
    url: process.env.REACT_APP_CLOUDINARY_URL || '',
    onUploadProgress,
    onDownloadProgress,
  })

  /**
   * Update the app status to display the different steps
   */
  useEffect(() => {
    setAppState(status)
  }, [status])

  /**
   * Send the files
   * @param files
   */
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
