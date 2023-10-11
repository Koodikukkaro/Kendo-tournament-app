import React, {useState} from 'react';
import './registration.css';

const RegisterForm = () => {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [rank, setRank] = useState('');
    const [club, setClub] = useState('');
    const [suomisport, setSuomisport] = useState('');
    const [underage] = useState(false);
    const [consent, setConsent] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [guardianEmail, setGuardianEmail] = useState('');


    const onSubmit = (event) => {
        event.preventDefault();
        /** here how user is actually added somewhere */
    }

    function toggle() {
        setIsOpen((isOpen) => !isOpen);
    }

    return (
        <form id="registerForm" className="form" onSubmit={onSubmit}>
            <h1 className="header">Create a KendoApp account</h1>
            <p className="subtext">Already have an account? <a href="url">Log in</a> </p>
            <p className="subtext"> Fill in the fields below. Fields marked with * are required.</p>
            
            <div className="field">
                <input 
                type="text" 
                name="firstname" 
                id="firstname" 
                placeholder="First name *" 
                value={firstname}
                onChange={({target}) => setFirstname(target.value)}
                required />
            </div>
            <div className="field">
                <br/>
                <label htmlFor="lastname"></label>
                <input 
                type="text" 
                name="lastname" 
                id="lastname" 
                placeholder="Last name *" 
                value={lastname}
                onChange={({target}) => setLastname(target.value)}
                required />
            </div>
            <div className="field">
                <br/>
                <label htmlFor="username"></label>
                <input 
                type="text" 
                name="username" 
                id="username"
                placeholder="Username *" 
                value={username}
                onChange={({target}) => setUsername(target.value)}
                required />
            </div>
            <div className="field">
                <br/>
                <label htmlFor="email"></label>
                <input 
                type="email"
                name="email" 
                id="email" 
                placeholder="Email *" 
                value={email}
                onChange={({target}) => setEmail(target.value)}
                required />
            </div>
            <div className="field">
                <br />
                <label htmlFor="tel"></label>
                <input 
                type="tel" 
                name="tel" 
                id="tel" 
                placeholder="Phone number * (e.g. +358...)" 
                value={tel}
                onChange={({target}) => setTel(target.value)}
                required />
            </div>
            <div className="field">
                <br />
                <label htmlFor="password"></label>
                <input 
                type="password"
                name="password" 
                id="password" 
                placeholder="Password *" 
                value={password}
                onChange={({target}) => setPassword(target.value)}
                required />
                <i className="fa-solid fa-eye" id="eye" />
            </div>
            <div className="field">
                <br />
                <label htmlFor="passwordConfirmation"></label>
                <input 
                type="password"
                name="passwordConfirmation" 
                id="password" 
                placeholder="Password *" 
                value={passwordConfirmation}
                onChange={({target}) => setPasswordConfirmation(target.value)}
                required />
                <i className="fa-solid fa-eye" id="eye" />
            </div>
            <div className="field">
                <br />
                <label htmlFor="rank"></label>
                <input 
                type="text" 
                name="rank" 
                id="rank" 
                placeholder="Rank" 
                value={rank}
                onChange={({target}) => setRank(target.value)}/>
            </div>
            <div className="field">
                <br />
                <label htmlFor="club"></label>
                <input 
                type="text" 
                name="club" 
                id="club" 
                placeholder="Club" 
                value={club}
                onChange={({target}) => setClub(target.value)}/>
            </div>
            <div className="field">
                <br />
                <label htmlFor="suomisport"></label>
                <input 
                type="text" 
                name="suomisport" 
                id="suomisport" 
                placeholder="Suomisport ID" 
                value={suomisport}
                onChange={({target}) => setSuomisport(target.value)}/>
            </div>
            <div className="field-checkbox">
                <input 
                    type="checkbox" 
                    id="underage" 
                    value={underage}
                    checked={isOpen}
                    onChange={toggle} />
                {/* */}
                <label htmlFor="underage">I'm underage</label>
                { isOpen && (<div className="field">
                    <br />
                    <label htmlFor="guardian-email"></label>
                    <input 
                    type="text" 
                    name="guardian-email" 
                    id="guardian-email" 
                    placeholder="Guardian's email" 
                    value={guardianEmail}
                    onChange={({target}) => setGuardianEmail(target.value)} />
                </div>
                )}
            </div>        
            <div className="field-checkbox">
                <input type="checkbox" id="conditions" 
                value={consent}
                onChange={({target}) => setConsent(target.value)}/>
                <label htmlFor="conditions">By checking this box I agree to the <a href="url">terms and conditions</a> *</label>   
            </div>
            <div className="field">
                <button type="submit" id="btnRegister">Register</button>
            </div>
        </form>
    );    
};

export default RegisterForm;