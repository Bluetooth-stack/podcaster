import React, { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';

function FileInput({ value, accept, id, Label, fileFor, fileHandleFunc }) {
    const [selectedFile, setSelectedFile] = useState(null);

    function onChangeHandle(e) {
        if (e.target.files[0]){
            setSelectedFile(e.target.files[0]?.name);
            fileHandleFunc(e.target.files[0])
        }
    }
    return (
        <div className='fileInputHolder'>
            <label className='labelDesign' htmlFor={id}>
                {
                    selectedFile ?
                        <>
                            <span style={{color:'var(--blue)', fontWeight: '500'}} >{selectedFile}</span>
                            <CreateIcon className='editIcon' />
                        </>
                        :
                        <>
                            {Label && <Label />} <span>{fileFor}</span>
                        </>
                }

            </label>
            <input type='file' accept={accept} id={id} style={{ display: 'none' }} onChange={onChangeHandle} />
        </div>
    )
}

export default FileInput