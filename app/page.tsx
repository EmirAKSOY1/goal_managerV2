"use client";
import * as React from 'react';
import Airtable from 'airtable'
import { useEffect , useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ResponsiveAppBar from './Component/Navbar'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const base = new Airtable({apiKey: 'patcyvoN64kiTKinN.a1303949786dfca638e7caf3ff0276b50fb4688e7f92cd3a707916ea2b3e39eb'}).base('appK9OqsY9PmZO6k6');//Airtable apiKey
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
interface GoalObject {
  obj_id: string;
  obj_detail: string;
  obj_Date: string;
  obj_title: string;
  obj_comp: boolean;
}//update işlemi için veri interfacesi
export default function Home() {
  const [goals, setGoals] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open_update, setOpen_update] = useState(false);
  const [goal_id , set_goal_id] = useState({});
  const [newDetail , setnewDetail] = useState("");
  const [newTitle , setnewTitle] = useState("");
  const [newDate , setnewDate] = useState("");
  const [newComplete , setnewComplete] = useState(false);
  const handleClickOpen_update = (goal_id:string,goal_detail:string,goal_date:string,goal_title:string,goal_comp:boolean) => {
    //Hedefleri güncellemek istediğimizde textboxları dolu gelmesini sağlar
    setOpen_update(true);//güncelleme dialoğunu açar
    const obj_goal: GoalObject = {
      obj_id: goal_id,
      obj_detail: goal_detail,
      obj_Date: goal_date,
      obj_title: goal_title,
      obj_comp: goal_comp
    };//Güncellenecek hedefin verileri obje tipine getirme
    setnewDetail(goal_detail);
    setnewTitle(goal_title);
    setnewDate(goal_date);
    setnewComplete(goal_comp);
    set_goal_id(obj_goal);
  }
  const handleClose_update = () => setOpen_update(false);//Değişiklik ekranını kapatmak için
  const handleSave_update  = async (id:string) => { //Değişiklikleri Airtable'a kaydeder.
    await base('Goals').update([
      {
        "id": id,
        "fields": {
          "title": newTitle,
          "details":newDetail ,
          "Date": newDate,
          "complete": newComplete,
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
    });
    setOpen_update(false);//Değişiklik ekranını kapatır
    } 
  const hesapla = (gun : Date) => {//Hedefin son gününe kaç gün kaldığını hesaplama fonksiyonu
    const arasinda = Math.floor((date.getTime()-gun)/(1000 * 60 * 60 * 24 ))* -1
    return arasinda;
  }
   const  get_goal =async () => {//Airtable daki verileri çekme
    await base("Goals")
    .select({ view: "Grid view" })
    .eachPage((records, fetchNextPage) => {
      setGoals(records);//Hedefleri state e aktardık
      fetchNextPage();
    });
  };
  useEffect(() =>{get_goal();},[]);//Sayfa yüklendiğinde hedefleri getirmw
  return (
    <>
    <ResponsiveAppBar/>
    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
      Hedeflerim
    </h2>
    <Box sx={{ width: '100%',marginTop:'2%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {goals.map((goal,index) => (//hedefleri teker teker kart formatında göster
        <Grid key={goal.id} item xs={6}>
        <Item>
        <Card  sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {goal.fields.Created.split('T')[0]}
            </Typography>
            <Typography variant="h5" component="div">
            {goal.fields.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Durum:<input type="checkbox" defaultChecked={goal.fields.complete} disabled/>
            </Typography>
            <Typography variant="body2" className='metin' >
            {goal.fields.details}
              <br />
              <span style={{ color: hesapla(Date.parse(goal.fields.Date)) > 0 ? 'green' : 'red' }} >
              Kalan Gün :{hesapla(Date.parse(goal.fields.Date)) <= 0 ? 'Artık Çok Geç': hesapla(Date.parse(goal.fields.Date)) }
              </span>
            </Typography>
        </CardContent>
       <CardActions>
        <Button size="small" onClick={()=>{handleClickOpen_update(goal.id,goal.fields.details,goal.fields.Date,goal.fields.title,goal.fields.complete)}}>Düzenle</Button>{/*Karttaki düzenle butonuna tıklandığında ilgili kartın düzenlenmesi */} 
        <Button size="small" onClick={()=>{
          base('Goals').destroy(goal.id, function(err, deletedRecord) {//İlgili hedefin silinmesi
          get_goal();//Hedef Siliince hedeflerin yenilenmesi
          if (err) {
          console.error(err);
          return;
          }});
          }}style={{color:"red"}}>Sil</Button>
      </CardActions>
       </Card>
     </Item>
        </Grid>
      ))}
           </Grid>
    </Box>
    <React.Fragment>
      <Dialog open={open_update} onClose={handleClose_update}>{/*Hedefi düzenleme dialoğunun açılması*/}
        <DialogTitle>
            <TextField
            autoFocus
            margin="dense"
            id="detail"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={goal_id.obj_title}
            onChange={(e) => setnewTitle(e.target.value)/*Title değeri güncellendiğinde state e aktarıyor*/ }
          />
          
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="detail"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={goal_id.obj_detail}
            onChange={(e) => setnewDetail(e.target.value)/*detail değeri güncellendiğinde state e aktarıyor*/}
          />
          <TextField
            autoFocus
            margin="dense"
            id="detail"
            type="date"
            fullWidth
            variant="standard"
            defaultValue={goal_id.obj_Date}
            onChange={(e) => setnewDate(e.target.value)/*date değeri güncellendiğinde state e aktarıyor*/}
          />
          <input type="checkbox" defaultChecked={goal_id.obj_comp}  onChange={(e) => setnewComplete(e.target.checked)/*complete checkbox ı değiştiğinde state e aktarıyor*/ } />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose_update}>İptal</Button>
          <Button onClick={()=>handleSave_update(goal_id.obj_id)/*Değişiklik yapılan hedefin id sini kaydedecek fonksiyona parametre yolluyor*/}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
</>
  )
}
