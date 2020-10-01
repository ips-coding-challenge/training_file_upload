import React from 'react'
import { FileProgress } from '../types/types'
import ProgressBarContainer from './ProgressBarContainer'

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
          return <ProgressBarContainer key={file.name} file={file} />
        })}
    </>
  )
}

export default UploadProgressPage
