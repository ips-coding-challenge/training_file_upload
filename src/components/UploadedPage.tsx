import React, { useState } from 'react'
import check from '../assets/check.svg'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface UploadedPageProps {
  uploadedImg: string[]
}

const UploadedPage = ({ uploadedImg }: UploadedPageProps) => {
  const [copied, setCopied] = useState<string>('')

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
  }
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <img src={check} alt="check icon" />
      <h1 className="text-2xl text-gray2 mb-4">Uploaded successfully!</h1>
      {uploadedImg.length > 0 &&
        uploadedImg.map((url, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row my-2 w-full items-center"
          >
            <LazyLoadImage
              style={{ minWidth: '150px' }}
              className=" w-full object-cover md:w-24 rounded-card h-32 md:mr-10"
              alt="uploaded"
              effect="blur"
              src={url}
            />
            <div className="flex h-12 rounded-lg w-full border border-gray4 px-2 my-4 bg-gray5">
              <input
                className="flex-auto truncate ... text-xs text-gray2 bg-transparent mr-2"
                type="text"
                onChange={() => {}}
                value={url}
              />
              <button
                className={`${
                  copied === url ? 'btn btn-success' : 'btn btn-primary'
                } text-xs my-1`}
                onClick={(e) => copyToClipboard(url)}
              >
                {copied === url ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default UploadedPage
