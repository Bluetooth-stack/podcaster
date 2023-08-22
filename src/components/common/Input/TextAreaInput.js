import React from 'react'

function TextAreaInput({ value, setValue, placeholder, required, rows, cols }) {
    return (
        <section className='inputHolder'>
            <textarea className='input'
                rows={rows}
                cols={cols}
                value={value}
                onChange={(e) => { setValue(e.target.value) }}
                required={required}
                placeholder={placeholder}
            ></textarea>
            <div className='bottom'></div>
        </section>
    )
}

export default TextAreaInput