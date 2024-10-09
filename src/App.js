import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Opportunities from './Page/Opportunities.jsx';

function App() {
  console.log('App component rendered');
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/opportunities" element={<Opportunities />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
// import React from 'react';

// function App() {
//   console.log('App component rendered');
//   return (
//     <div className="App">
//       <h1 className="text-3xl font-bold text-red-500">Hello, World!</h1>
//     </div>
//   );
// }

// export default App;
