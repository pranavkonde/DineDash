import React from "react";

function Cancel() {
  return (
    <>
      <h4>Oops! Your payment has been cancelled.</h4>
      <p>
        We appreciate your business! If you have any questions, please email us
        at
        <a href='mailto:orders@example.com'>orders@example.com</a>.
      </p>
      <div>
        <button>
          {" "}
          <a href='/'> Go to Home page</a>
        </button>
      </div>
    </>
  );
}

export default Cancel;
