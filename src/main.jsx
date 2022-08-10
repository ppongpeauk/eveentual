import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Import Contexts
import { StoreProvider } from './contexts/StoreContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  // </React.StrictMode>
)
