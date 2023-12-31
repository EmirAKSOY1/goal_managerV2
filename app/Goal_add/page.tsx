"use client"
import React,{ useState } from 'react';
import ResponsiveAppBar from '../Component/Navbar'
import Airtable from 'airtable'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
const base = new Airtable({apiKey: 'patcyvoN64kiTKinN.a1303949786dfca638e7caf3ff0276b50fb4688e7f92cd3a707916ea2b3e39eb'}).base('appK9OqsY9PmZO6k6');
const add_goal = async (title: string, detail: string, date: string) => {
  console.log("title: " + title, "detail: " + detail, "date: " + date);
  try {
    const record = await base('Goals').create({
      "title": title,
      "details": detail, // Değişkeni kullanın, "detail" stringini değil
      "complete": false,
      "Date": date, // Değişkeni kullanın, "2023-12-31" stringini değil
    });
  } catch (error) {
    console.error(error);
  }
};
export default function Goal() {
    const [inputs, setInputs] = useState({});
    const [date,setDate] = useState("");
    const handleChange = (event:any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
      const handleSubmit =  (event: any) => {
        setDate(inputs.date);
        add_goal(inputs.title,inputs.detail,inputs.date)

      }
    return (

    <>
    <ResponsiveAppBar/>
         <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 5, width: '30ch',textAlign: 'center' ,marginLeft:'5%'},
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
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
          InputLabelProps={{
            shrink: true,
          }}
          value={inputs.date || ""} 
          onChange={handleChange}
        />
      </div>
      
        
        <Button variant="outlined"  type='submit' sx={{color:'green',marginLeft:'45%'}} >Hedef Ekle</Button></Box>
    </>
    );
};
