import React from 'react'
import { Link } from "react-router-dom"

export default function Header() {
    return (
        <div>
            <Link to="/">
                <button className='bg-slate-400 mr-3'>
                    Home
                </button>
            </Link>

            <Link to="/about">
                <button>
                    about
                </button>
            </Link>
            <Link to="/contact">
                <button>
                    contact
                </button>
            </Link>
            <Link to="/community">
                <button>
                    community
                </button>
            </Link>
            <Link to="/login">
                <button>
                    login
                </button>
            </Link>
        </div>
    )
}
