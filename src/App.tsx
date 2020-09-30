import React, { useState } from 'react'
import FileUploaderPage from './components/FileUploaderPage'
import axios from 'axios'
import UploadProgressPage from './components/UploadProgressPage'
import UploadedPage from './components/UploadedPage'

interface FileProgress {
  name: string
  progress: number
}

function App() {
  // App state to show different component (idle, upload, completed)
  const [appState, setAppState] = useState('idle')
  const [files, setFiles] = useState<FileProgress[]>([])
  const [uploadedImg, setUploadedImg] = useState([
    // 'https://res.cloudinary.com/trucmachin/image/upload/v1601481646/challenge/g9bktvtg9dklxriugq8a.png',
    // 'https://res.cloudinary.com/trucmachin/image/upload/v1601481441/challenge/ezizsvwcr6vr6byhhwfc.jpg',
    // 'https://res.cloudinary.com/trucmachin/image/upload/v1601481441/challenge/ezizsvwcr6vr6byhhwfc.jpg',
  ])

  const sendFiles = async (files: FileList) => {
    if (
      !process.env.REACT_APP_CLOUDINARY_URL ||
      !process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET
    ) {
      throw Error('You should add the environment variables')
    }
    let filesProgress: FileProgress[] = Array.from(files).map((file: File) => {
      return {
        name: file.name,
        progress: 0,
      }
    })
    setFiles(filesProgress)
    setAppState('upload')
    try {
      const formData = new FormData()
      for (const file of Array.from(files)) {
        formData.append('file', file)
        formData.append(
          'upload_preset',
          process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET
        )
        formData.append('multiple', 'true')
        formData.append('folder', 'challenge')
        const res = await axios.post(
          process.env.REACT_APP_CLOUDINARY_URL,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e: ProgressEvent<EventTarget>) => {
              console.log('Progress event', e)
              setFiles((old) => {
                const newOne = [...old]
                const index = old.findIndex((f) => f.name === file.name)
                if (index > -1) {
                  newOne[index].progress = Math.floor(
                    (e.loaded / e.total) * 100
                  )
                }
                return newOne
              })
            },
          }
        )

        setUploadedImg((old) => old.concat(res.data.secure_url))
      }
      setAppState('completed')
    } catch (e) {
      console.log('Error', e)
    }
  }
  return (
    <div className="w-full min-h-screen flex items-center bg-light-gray p-2 md:p-0">
      <div
        className={`${
          appState === 'completed' ? 'md:w-containerBig' : 'md:w-container'
        } container mx-auto w-full flex flex-col justify-center items-center py-6 px-5 my-4 lg:my-0 bg-light-gray shadow-card rounded-card`}
      >
        {appState === 'idle' && <FileUploaderPage sendFiles={sendFiles} />}
        {appState === 'upload' && <UploadProgressPage files={files} />}
        {appState === 'completed' && <UploadedPage uploadedImg={uploadedImg} />}
      </div>
    </div>
  )
}

export default App
