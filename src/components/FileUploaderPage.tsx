import React, { useRef, useState } from 'react'
import uploadImage from '../assets/image.svg'
import mime from 'mime-types'
import { motion } from 'framer-motion'
import { fadeInSlide } from '../animations/fadeIn'

interface FileUploaderProps {
  sendFiles: (files: FileList) => void
}

const FileUploaderPage = ({ sendFiles }: FileUploaderProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const format = ['image/jpeg', 'image/jpg', 'image/png']
  const [errors, setErrors] = useState<string[]>([])

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (ref && ref.current && !ref.current.classList.contains('active')) {
      ref.current.classList.add('active')
    }
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (ref && ref.current && e.target === ref.current) {
      ref.current.classList.remove('active')
    }
  }

  const onDropFile = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const isValid = (files: FileList): Boolean => {
    let hasErrors = []

    if (files.length > 3) {
      hasErrors.push('You can only upload 3 images at the same time')
      setErrors(hasErrors)
      return false
    }

    for (const file of Array.from(files)) {
      const lookup = mime.lookup(file.name)
      if (!lookup) {
        // Error
        hasErrors.push('Invalid file')
        continue
      }
      if (lookup && !format.includes(lookup)) {
        hasErrors.push('Invalid file')
        continue
      }

      if (lookup && format.includes(lookup)) {
        if (Math.round(file.size / 1024 / 1024) > 5) {
          hasErrors.push('Your image is too big, it should be less thant 5mb')
        }
      }
    }
    if (hasErrors.length > 0) {
      setErrors(hasErrors)
    }
    return hasErrors.length === 0
  }

  const handleFiles = async (files: FileList) => {
    if (!isValid(files)) {
      return
    }

    sendFiles(files)
  }

  return (
    <motion.div
      variants={fadeInSlide}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl text-gray2 mb-4">Upload your images</h1>
      <h3 className="text-sm text-gray3 mb-4">
        Files should be jpg, jpeg or png
      </h3>
      {errors.length > 0 && (
        <ul className="bg-danger w-full rounded text-white text-center text-sm py-2 mb-4">
          {errors.map((error: string) => (
            <li>{error}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-col w-full justify-center items-center">
        {/* Drag & drop Uploader */}
        <div
          ref={ref}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDropFile}
          className="flex flex-col w-full mb-4 justify-center items-center border border-blue border-dashed rounded-card bg-light-blue p-8"
        >
          <img
            className="mb-6 pointer-events-none"
            src={uploadImage}
            alt="upload"
          />

          <h3 className="text-sm text-gray4 pointer-events-none">
            Drag & Drop your image here
          </h3>
          <span className="text-xs text-gray4">( Maximum 3 )</span>
        </div>

        <p className="text-gray4 mb-4">or</p>
        <label className="btn btn-primary" htmlFor="file">
          Choose files
          <input
            className="hidden"
            type="file"
            id="file"
            onChange={onInputChange}
            multiple
          />
        </label>
      </div>
    </motion.div>
  )
}

export default FileUploaderPage
