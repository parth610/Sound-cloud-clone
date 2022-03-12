import React, { useState} from "react";
import { CreateSongModal } from "../../context/Modal";
import CreateSongComponent from "./CreateSongComponent";

function CreateSongFormModal() {
    const [showCreateSongModal, setShowCreateSongModal] = useState(false);
    return (
        <>
            <button className='create-song-button' onClick={() => setShowCreateSongModal(true)}>Upload New Song</button>
      {showCreateSongModal && (
        <CreateSongModal onCloseSong={() => setShowCreateSongModal(false)}>
          <CreateSongComponent />
        </CreateSongModal>
      )}
        </>
    )
}

export default CreateSongFormModal;
