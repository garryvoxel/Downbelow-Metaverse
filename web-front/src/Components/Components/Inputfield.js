import React from 'react';
import { Button } from '../Assets/button';
import { Login, Register} from '../../Services/API_User';
import { Label } from '../Assets/typography';


export function InputField (props) {
    return <div>
        <Label for="user" buttonText="LOGIN"></Label>
        <Button id="user" handleClick={() => Login('userEmail', '123456', () => console.log('login'))}></Button>
    </div>
}
