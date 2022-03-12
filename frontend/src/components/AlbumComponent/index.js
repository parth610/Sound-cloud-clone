import React, { useState} from "react";
import { CreateAlbumModal } from "../../context/Modal";
import CreateAlbumComponent from './CreateAlbumComponent';

function CreateAlbumFormModal() {
    const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
    return (
        <>
            <button className='create-song-button' onClick={() => setShowCreateAlbumModal(true)}>Create New Album</button>
      {showCreateAlbumModal && (
        <CreateAlbumModal onCloseAlbum={() => setShowCreateAlbumModal(false)}>
          <CreateAlbumComponent />
        </CreateAlbumModal>
      )}
        </>
    )
}

export default CreateAlbumFormModal;
