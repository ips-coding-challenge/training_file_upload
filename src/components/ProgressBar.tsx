import React from 'react'

const ProgressBar = ({ file }: any) => {
  return (
    <div className="w-full m-2">
      <h1 className="text-gray4 mb-2">{file.name}</h1>
      <div className="relative w-full bg-gray4 h-2 rounded">
        {/* Progress */}
        <div
          style={{ width: `${file.progress}%` }}
          className="absolute top-0 bottom-0 bg-blue z-10 rounded"
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
