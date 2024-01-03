"use client"
import React,{ useState } from 'react';
import ResponsiveAppBar from '../Component/Navbar'
import Airtable from 'airtable'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
const base = new Airtable({apiKey: 'patcyvoN64kiTKinN.a1303949786dfca638e7caf3ff0276b50fb4688e7f92cd3a707916ea2b3e39eb'}).base('appK9OqsY9PmZO6k6');
export default function Goal() {
  const [inputs, setInputs] = useState({});
  const handleChange = (event:any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
  const add_goal =  (title: string, detail: string, date: string) => {
    try {
      base('Goals').create({
        "title": title,
        "details": detail, 
        "complete": false,
        "Date": date, 
        });
    } catch (error) {
      console.error("hata");
      }
  };
  const handleSubmit =  (event: any) => {
    add_goal(inputs.title,inputs.detail,inputs.date)
  }
  return (
    <>
    <ResponsiveAppBar/>
      <Box
        sx={{
        '& .MuiTextField-root': { m: 5, width: '30ch',textAlign: 'center' ,marginLeft:'5%'},
        }}
        noValidate
        autoComplete="off"
      >
      <div>
        <TextField
          required
          id="outlined-required"
          name='title'
          label="Başlık"
          value={inputs.title || ""} 
          onChange={handleChange}
        />
        <TextField
          required
          id="outlined-disabled"
          name='detail'
          label="Detay"
          value={inputs.detail || ""} 
          onChange={handleChange}
        />
        <TextField
        required
          id="outlined-number"
          name='date'
          label="Son Tarih"
          type="date"
          InputLabelProps={{shrink: true,}}
          value={inputs.date || ""} 
          onChange={handleChange}
        />
      </div>
      <Button variant="outlined"  type='submit' sx={{color:'green',marginLeft:'45%'}} onClick={handleSubmit} >Hedef Ekle</Button></Box>
    </>
  );
};
