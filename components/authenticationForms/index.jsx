import React, { useState } from "react";
import Dialog from "@/ui/Dialog";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import OtpForm from "./OtpForm";

const AuthenticationForms = ({ isLoginOpen, onOpenLogin, onCloseLogin }) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isOtpFormOpen, setisOtpFormOpen] = useState(false);

  const handleOpenRegistration = () => {
    setIsRegisterOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegisterOpen(false);
  };

  const handleOpeneOtp = (userEmail) => {
    setEmail(userEmail);
    setisOtpFormOpen(true);
  };

  const handleCloseOtp = () => {
    setisOtpFormOpen(false);
  };

  return (
    <>
      <Dialog isOpen={isLoginOpen} onClose={onCloseLogin}>
        <LoginForm
          onOpenRegistration={handleOpenRegistration}
          onCloseLogin={onCloseLogin}
          onOpenOtp={handleOpeneOtp}
        />
      </Dialog>

      <Dialog isOpen={isRegisterOpen} onClose={handleCloseRegistration}>
        <RegistrationForm
          onOpenLogin={onOpenLogin}
          onCloseRegistration={handleCloseRegistration}
          onOpenOtp={handleOpeneOtp}
        />
      </Dialog>
      <Dialog isOpen={isOtpFormOpen} onClose={handleCloseOtp}>
        <OtpForm email={email} onCloseOtp={handleCloseOtp} />
      </Dialog>
    </>
  );
};

export default AuthenticationForms;
