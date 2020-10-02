import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import useSendFile from '../hooks/useSendFile'
import { progressSelector } from '../state/state'

interface ProgressBarProps {
  name: string
}
const ProgressBar = ({ name }: ProgressBarProps) => {
  const file = useRecoilValue(progressSelector(name))

  return (
    <div
      style={{ width: `${file?.progress}%` }}
      className={`absolute top-0 bottom-0 ${
        !file?.finished ? 'bg-blue' : 'bg-green'
      } z-10 rounded`}
    ></div>
  )
}

export default React.memo(ProgressBar)
