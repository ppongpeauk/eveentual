import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet'

// import contexts
import { useStore } from '../contexts/StoreContext'

// import components
import { toast } from 'react-toastify'

export default function Create() {
  const [busy, setBusy] = useState(false);
  const { generateParty } = useStore();
  const [randomId, setRandomId] = useState('');
  let navigate = useNavigate();

  // refs
  const partyCreatorNameRef = useRef(null);

  const partyNameRef = useRef(null);
  const partyDescriptionRef = useRef(null);
  const partyDateRef = useRef(null);
  const partyTimeRef = useRef(null);
  const partyLocationRef = useRef(null);
  const partyMaxSizeRef = useRef(null);

  function createParty(e) {
    e.preventDefault();
    if (busy) // don't proceed if a party is already in the progress of being created
      return;
    // check fields if they're valid
    if (partyCreatorNameRef.current.value.trim() === '') {
      toast.error('Please enter a name for the event host.');
      return;
    }
    if (partyNameRef.current.value.trim() === '') {
      toast.error('Please enter a name for the event.');
      return;
    }
    if (partyDescriptionRef.current.value.trim().length > 1024) {
      toast.error('Please enter a description less than 1024 characters.');
      return;
    }
    if (partyDateRef.current.value.trim() === '') {
      toast.error('Please enter a date for the event.');
      return;
    }
    if (partyTimeRef.current.value.trim() === '') {
      toast.error('Please enter a time for the event.');
      return;
    }
    if (partyLocationRef.current.value.trim() === '') {
      toast.error('Please enter a location for the event.');
      return;
    }
    if (partyMaxSizeRef.current.value.trim() === '') {
      toast.error('Please enter a max size for the event.');
      return;
    }
    if (partyMaxSizeRef.current.value.trim() <= 1) {
      toast.error('Please enter a max party size greater than 1.');
      return;
    }
    // create party
    setBusy(true);
    const loadingToast = toast.loading('Joining event...');
    setTimeout(async () => {
      await generateParty({
        partyName: partyNameRef.current.value.trim(),
        partyDescription: partyDescriptionRef.current.value.trim().length > 0 ? partyDescriptionRef.current.value.trim() : 'No description provided.',
        partyDate: partyDateRef.current.value.trim(),
        partyTime: partyTimeRef.current.value.trim(),
        partyLocation: partyLocationRef.current.value.trim(),
        partyCreator: partyCreatorNameRef.current.value.trim(),
        partyMaxSize: partyMaxSizeRef.current.value.trim(),
        partyMembers: {
          [partyCreatorNameRef.current.value.trim()]: {
            name: partyCreatorNameRef.current.value.trim(),
            isHost: true
          }
        }
      }).then((result) => {
        if (result) {
          toast.update(loadingToast, { render: 'Successfully created an event.', type: 'success', isLoading: false, autoClose: 5000, closeButton: true, closeOnClick: true });
          navigate(`/event/${result}`)
        } else {
          toast.update(loadingToast, { render: 'Failed to create an event.', type: 'error', isLoading: false, autoClose: 5000, closeButton: true, closeOnClick: true });
        }
      }).finally(() => {
        setBusy(false);;
      });
    }, 1000);
  }

  return (
    <main className='flex flex-col place-items-center p-8 pt-20 mb-24 lg:mb-0'>
      <Helmet>
        <title>Create</title>
      </Helmet>
      <div className='py-4 px-8 m-2 border rounded-[16px] shadow-lg grow lg:grow-0 h-full'>
        <h1><strong>Create Event</strong></h1>
        <form>
          <div className='input-group py-0.5 w-72'>
            <label>
              Event Name:
              <div />
              <input type='text' className='mt-1 w-full' ref={partyNameRef} />
            </label>
          </div>
          <div className='input-group py-0.5 w-72'>
            <label>
              Event Host:
              <div />
              <input type='name' className='mt-1 w-full' ref={partyCreatorNameRef} />
            </label>
          </div>
          <div className='input-group py-0.5 w-72'>
            <label>
              Event Location:
              <div />
              <input type='name' className='mt-1 w-full' ref={partyLocationRef} />
            </label>
          </div>
          <div className='input-group py-0.5 w-72'>
            <label>
              Event Max Size:
              <div />
              <input type='number' className='mt-1 w-full' ref={partyMaxSizeRef} />
            </label>
          </div>
          <div className='input-group py-0.5 w-72'>
            <label>
              Event Description:
              <div />
              <textarea type='text' className='mt-1 w-full' ref={partyDescriptionRef} />
            </label>
          </div>
          <div className='input-group flex row place-content-between py-0.5 w-72'>
            <label className='w-[45%]'>
              Event Date:
              <div />
              <input type='date' className='mt-1 w-full' ref={partyDateRef} />
            </label>
            <label className='w-[45%]'>
              Event Time:
              <div />
              <input type='time' className='mt-1 w-full' ref={partyTimeRef} />
            </label>
          </div>
          <div />
          <button className='px-4 my-2 w-full h-12' onClick={createParty} disabled={busy}>Create Event</button>
        </form>
      </div>
    </main>
  )
}