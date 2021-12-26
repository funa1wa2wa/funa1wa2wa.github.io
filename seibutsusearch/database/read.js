let database = [];

const files = {
  "biodic": [
    "do03_chorui.csv",
    "do04_honyurui.csv",
    "do04_kairui.csv",
    "do04_konchurui_cho.csv",
    "do04_konchurui_ga.csv",
    "do04_konchurui_kochu.csv",
    "do04_konchurui_semi.csv",
    "do04_konchurui_tonbo.csv",
    "do04_ryoseiruihachurui.csv",
    "do04_tansuigyorui.csv",
    "do05_honyurui.csv",
    "do05_kairui.csv",
    "do05_konchurui_cho.csv",
    "do05_konchurui_ga.csv",
    "do05_konchurui_kochu.csv",
    "do05_konchurui_semi.csv",
    "do05_konchurui_tonbo.csv",
    "do05_ryoseiruihachurui.csv",
    "do05_tansuigyorui.csv"
  ],
  "biodic02":[
    "do02_chorui_1.csv",
    "do02_chorui_2.csv",
    "do02_honyurui.csv",
    "do02_konchurui.csv",
  ],
  "biodic06":[
    "do06_honyurui.csv"
  ]
}
for(let type of Object.keys(files)){
  for(let fileName of files[type]){
    fetch(`https://funa1wa2wa.github.io/seibutsusearch/database/biodic/${fileName}`)
    .then(res=>res.text())
    .then(text=>{
      let obj = CSVtoAry(text);
      switch(type){
        case "biodic":
          database = database.concat(obj.map(x=>({
            name : x[4],
            meshcode : x[5],
            date : x[6],
            year : Number("19"+x[6].slice(0, 2))
          })));
          break;
        case "biodic02":
          database = database.concat(obj.map(x=>({
            name : x[4],
            meshcode : x[0],
            date : "78--",
            year : 1978
          })));
          break;
        case "biodic06":
          database = database.concat(obj.map(x=>({
            name : x[0],
            meshcode : x[1].slice(0, 6),
            date : "04--",
            year : 2004
          })));
          break;
      }
    });
  }
}

function CSVtoAry(str){
  return str.replaceAll("\"", "").split(/\r?\n/).map(x=>x.split(",")).filter(x=>x.length>1);
}
