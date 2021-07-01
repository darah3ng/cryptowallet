import React from 'react';
import { Typography as Typo } from '@supabase/ui';
import AddressDetails from './component/AddressDetails';
import './App.css';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Typo.Title style={{ color: '#655757' }}>Wallet Tracker</Typo.Title>
      </header>

      <div className='App-body '>
        <AddressDetails />
      </div>
    </div>
  );
}

export default App;
