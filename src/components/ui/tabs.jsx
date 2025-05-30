// src/components/ui/tabs.jsx
import React, { useState } from "react";

export function Tabs({ tabs, currentTab, onTabChange }) {
  return (
    <div className="flex space-x-2 mb-4 border-b">
      {tabs.map((tab) => (
        <Tab
          key={tab}
          label={tab}
          isActive={currentTab === tab}
          onClick={() => onTabChange(tab)}
        />
      ))}
    </div>
  );
}

export function Tab({ label, isActive, onClick }) {
  return (
    <button
      className={`py-2 px-4 font-medium border-b-2 ${
        isActive ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
      } hover:text-blue-600`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
