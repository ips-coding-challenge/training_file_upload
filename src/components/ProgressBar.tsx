import React from 'react'
import { useRecoilValue } from 'recoil'
import { progressSelector } from '../state/state'
import check from '../assets/check.svg'
import { motion } from 'framer-motion'
import { fadeInScale, fadeInSlide } from '../animations/fadeIn'

const ProgressBar = ({ file }: any) => {
  const fileProgress = useRecoilValue(progressSelector(file.name))

  return (
    <motion.div
      variants={fadeInScale}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      className="flex items-center w-full m-2"
    >
      <img className="h-12 w-12 rounded mr-4 object-cover" src={file.src} />
      <div className="flex flex-col w-full">
        <h1 className="text-gray4 mb-2">{file.name}</h1>

        <div className="relative w-full bg-gray4 h-2 rounded">
          {/* Progress */}
          <div
            style={{ width: `${fileProgress?.progress}%` }}
            className={`absolute top-0 bottom-0 ${
              !fileProgress?.finished ? 'bg-blue' : 'bg-green'
            } z-10 rounded`}
          ></div>
        </div>
      </div>
    </motion.div>
  )
}

export default React.memo(ProgressBar)
