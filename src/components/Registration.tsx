import * as React from 'react';
import {useState, useRef} from 'react';

type Props = {
    open: boolean;
    registerButtonClickHandler:(inputVal:string, refToInput:React.MutableRefObject<HTMLInputElement>)=>void;
    cancelRegisterClickHandler:()=>void;
}

const Registration = ({ open,  registerButtonClickHandler, cancelRegisterClickHandler}: Props) => {

    const [inputVal, setInputVal]=useState<string>('');
    const refInput=useRef(null);
    const className=( open? 'regForm regForm_rFOpen' : 'regForm regForm_rFClose');
    const userName=localStorage.getItem('user');
    const m=<p className={'regForm__p'}>you are registered allready as {userName}. <br/> Want to register by new name? All previous information will be lost!</p>;
    const message=(!userName)?null:m;

    return (<form className={className} onSubmit={(e)=>{e.preventDefault(); setInputVal(inputVal.trim()); registerButtonClickHandler(inputVal, refInput)}}>
        {message}
        <input ref={refInput} className={'regForm__input'} type={'text'} placeholder={'Enter your name'} value={inputVal} onChange={(e)=>setInputVal(e.target.value)} onMouseDown={(e)=>{e.stopPropagation();/*This is because of e.preventDefault in parent Element because of it we can not enter text into the input*/}}></input>
        <button className={'regForm__button'}  onClick={(e)=>{e.preventDefault(); setInputVal(inputVal.trim()); registerButtonClickHandler(inputVal, refInput)}}> Register</button>
        <button className={'regForm__button'}  onClick={(e)=>{e.preventDefault();  cancelRegisterClickHandler()}}>Cancel</button>
    </form>);
}

export default Registration;