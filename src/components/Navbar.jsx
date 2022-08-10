import { Router, Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Navbar() {
  return (
    <nav className="navbar flex row items-center fixed h-16 border-box p-8 w-full">
      <Link to="/create">
        <div className='flex items-center uppercase'>
          <CalendarMonthIcon />
          <span className='px-2 text-lg'><strong>Eve-ent-ual</strong> </span>
        </div>
      </Link>
    </nav>
  )
}