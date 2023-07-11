import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Transaction from './App';

import Return from './Return';

const router = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path='/' element={<Transaction />} />
          <Route exact path='/return' element={<Return />} />
        </Routes>
      </Router>
    </div>
  );
};

export default router;
