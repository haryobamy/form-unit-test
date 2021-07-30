import React from "react";
import "./App.css";
import styled from "styled-components";

import axios from 'axios'

const Form = styled.form`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin:50px auto;
background: whitesmoke;
color: #aa9f9f;
`;

const FormItem = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
margin-bottom: 20px;

input{
  border: none;
  border-bottom: 1px solid gray;
  height: 40px;
  background: transparent;
  font-size: 18px;
  outline: none;
}

`;

const Button = styled.div`
background: teal;
padding: 5px 10px;
border-radius: 5px;
border: none;

`;

const Error = styled.p`
color: red;
margin-top:-10px;
`;

const LoggedIn = styled.p`
color: green;
font-size: 30px;
font-weight: bold;
display: flex;
align-items: center;
justify-content: center;

`;

export const validateInput = (str = " ") => str.includes("@")

const App = ({ handleSubmit, url }) => {

  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  })

  const [data, setData] = React.useState(null)


  React.useEffect(() => {

    let mounted = true;
    const loginData = async () => {
      const response = await axios.get(url);
      if (mounted) {
        setData(response.data);
      }
    };
    loginData();

    return () => {
      mounted = false
    }

  }, [url])

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value

    })
    console.log(value)
  }

  // const handleSubmit = async e => {
  //   e.preventDefault()
  //   const response = await APIService.getData(state.username)
  //   if (response.ok) {
  //     setFormData({
  //       username: "",
  //       password: "",
  //       message: `Welcome Back ${ formData.username } `
  //     })
  //   }
  // }

  return (
    <>
      <Form name='login-form' onSubmit={handleSubmit}>
        <FormItem>
          <label htmlFor="username"> Username</label>
          <input type="username" id='username' name='username' value={formData.username} onChange={handleChange} />
        </FormItem>

        <FormItem>
          <label htmlFor="password"> Password</label>
          <input type="password" id='password' name='password' value={formData.password} onChange={handleChange} />
        </FormItem>
        {formData.password && !validateInput(formData.password) ? <Error>Password Must Contain Symbols</Error> : null}
        <Button role='button' >Submit</Button>
      </Form >


      {!data && <LoggedIn data-testid="loading" >Verifying user ....</LoggedIn>}
      {data && <LoggedIn data-testid="loggedin" > {data.message}</LoggedIn>}

    </>
  );
};

export default App;
