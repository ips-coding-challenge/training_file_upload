import React, { useState } from 'react'
import axios from 'axios'
import { FileWithSrc } from '../types/types'

interface UseSendFileProps {
  provider: string
  multiple: boolean
  url: string
  onUploadProgress: (file: any, e: ProgressEvent<EventTarget>) => void
  onDownloadProgress: (file: any, e: ProgressEvent<EventTarget>) => void
}

const useSendFile = ({
  provider,
  multiple,
  url,
  onUploadProgress,
  onDownloadProgress,
}: UseSendFileProps) => {
  // ['idle', 'loading', 'completed']
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState(null)
  const [filesWithSrc, setFilesWithSrc] = useState<FileWithSrc[]>([])
  const [uploadedImages, setUploadedImages] = useState([])

  /**
   * Extract the url to show the thumbnail image
   * @param file
   */
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

  /**
   * Send the files
   * @param files
   */
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

  /**
   * Create the formData for different provider
   * @param file
   */
  const createFormData = (file: any) => {
    const formData = new FormData()
    formData.append('file', file)

    if (provider === 'cloudinary') {
      if (!process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET) {
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

  /**
   * Create the requests with the upload/download listeners
   * @param files
   */
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
            onUploadProgress(file, e)
          },
          onDownloadProgress: (e: ProgressEvent<EventTarget>) => {
            onDownloadProgress(file, e)
          },
        })

        requests.push(sendRequest)
      }

      const responses = await axios.all(requests)
      responses.forEach((res) => {
        setUploadedImages((old) => old.concat(res.data.secure_url))
      })
      setTimeout(() => {
        setStatus('completed')
      }, 500)
    } catch (e) {
      console.log('Error', e)
      setErrors(e.message)
    }
  }

  return {
    send,
    filesWithSrc,
    status,
    errors,
    uploadedImages,
  }
}

export default useSendFile
