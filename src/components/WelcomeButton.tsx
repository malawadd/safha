import { useState } from "react";
import ConnectButton from "./ConnectButton";

const WelcomeButton = () => {
  const [clicked, setClicked] = useState(false);

  const onClick = () => {
    setClicked(true);
  };

  if (clicked) {
    return <ConnectButton />;
  } else {
    return (
      <button
        className="text-xl bg-blue-100 hover:bg-blue-300 py-2 px-4 rounded-lg shadow-md"
        onClick={onClick}
      >
        try Safha
      </button>
    );
  }
};

export default WelcomeButton;