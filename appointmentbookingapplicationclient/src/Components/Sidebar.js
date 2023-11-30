
import React from 'react';

import './Sidebar.css'

function Sidebar( {sidebarOption} ) {
    return (
      <div className="sidebar-container">
        {sidebarOption}
      </div>
    )
}

export default Sidebar;