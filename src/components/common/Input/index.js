import React from 'react'
import './style.css'

function Input({ type, value, setValue, placeholder, required }) {
    return (
        <section className='inputHolder'>
            <input className='input'
                type={type}
                value={value?value:''}
                onChange={(e) => { setValue(e.target.value) }}
                required={required}
                placeholder={placeholder}
            />
            <div className='bottom'></div>
        </section>
    )
}

export default Input