import React, { useState } from 'react'
import axios from 'axios'

interface FileWithSrc {
  name: string
  progress: number
  src: any
}

interface UseSendFileProps {
  provider: string
  multiple: boolean
  url: string
}

const useSendFile = ({ provider, multiple, url }: UseSendFileProps) => {
  // ['idle', 'loading', 'completed']
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState(null)
  const [filesWithSrc, setFilesWithSrc] = useState<FileWithSrc[]>([])
  const [fileProgress, setFileProgress] = useState<any[]>([])
  const [uploadedImages, setUploadedImages] = useState([])

  const extractUrl = (file: any) =>
    new Promise((resolve) => {
      let src
      const reader = new FileReader()
      reader.onload = (e: any) => {
        src = e.target.result
        resolve(src)
      }
      reader.readAsDataURL(file)
    })

  const send = async (files: FileList) => {
    let filesProgress: FileWithSrc[] = []
    for (const file of Array.from(files)) {
      const src: any = await extractUrl(file)
      filesProgress.push({
        name: file.name,
        progress: 0,
        src: src,
      })
    }
    setFilesWithSrc(filesProgress)
    setStatus('upload')
    uploadFiles(files)
  }

  const createFormData = (file: any) => {
    const formData = new FormData()
    formData.append('file', file)

    if (provider === 'cloudinary') {
      if (
        !process.env.REACT_APP_CLOUDINARY_URL ||
        !process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET
      ) {
        throw Error('You should add the environment variables')
      }
      formData.append(
        'upload_preset',
        process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET
      )
      formData.append('folder', 'challenge')
    }
    if (multiple) {
      formData.append('multiple', 'true')
    }
    return formData
  }

  const uploadFiles = async (files: FileList) => {
    try {
      let requests = []

      for (const file of Array.from(files)) {
        const formData = createFormData(file)
        const sendRequest = axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e: ProgressEvent<EventTarget>) => {
            setFileProgress((old) => {
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
          },
          onDownloadProgress: (e: ProgressEvent<EventTarget>) => {
            setFileProgress((old: any) => {
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
        })

        requests.push(sendRequest)
      }

      const responses = await axios.all(requests)
      responses.forEach((res) => {
        setUploadedImages((old) => old.concat(res.data.secure_url))
        // setUploadedImg((old) => old.concat(res.data.secure_url))
      })
      setTimeout(() => {
        // setAppState('completed')
        setStatus('completed')
      }, 500)
    } catch (e) {
      console.log('Error', e)
    }
  }

  const onUploadProgress = (file: any, e: ProgressEvent<EventTarget>) => {
    return {
      file,
      e,
    }
  }
  const onDownloadProgress = (file: any, e: ProgressEvent<EventTarget>) => {
    return {
      file,
      e,
    }
  }

  return {
    send,
    filesWithSrc,
    status,
    errors,
    uploadedImages,
    fileProgress,
  }
}

export default useSendFile
