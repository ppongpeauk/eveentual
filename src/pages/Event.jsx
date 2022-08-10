import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// contexts
import { useStore } from '../contexts/StoreContext';

// components
import { toast } from 'react-toastify'
import ErrorIcon from '@mui/icons-material/Error';

import moment from 'moment';

export default function Event() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [party, setParty] = useState(false);
  const { getParty, joinParty } = useStore();
  const [partyRemainingSpace, setPartyRemainingSpace] = useState(0);

  // refs
  const filterNameRef = useRef();
  const memberNameRef = useRef();

  const [filteredMemberList, setFilteredMemberList] = useState({});

  // search filter
  function onSearchFilterChange() {
    let filteredArray = {};
    if (!filterNameRef || filterNameRef.current.value === '') {
      setFilteredMemberList(party.partyMembers);
      return;
    }
    Object.keys(party.partyMembers).map(member => {
      if (member.toLowerCase().includes(filterNameRef.current.value.toLowerCase())) {
        filteredArray[member] = party.partyMembers[member];
      }
    });
    setFilteredMemberList(filteredArray);
    console.log(party.partyMembers)
  }

  // main join handler
  function joinEvent(e) {
    e.preventDefault();
    if (busy)
      return;
    const memberName = memberNameRef.current.value.trim();
    if (memberName === '') {
      toast.error('Please enter a name.');
      setBusy(false);
      return;
    }
    if (partyRemainingSpace <= 0) {
      toast.error('Unfortunately, the event is full.');
      setBusy(false);
      return;
    }
    setBusy(true);
    const loadingToast = toast.loading('Joining event...');
    setTimeout(() => {
      joinParty(id, { name: memberName }).then(result => {
        if (result === 'full') {
          toast.update(loadingToast, { render: 'Unfortunately, the event is full.', type: 'error', isLoading: false, autoClose: 5000, closeButton: true, closeOnClick: true });
        } else if (result === 'already in party') {
          toast.update(loadingToast, { render: 'You are already registered.', type: 'error', isLoading: false, autoClose: 5000, closeButton: true, closeOnClick: true });
        } else if (result === 'success') {
          fetchData();
          toast.update(loadingToast, { render: 'You have joined the event.', type: 'success', isLoading: false, autoClose: 5000, closeButton: true, closeOnClick: true });
        }
      }).catch(error => {
        toast.update(loadingToast, { render: 'An error has occurred.', type: 'error', isLoading: false, autoClose: 5000, closeButton: true, closeOnClick: true });
      }).finally(() => {
        setBusy(false);
      });
    }, 1000);
  }

  // update search filter results and remaining space state every time the event is updated
  useEffect(() => {
    if (!party)
      return;
    onSearchFilterChange();
    setPartyRemainingSpace(party.partyMaxSize - Object.keys(party.partyMembers).length);
  }, [party]);

  // event data fetcher
  const fetchData = async () => {
    let data = getParty({ partyId: id });
    data.then(res => {
      if (!res) {
        toast.error('Event not found.');
        navigate('/not-found');
      } else {
        setParty(res);
        setFilteredMemberList(res.partyMembers);
        onSearchFilterChange();
      }
    });
  }

  // fetch event data on first render
  useEffect(() => {
    fetchData();
  }, []);

  return (
    party &&
    <main className='py-8 px-4 pt-20 lg:h-screen'>
      <Helmet>
        <title>{party.partyName}</title>
      </Helmet>
      <div className='flex flex-col lg:flex-row'>
        <div className='p-4 m-2 border rounded-[16px] shadow-lg grow lg:grow-0 h-full lg:w-1/2'>
          {/* main info, besides description */}
          <div className='information-group py-4 pb-0 px-4'>
            <h1><strong>{party.partyName}</strong></h1>
            <h2>by <strong>{party.partyCreator}</strong></h2>
            <h3><strong>{party.partyLocation}</strong></h3>
            <div className='flex'>
              <p className='pr-2'>Spots Left: <strong>{partyRemainingSpace}</strong></p>
            </div>
            <p>Occurs on {moment(party.partyDate).format('MMMM D, YYYY')} at {moment(party.partyTime, 'HH:mm').format('h:mm A')}</p>
            {
              partyRemainingSpace <= 3 ?
                <div className='p-4 my-4 text-sm text-red-700 bg-red-100 rounded-[8px] dark:bg-red-200 dark:text-red-800'>
                  <span className="font-medium">There {partyRemainingSpace != 1 ? 'are' : 'is'} {partyRemainingSpace} spot{partyRemainingSpace != 1 ? 's' : ''} remaining.</span>
                </div> : null
            }
          </div>
          {/* description */}
          <div className='information-group'>
            <div className='w-full h-[1px] bg-[#ddd] rounded-full my-[8px]' />
            <div className='px-4 pb-4'>
              <h2><strong>Description</strong></h2>
              <div className='min-h-[64px]'>
                <p>{party.partyDescription}</p>
              </div>
            </div>
          </div>
          {/* registration, only to be shown when > 0 spots are available */}
          {
            partyRemainingSpace > 0 ?
              <div className='registration-group'>
                <div className='w-full h-[1px] bg-[#ddd] rounded-full my-[8px]' />
                <form className='input-group px-4 pb-4'>
                  <h2><strong>Registration</strong></h2>
                  <div className='mb-4'>
                    <label>
                      Name:
                      <div />
                      <input type='text' className='mt-1' ref={memberNameRef} placeholder='Name' />
                    </label>
                  </div>
                  <button type='submit' className='px-4 h-12 w-full' onClick={joinEvent} disabled={busy || partyRemainingSpace == 0}><strong>{partyRemainingSpace > 0 ? 'Join Event' : 'Event Full'}</strong></button>
                </form>
              </div>
              : null
          }
        </div>
        {/* event members */}
        <div className='p-4 m-2 border rounded-[16px] shadow-lg grow lg:h-full mb-24 lg:mb-0'>
          <div className='information-group p-4'>
            <h1><strong>Event Members</strong></h1>
          </div>
          <div className='memberlist-group px-4 pb-2 grow'>
            <div className='filter-group pb-2'>
              <div className='input-group w-72'>
                <label>
                  <div />
                  <input type='text' className='mt-1 w-48' ref={filterNameRef} onChange={onSearchFilterChange} placeholder='Name' />
                </label>
              </div>
            </div>
            <div className='list border rounded-[8px] border-[#ddd] overflow-hidden mb-2'>
              <ol className='min-h-64'>
                {/* create a default list item at the top for the event host */}
                <li key={party.partyCreator}>
                  <div className={`px-4 py-2 flex flex-col ${party.partyMembers[party.partyCreator].isHost ? 'bg-[#eee]' : ''}`}>
                    <p><strong>{party.partyCreator}</strong>{party.partyMembers[party.partyCreator].isHost ? ' (Host)' : ''}</p>
                  </div>
                </li>
                {/* item for every member in the event except for the event host */}
                {
                  Object.keys(filteredMemberList).length > 0 ? Object.keys(filteredMemberList).map(member => {
                    return (!party.partyMembers[member].isHost ?
                      <li key={member}>
                        <div className={`px-4 py-2 flex flex-col`}>
                          <p><strong>{member}</strong></p>
                        </div>
                      </li> : null
                    )
                  }) : (
                    /* if search returns no matches */
                    <li>
                      <div className={'px-4 py-2 flex flex-col'}>
                        <p>No matches were found using the search filters provided.</p>
                      </div>
                    </li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}