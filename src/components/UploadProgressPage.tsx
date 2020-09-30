import React from 'react'
import { FileProgress } from '../types/types'
import ProgressBar from './ProgressBar'

interface UploadProgressPageProps {
  files: FileProgress[]
}

const UploadProgressPage = ({ files }: UploadProgressPageProps) => {
  return (
    <>
      <h1 className="text-gray2 text-xl">Uploading...</h1>
      {files &&
        files?.length > 0 &&
        Array.from(files).map((file: FileProgress) => {
          return <ProgressBar key={file.name} file={file} />
        })}
    </>
  )
}

export default UploadProgressPage
