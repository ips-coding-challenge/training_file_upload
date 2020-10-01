import React from 'react'

const ProgressBar = ({ file }: any) => {
  return (
    <div className="flex items-center w-full m-2">
      <img className="h-12 w-12 rounded mr-4 object-cover" src={file.src} />
      <div className="flex flex-col w-full">
        <h1 className="text-gray4 mb-2">{file.name}</h1>
        <div className="relative w-full bg-gray4 h-2 rounded">
          {/* Progress */}
          <div
            style={{ width: `${file.progress}%` }}
            className="absolute top-0 bottom-0 bg-blue z-10 rounded"
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
