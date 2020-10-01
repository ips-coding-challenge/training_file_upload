import React, { useState } from 'react'
import FileUploaderPage from './components/FileUploaderPage'
import axios from 'axios'
import UploadProgressPage from './components/UploadProgressPage'
import UploadedPage from './components/UploadedPage'
import { useSetRecoilState } from 'recoil'
import { filesState } from './state/state'

interface FileProgress {
  name: string
  progress: number
  src: any
}

function App() {
  // App state to show different component (idle, upload, completed)
  const [appState, setAppState] = useState('idle')
  const [files, setFiles] = useState<FileProgress[]>([])
  const [uploadedImg, setUploadedImg] = useState([])
  const setFilesState = useSetRecoilState(filesState)

  const extractUrl = (file: any) =>
    new Promise((resolve, reject) => {
      let src
      const reader = new FileReader()
      reader.onload = (e: any) => {
        src = e.target.result
        resolve(src)
      }
      reader.readAsDataURL(file)
    })

  const sendFiles = async (files: FileList) => {
    if (
      !process.env.REACT_APP_CLOUDINARY_URL ||
      !process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET
    ) {
      throw Error('You should add the environment variables')
    }

    let filesProgress: FileProgress[] = []

    for (const file of Array.from(files)) {
      const src: any = await extractUrl(file)
      filesProgress.push({
        name: file.name,
        progress: 0,
        src: src,
      })
    }

    setFiles(filesProgress)
    setAppState('upload')
    try {
      let requests = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append(
          'upload_preset',
          process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET
        )
        formData.append('multiple', 'true')
        formData.append('folder', 'challenge')

        const sendRequest = axios.post(
          process.env.REACT_APP_CLOUDINARY_URL,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e: ProgressEvent<EventTarget>) => {
              setFilesState((old: any) => {
                const index = old.findIndex((el: any) => el.name === file.name)

                if (index > -1) {
                  const newList = [...old]
                  newList[index] = {
                    ...newList[index],
                    progress: Math.floor((e.loaded / e.total) * 100),
                  }
                  return newList
                } else {
                  return old.concat({
                    name: file.name,
                    progress: Math.floor((e.loaded / e.total) * 100),
                    finished: false,
                  })
                }
              })
            },
            onDownloadProgress: (e: ProgressEvent<EventTarget>) => {
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
            },
          }
        )

        requests.push(sendRequest)
      }

      const responses = await axios.all(requests)
      responses.forEach((res) => {
        setUploadedImg((old) => old.concat(res.data.secure_url))
      })
      setTimeout(() => {
        setAppState('completed')
      }, 500)
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
