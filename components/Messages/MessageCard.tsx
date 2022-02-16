import React, { useState } from "react";

export default function MessageCard({ message }) {
  const [showFullMsg, setShowFullMsg] = useState(false);
  return (
    <div>
      <div className="p-4">
        <div className="flex flex-row justify-between items-center">
          <div className="px-4 font-medium">{message.title}</div>
          <div
            className="px-4 text-xl"
            onClick={() => setShowFullMsg(!showFullMsg)}
          >
            +
          </div>
        </div>
        {showFullMsg && (
          <div className="flex flex-col p-4">
            <div className="mb-4">{message.context}</div>
            <div>
              {new Date(Date.parse(message.createDateTime)).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
