import React, { useState } from "react";
import { SignupModal } from "../../context/Modal";
import SignupForm from "./SignupForm";

function SignupFormModal() {
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowSignupModal(true)}>Sign Up</button>
      {showSignupModal && (
        <SignupModal onCloseSignup={() => setShowSignupModal(false)}>
          <SignupForm />
        </SignupModal>
      )}
    </>
  )
}

export default SignupFormModal
