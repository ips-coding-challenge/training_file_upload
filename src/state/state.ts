import { atom, atomFamily, selectorFamily } from 'recoil'

export const filesState = atom<any[]>({
  key: 'files',
  default: [],
})

export const progressSelector = selectorFamily({
  key: 'progress',
  get: (name) => ({ get }) => {
    const file: any = get(filesState).find((el: any) => el.name === name)
    if (file) {
      return { finished: file.finished, progress: file.progress }
    }
  },
})

export const fileUploadState = atomFamily({
  key: 'fileupload',
  default: () => ({
    name: '',
    progress: 0,
    finished: false,
  }),
})
