import React, { useContext, useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import './Modal.css';

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
    const modalRef = useRef();
    const [value, setValue] = useState();

    useEffect(() => {
      setValue(modalRef.current);
    }, [])

    return (
      <>
        <ModalContext.Provider value={value}>
          {children}
        </ModalContext.Provider>
        <div className='modals-parent' ref={modalRef} />
      </>
    );
  }

  export function Modal({ onClose, children }) {
    const modalNode = useContext(ModalContext);
    if (!modalNode) return null;

    return ReactDOM.createPortal(
      <div id="modal">
        <div id="modal-background" onClick={onClose} />
        <div id="modal-content">
          {children}
        </div>
      </div>,
      modalNode
    );
  }

  export function SignupModal({onCloseSignup, children}) {
      const modalNode = useContext(ModalContext);
      if (!modalNode) return null;

      return ReactDOM.createPortal(
          <div id="modal">
              <div id="modal-background" onClick={onCloseSignup} />
              <div id="modal-content">
                  {children}
              </div>
          </div>,
          modalNode
      )
  }

  export function CreateSongModal({onCloseSong, children}) {
    const modalNode = useContext(ModalContext);
    if (!modalNode) return null;

    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={onCloseSong} />
            <div id="modal-content">
                {children}
            </div>
        </div>,
        modalNode
    )
}

export function CreateAlbumModal({onCloseAlbum, children}) {
  const modalNode = useContext(ModalContext);
  if (!modalNode) return null;

  return ReactDOM.createPortal(
      <div id="modal">
          <div id="modal-background" onClick={onCloseAlbum} />
          <div id="modal-content">
              {children}
          </div>
      </div>,
      modalNode
  )
}
