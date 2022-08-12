import { TailSpin } from 'react-loader-spinner';

export default function LoadingModal() {
  return (
    <div className='loading-modal flex items-center justify-center w-screen h-screen'>
      <div className='loading-modal-content'>
        <TailSpin color='#000' />
      </div>
    </div>
  )
}